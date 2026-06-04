const OUTPOSTS = [
  { id: 'valley4', name: '4번 협곡' },
  { id: 'wuling',  name: '무릉' },
];

// 현재 활성 거점
let activeOutpostId = OUTPOSTS[0].id;

// 거점별 데이터 저장소
// outpostData[id] = { resourceRates, groups, targetRates, nextGroupId }
const outpostData = {};
OUTPOSTS.forEach(o => {
  outpostData[o.id] = {
    resourceRates: Object.fromEntries(RESOURCE_ITEMS.map(r => [r.key, 0])),
    groups: [],
    targetRates: Object.fromEntries(Object.keys(AUTH_VALUE).map(k => [k, 0])),
    nextGroupId: 1,
  };
});

// 현재 거점 데이터 접근 헬퍼
function od() { return outpostData[activeOutpostId]; }
window.od = od;

// 기존 코드 호환용 프록시 (함수들이 od()를 통해 접근)
function getResourceRates()  { return od().resourceRates; }
function getGroups()         { return od().groups; }
function setGroups(g)        { od().groups = g; }
function getTargetRates()    { return od().targetRates; }
function getNextGroupId()    { return od().nextGroupId; }
function bumpNextGroupId()   { od().nextGroupId++; return od().nextGroupId - 1; }

// 기존 변수명 유지 (함수 내부에서 od() 경유)
// 프리셋 (거점 공통)
let presets = [];
let pendingGroupId = null;

// ========== RECIPE RATE CALC ==========
// 숫자 포맷: 소수점 있을 때만 표시, 최대 2자리
function fmt(n) {
  if (n === null || n === undefined || isNaN(n) || !isFinite(n)) return '0';
  if (n === 0) return '0';
  const r = Math.round(n * 100) / 100;
  return r % 1 === 0 ? r.toString() : r.toFixed(2).replace(/\.?0+$/, '');
}

// 아이템 아이콘 URL 맵 - localStorage에서 불러오거나 위키 URL 기본값 사용
const BASE_WIKI = 'https://static0.fextralifeimages.com/file/arknightsendfield/';
const ITEM_ICONS_DEFAULT = {
  '오리지늄 광석': BASE_WIKI + '8/81/Originium-ore.png',
  '페리움 광석':   BASE_WIKI + '6/65/Ferrium-ore.png',
  '적동 광석':     BASE_WIKI + 'e/e8/Cuprium-ore.png',
  '청정수':        BASE_WIKI + 'f/f2/Clean-water.png',
  '카본':          BASE_WIKI + 'd/d9/Carbon.png',
  '오염수':        BASE_WIKI + 'c/cd/Sewage.png',
};

// 사용자가 직접 업로드한 아이콘 (base64) - localStorage에 저장됨
let ITEM_ICONS_CUSTOM = {};

function loadCustomIcons() {
  try {
    const raw = localStorage.getItem('endfield_icons_v1');
    if (raw) ITEM_ICONS_CUSTOM = JSON.parse(raw);
  } catch(e) {}
}

function saveCustomIcons() {
  try { localStorage.setItem('endfield_icons_v1', JSON.stringify(ITEM_ICONS_CUSTOM)); } catch(e) {}
}

// 아이콘 조회
function getItemIconUrl(name) {
  return ITEM_ICONS_DEFAULT[name] || null;
}

function itemIcon(name, size = 32) {
  const url = getItemIconUrl(name);
  if (!url) return '';
  return `<img src="${url}" alt="${name}" width="${size}" height="${size}"
    style="border-radius:4px;object-fit:contain;vertical-align:middle;margin-right:6px;flex-shrink:0;"
    onerror="this.style.display='none'">`;
}
function getRate(recipe, count) {
  if (count === 0) return { inputs: {}, outputs: {} };
  if (recipe.mineRate !== undefined) {
    // 채굴기: 분당 고정 생산량
    const outName = recipe.outputs[0].name;
    return { inputs: {}, outputs: { [outName]: recipe.mineRate * count } };
  }
  // 일반: 분당 생산량 = (60 / 제작속도) * 결과수 * 설비수
  const perMin = 60 / recipe.speed;
  const inp = {}, out = {};
  recipe.inputs.forEach(i => inp[i.name] = (inp[i.name]||0) + perMin * i.qty * count);
  recipe.outputs.forEach(o => out[o.name] = (out[o.name]||0) + perMin * o.qty * count);
  return { inputs: inp, outputs: out };
}

// ========== CALCULATE TOTALS ==========
function calcTotals(oId) {
  const data = oId ? outpostData[oId] : od();
  const totalIn = {}, totalOut = {};

  RESOURCE_ITEMS.forEach(r => {
    const val = (data.resourceRates[r.key]) || 0;
    if (val > 0) totalOut[r.key] = (totalOut[r.key] || 0) + val;
  });

  data.groups.forEach(g => {
    const mult = g.mult || 1;
    g.equips.forEach(e => {
      const recipe = RECIPES.find(r => r.id === e.recipeId);
      if (!recipe) return;
      const cnt = (e.count || 0) * mult;
      const { inputs, outputs } = getRate(recipe, cnt);
      Object.entries(inputs).forEach(([k,v])  => totalIn[k]  = (totalIn[k]||0)  + v);
      Object.entries(outputs).forEach(([k,v]) => totalOut[k] = (totalOut[k]||0) + v);
    });
  });

  const allKeys = new Set([...Object.keys(totalIn), ...Object.keys(totalOut)]);
  const result = {};
  allKeys.forEach(k => {
    result[k] = { consume: totalIn[k]||0, produce: totalOut[k]||0, balance: (totalOut[k]||0)-(totalIn[k]||0) };
  });
  return result;
}

// ========== RESOURCE INPUTS ==========
function renderResourceInputs() {
  const rr = od().resourceRates;
  let html = '';
  RESOURCE_ITEMS.forEach(r => {
    const val = rr[r.key] || 0;
    html += `<div class="resource-row">
      <div>
        <div class="resource-name" style="color:var(--text-sub)">${r.label}</div>
        <div class="resource-unit">분당 총 생산량</div>
      </div>
      <input type="number" class="resource-input" min="0" step="0.1" value="${val||''}" placeholder="0"
        oninput="updateResource('${r.key}', this.value)">
    </div>`;
  });
  document.getElementById('resource-inputs').innerHTML = html;
}

function updateResource(key, val) {
  od().resourceRates[key] = parseFloat(val) || 0;
  renderResults();
  renderAuthProducts();
  scheduleSave();
}

// ========== INNER TAB SWITCH ==========
function switchInnerTab(tab) {
  document.getElementById('inner-resource').style.display = tab === 'resource' ? 'block' : 'none';
  document.getElementById('inner-equip').style.display   = tab === 'equip'    ? 'block' : 'none';
  document.getElementById('itab-resource').classList.toggle('active', tab === 'resource');
  document.getElementById('itab-equip').classList.toggle('active',    tab === 'equip');
}

// ========== RESOURCE 접기/펼치기 ==========
let resourceCollapsed = false;
function toggleResourceConfig() {
  resourceCollapsed = !resourceCollapsed;
  const wrap = document.getElementById('resource-config-wrap');
  const btn  = document.getElementById('resource-toggle-btn');
  wrap.classList.toggle('collapsed', resourceCollapsed);
  btn.textContent = resourceCollapsed ? '▼ 펼치기' : '▲ 접기';
}

// ========== AUTH TAB SWITCH ==========
function switchAuthTab(tab) {
  document.getElementById('auth-inner-base').style.display    = tab === 'base'    ? 'block' : 'none';
  document.getElementById('auth-inner-product').style.display = tab === 'product' ? 'block' : 'none';
  document.getElementById('atab-base').classList.toggle('active',    tab === 'base');
  document.getElementById('atab-product').classList.toggle('active', tab === 'product');
}

// ========== WORKSPACE ==========
function renderWorkspace() {
  const ws = document.getElementById('workspace');
  if (!ws) return;
  const gs = od().groups;
  if (gs.length === 0) {
    ws.innerHTML = `<div class="empty-state" style="padding:32px;">
    <div class="icon">🏭</div>
    <div style="font-size:13px;font-weight:600;margin-bottom:8px;">아직 설비가 없어요</div>
    <div style="font-size:11px;color:var(--text-label);line-height:1.8;text-align:left;display:inline-block;">
      1️⃣ <b>+ 그룹 추가</b> 버튼으로 그룹을 만들고<br>
      2️⃣ 그룹 안의 <b>+ 설비 추가</b>로 설비를 선택한 뒤<br>
      3️⃣ 설비 <b>수량을 입력</b>하면 생산량이 계산돼요
    </div>
  </div>`;
    updateActiveCount();
    return;
  }
  ws.innerHTML = gs.map(g => renderGroupHTML(g)).join('');
  updateActiveCount();
}

function renderGroupHTML(g) {
  const equipRows = g.equips.map(e => {
    const recipe = RECIPES.find(r => r.id === e.recipeId);
    if (!recipe) return '';
    const cnt = e.count || 0;
    const totalCnt = cnt * (g.mult || 1);

    const makeLines = (items, sign, color) => items.map(item => {
      const rate = totalCnt > 0 ? fmt((60 / recipe.speed) * item.qty * totalCnt) : null;
      return `<div style="display:flex;justify-content:space-between;align-items:center;gap:4px;padding:1px 0;font-size:10px;">
        <span style="display:flex;align-items:center;min-width:0;gap:2px;">
          <span style="color:${color};font-weight:700;flex-shrink:0;font-size:9px;">${sign}</span>
          ${itemIcon(item.name, 14)}
          <span style="color:var(--text-sub);">${item.name}</span>
        </span>
        ${rate ? `<span style="color:var(--text-muted);font-family:'Share Tech Mono',monospace;font-size:9px;flex-shrink:0;">${rate}/분</span>` : ''}
      </div>`;
    }).join('');

    const outLines = makeLines(recipe.outputs, '+', 'var(--success)');
    const inLines  = recipe.inputs.length > 0
      ? makeLines(recipe.inputs,  '−', 'var(--danger)')
      : `<div style="color:var(--text-muted);font-size:10px;padding:1px 0;">원자재</div>`;

    const divider = recipe.inputs.length > 0 && recipe.outputs.length > 0
      ? `<div style="border-top:1px dashed rgba(80,100,140,0.4);margin:4px 0;"></div>`
      : '';

    return `<div class="ws-equip-row">
      <div style="min-width:0;flex:1;cursor:pointer;" onclick="openEquipModal(${g.id}, ${e.recipeId})" title="클릭해서 레시피 변경">
        <div id="wsout-${g.id}-${e.recipeId}">${outLines}</div>
        ${divider}
        <div id="wsin-${g.id}-${e.recipeId}">${inLines}</div>
      </div>
      <input type="number" class="ws-count-input" min="0"
        value="${cnt||''}" placeholder="0"
        oninput="updateEquipCount(${g.id},${e.recipeId},this.value)">
      <button class="ws-del-btn" onclick="removeEquip(${g.id},${e.recipeId})" title="제거">✕</button>
    </div>`;
  }).join('');

  const collapsed = g.collapsed || false;
  const bodyHTML = collapsed ? '' : `
    <div style="display:flex;flex-direction:column;gap:4px;padding:8px;">
      ${equipRows}
    </div>
  `;

  return `<div class="ws-group" id="wsgroup-${g.id}">
    <div class="ws-group-inner">
    <div class="ws-group-header">
      <button onclick="toggleGroupCollapse(${g.id})"
        style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:11px;padding:0 4px;flex-shrink:0;line-height:1;">
        ${collapsed ? '▶' : '▼'}
      </button>
      <input class="ws-group-name" value="${g.name}"
        oninput="updateGroupName(${g.id},this.value)" placeholder="그룹 이름">
      <div class="ws-group-mult">
        <span>×</span>
        <input type="number" class="ws-mult-input" min="1" value="${g.mult||1}"
          oninput="updateGroupMult(${g.id},this.value)">
      </div>
      <button class="btn" style="font-size:10px;padding:3px 8px;" onclick="saveGroupAsPreset(${g.id})">저장</button>
      <button class="ws-add-equip-btn" onclick="openEquipModal(${g.id}, null)">+ 설비</button>
      <button class="ws-del-btn" style="font-size:16px;" onclick="removeGroup(${g.id})" title="그룹 삭제">🗑</button>
    </div>
    ${bodyHTML}
  </div></div>`;
}

function toggleGroupCollapse(gid) {
  const g = od().groups.find(g => g.id === gid);
  if (!g) return;
  g.collapsed = !g.collapsed;
  const el = document.getElementById(`wsgroup-${gid}`);
  if (el) el.outerHTML = renderGroupHTML(g);
  scheduleSave();
}

function addGroup() {
  const id = od().nextGroupId++;
  od().groups.push({ id, name: `그룹 ${od().groups.length + 1}`, mult: 1, equips: [] });
  renderWorkspace();
  scheduleSave();
}

async function removeGroup(gid) {
  const g = od().groups.find(g => g.id === gid);
  if (!g) return;
  const ok = await dialogConfirm(`"${g.name}" 그룹을 삭제할까요?`);
  if (!ok) return;
  od().groups = od().groups.filter(g => g.id !== gid);
  renderWorkspace();
  renderResults();
  renderAuthProducts();
  scheduleSave();
}

function updateGroupName(gid, val) {
  const g = od().groups.find(g => g.id === gid);
  if (g) { g.name = val; scheduleSave(); }
}

function updateGroupMult(gid, val) {
  const g = od().groups.find(g => g.id === gid);
  if (!g) return;
  g.mult = parseFloat(val) || 1;
  g.equips.forEach(e => updateWsRateSpan(g, e));
  renderResults();
  renderAuthProducts();
  scheduleSave();
}

function updateEquipCount(gid, recipeId, val) {
  const g = od().groups.find(g => g.id === gid);
  if (!g) return;
  const e = g.equips.find(e => e.recipeId === recipeId);
  if (!e) return;
  e.count = parseFloat(val) || 0;
  updateWsRateSpan(g, e);
  updateActiveCount();
  renderResults();
  renderAuthProducts();
  scheduleSave();
}

function updateWsRateSpan(g, e) {
  const recipe = RECIPES.find(r => r.id === e.recipeId);
  if (!recipe) return;
  const cnt = (e.count || 0) * (g.mult || 1);

  const makeLines = (items, sign, color) => items.map(item => {
    const rate = cnt > 0 ? fmt((60 / recipe.speed) * item.qty * cnt) : null;
    return `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;padding:1px 0;">
      <span style="display:flex;align-items:center;min-width:0;">
        <span style="color:${color};font-weight:700;margin-right:4px;flex-shrink:0;">${sign}</span>
        ${itemIcon(item.name, 32)}
        <span style="color:var(--text);">${item.name}</span>
      </span>
      ${rate ? `<span style="color:var(--text-muted);font-family:'Share Tech Mono',monospace;font-size:10px;flex-shrink:0;">${rate}/분</span>` : ''}
    </div>`;
  }).join('');

  const outEl = document.getElementById(`wsout-${g.id}-${e.recipeId}`);
  const inEl  = document.getElementById(`wsin-${g.id}-${e.recipeId}`);
  if (outEl) outEl.innerHTML = makeLines(recipe.outputs, '+', 'var(--success)');
  if (inEl)  inEl.innerHTML  = recipe.inputs.length > 0
    ? makeLines(recipe.inputs, '−', 'var(--danger)')
    : `<div style="color:var(--text-muted);font-size:10px;padding:1px 0;">원자재</div>`;
}

function removeEquip(gid, recipeId) {
  const g = od().groups.find(g => g.id === gid);
  if (!g) return;
  g.equips = g.equips.filter(e => e.recipeId !== recipeId);
  renderWorkspace();
  renderResults();
  renderAuthProducts();
  scheduleSave();
}

function updateActiveCount() {
  const total = od().groups.reduce((sum, g) => sum + g.equips.filter(e => (e.count||0) > 0).length, 0);
  const el = document.getElementById('active-count');
  if (el) el.textContent = `${total}개 가동`;
}

// ========== 설비 추가/변경 모달 ==========
let pendingChangeRecipeId = null;
let modalSelectedEquip = null;

function openEquipModal(gid, existingRecipeId = null) {
  pendingGroupId = gid;
  pendingChangeRecipeId = existingRecipeId;

  const g = od().groups.find(g => g.id === gid);
  if (!g) return;

  document.getElementById('modal-equip-title').textContent =
    existingRecipeId !== null ? '레시피 변경' : '설비 추가';

  const equipTypes = [...new Set(RECIPES.map(r => r.equip))];
  modalSelectedEquip = existingRecipeId !== null
    ? RECIPES.find(r => r.id === existingRecipeId)?.equip || equipTypes[0]
    : equipTypes[0];

  renderEquipModalTabs(g, equipTypes);
  renderEquipModalRecipes(g);
  document.getElementById('modal-equip').style.display = 'block';
}

function renderEquipModalTabs(g, equipTypes) {
  const tabsEl = document.getElementById('modal-equip-tabs');
  tabsEl.innerHTML = equipTypes.map(eq => {
    const isActive = eq === modalSelectedEquip;
    return `<button onclick="selectEquipTab('${eq}')"
      style="padding:5px 12px;font-size:11px;font-weight:600;cursor:pointer;
        border-radius:4px;border:1px solid ${isActive ? 'var(--accent)' : 'var(--border)'};
        background:${isActive ? 'var(--accent)' : 'transparent'};
        color:${isActive ? 'var(--bg)' : 'var(--text-muted)'};
        font-family:'Noto Sans KR',sans-serif;
        transition:all 0.15s;"
      id="equip-tab-${eq.replace(/\s/g,'_')}">${eq}</button>`;
  }).join('');
}

function selectEquipTab(equip) {
  modalSelectedEquip = equip;
  const g = od().groups.find(g => g.id === pendingGroupId);
  const equipTypes = [...new Set(RECIPES.map(r => r.equip))];
  if (presetEditMode) {
    renderEquipModalTabs({ equips: editingPresetEquips }, equipTypes);
    renderEquipModalRecipesForPreset();
  } else {
    if (!g) return;
    renderEquipModalTabs(g, equipTypes);
    renderEquipModalRecipes(g);
  }
}

function renderEquipModalRecipes(g) {
  const usedIds = new Set(g.equips.map(e => e.recipeId));
  const recipes = RECIPES.filter(r => r.equip === modalSelectedEquip);
  const listEl  = document.getElementById('modal-equip-list');

  listEl.innerHTML = recipes.map(r => {
    const isDup     = usedIds.has(r.id) && r.id !== pendingChangeRecipeId;
    const isCurrent = r.id === pendingChangeRecipeId;

    const outLines = r.outputs.map(o =>
      `<div style="padding:1px 0;">
        <span style="color:var(--success);font-weight:700;">+</span>
        <span style="color:var(--text);margin-left:4px;">${o.name}</span>
        <span style="color:var(--text-muted);font-size:10px;margin-left:4px;">×${o.qty}</span>
      </div>`
    ).join('');

    const inLines = r.inputs.length > 0
      ? r.inputs.map(i =>
          `<div style="padding:1px 0;">
            <span style="color:var(--danger);font-weight:700;">−</span>
            <span style="color:var(--text);margin-left:4px;">${i.name}</span>
            <span style="color:var(--text-muted);font-size:10px;margin-left:4px;">×${i.qty}</span>
          </div>`
        ).join('')
      : `<div style="color:var(--text-muted);font-size:10px;padding:1px 0;">원자재</div>`;

    const divider = r.inputs.length > 0
      ? `<div style="border-top:1px dashed rgba(80,100,140,0.4);margin:5px 0;"></div>`
      : '';

    let cardBorder, cardBg;
    if (isCurrent)    { cardBorder = 'var(--accent)';              cardBg = 'rgba(240,200,22,0.08)'; }
    else if (isDup)   { cardBorder = 'rgba(255,255,255,0.08)';         cardBg = 'transparent'; }
    else              { cardBorder = 'rgba(255,255,255,0.1)';         cardBg = 'rgba(255,255,255,0.04)'; }

    return `<div
      onclick="${isDup ? '' : `confirmEquipSelect(${r.id})`}"
      style="border:1px solid ${cardBorder};background:${cardBg};
        border-radius:4px;padding:10px 12px;
        cursor:${isDup ? 'not-allowed' : 'pointer'};
        opacity:${isDup ? '0.45' : '1'};
        transition:border-color 0.15s,background 0.15s;"
      ${isDup ? '' : `onmouseenter="this.style.borderColor='var(--accent)';this.style.background='rgba(240,200,22,0.07)'"
        onmouseleave="this.style.borderColor='${cardBorder}';this.style.background='${cardBg}'"` }>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px;">
        <div style="flex:1;font-size:12px;">${outLines}</div>
        <div style="display:flex;gap:4px;flex-shrink:0;margin-left:8px;">
          ${isDup     ? '<span style="font-size:10px;color:var(--warning);">중복</span>'  : ''}
          ${isCurrent ? '<span style="font-size:10px;color:var(--accent);">현재</span>'   : ''}
        </div>
      </div>
      ${divider}
      <div style="font-size:11px;">${inLines}</div>
    </div>`;
  }).join('') || `<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:12px;">레시피 없음</div>`;
}

// ========== 하위 설비 자동 계산 ==========
// 재귀적으로 하위 설비 필요 수량 합산 — {recipeId: count} 맵 반환
function buildSubEquipMap(recipeId, parentCount, visited) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  if (!recipe) return {};
  const resourceKeys = new Set(RESOURCE_ITEMS.map(r => r.key));
  const result = {};
  recipe.inputs.forEach(input => {
    if (resourceKeys.has(input.name)) return;
    const subRecipe = RECIPES.find(r => r.outputs.some(o => o.name === input.name));
    if (!subRecipe) return;
    if (visited.has(subRecipe.id)) return;
    const subOutput = subRecipe.outputs.find(o => o.name === input.name);
    if (!subOutput) return;
    const consumePerMin = (60 / recipe.speed) * input.qty * parentCount;
    const producePerMin = (60 / subRecipe.speed) * subOutput.qty;
    const neededRounded = Math.round(consumePerMin / producePerMin * 100) / 100;
    result[subRecipe.id] = (result[subRecipe.id] || 0) + neededRounded;
    const newVisited = new Set([...visited, subRecipe.id]);
    const children = buildSubEquipMap(subRecipe.id, neededRounded, newVisited);
    Object.entries(children).forEach(([rid, cnt]) => {
      result[rid] = (result[rid] || 0) + cnt;
    });
  });
  return result;
}

// 배열 형태 래퍼
function buildSubEquipList(recipeId, parentCount, visited) {
  const map = buildSubEquipMap(recipeId, parentCount, visited);
  return Object.entries(map).map(([rid, cnt]) => ({ recipeId: parseInt(rid), count: cnt }));
}

function confirmEquipSelect(recipeId) {
  if (presetEditMode) { confirmPresetEquipSelect(recipeId); return; }
  const g = od().groups.find(g => g.id === pendingGroupId);
  if (!g) return;
  if (pendingChangeRecipeId !== null) {
    const idx = g.equips.findIndex(e => e.recipeId === pendingChangeRecipeId);
    if (idx !== -1) {
      const oldCount = g.equips[idx].count;
      g.equips[idx] = { recipeId, count: oldCount };
    }
    closeEquipModal();
    renderWorkspace(); renderResults(); renderAuthProducts(); scheduleSave();
  } else {
    showAddEquipModal(g, recipeId);
  }
}

function showAddEquipModal(g, recipeId) {
  const recipe = RECIPES.find(r => r.id === recipeId);
  const existing = g.equips.find(e => e.recipeId === recipeId);
  const subMap1 = buildSubEquipMap(recipeId, 1, new Set([recipeId]));
  const hasSubs = Object.keys(subMap1).length > 0;
  document.getElementById('modal-auto-add')?.remove();

  const subRows = Object.entries(subMap1).map(([rid, cnt]) => {
    const r = RECIPES.find(r => r.id === parseInt(rid));
    if (!r) return '';
    const inGroup = g.equips.find(e => e.recipeId === parseInt(rid));
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.0.2);font-size:11px;">
      <span style="color:var(--text);">${r.outputs[0].name} <span style="color:var(--text-muted);font-size:10px;">(${r.equip})</span>
      ${inGroup ? `<span style="font-size:9px;color:var(--accent2);margin-left:4px;">기존 ${inGroup.count}개+</span>` : ''}
      </span>
      <span style="color:var(--accent);font-weight:700;" id="sub-cnt-${rid}">×${cnt}</span>
    </div>`;
  }).join('');

  const modal = document.createElement('div');
  modal.id = 'modal-auto-add';
  modal.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(0,0,0,0.75);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;';
  document.body.appendChild(modal);
  document.getElementById('add-equip-count')?.focus();
}
function updateSubPreview(recipeId) {
  const cnt = parseInt(document.getElementById('add-equip-count')?.value) || 1;
  const subMap = buildSubEquipMap(recipeId, cnt, new Set([recipeId]));
  Object.entries(subMap).forEach(([rid, count]) => {
    const el = document.getElementById('sub-cnt-' + rid);
    if (el) el.textContent = '×' + count;
  });
}

function doAddEquip(gid, recipeId, withSubs) {
  const g = od().groups.find(g => g.id === gid);
  if (!g) return;
  const addCount = parseInt(document.getElementById('add-equip-count')?.value) || 1;
  const existing = g.equips.find(e => e.recipeId === recipeId);
  if (existing) {
    existing.count += addCount;
  } else {
    g.equips.push({ recipeId, count: addCount });
  }
  if (withSubs) {
    const subMap = buildSubEquipMap(recipeId, addCount, new Set([recipeId]));
    Object.entries(subMap).forEach(([rid, cnt]) => {
      const id = parseInt(rid);
      const sub = g.equips.find(e => e.recipeId === id);
      if (sub) { sub.count += cnt; } else { g.equips.push({ recipeId: id, count: cnt }); }
    });
    showToast('🏭 하위 설비가 자동으로 추가됐어요!');
  }
  closeEquipModal();
  document.getElementById('modal-auto-add')?.remove();
  renderWorkspace(); renderResults(); renderAuthProducts(); scheduleSave();
}


// ========== 프리셋 ==========
function closeEquipModal() {
  document.getElementById('modal-equip').style.display = 'none';
  pendingGroupId = null;
  pendingChangeRecipeId = null;
  modalSelectedEquip = null;
  if (presetEditMode) { presetEditMode = false; presetEditChangeIdx = null; }
}

async function saveGroupAsPreset(gid) {
  const g = od().groups.find(g => g.id === gid);
  if (!g || g.equips.length === 0) { await dialogAlert('설비가 없는 그룹은 저장할 수 없어요'); return; }
  const name = await dialogPrompt('프리셋 이름을 입력하세요', g.name);
  if (name === null) return;
  presets.push({ id: Date.now(), name: name || g.name, equips: g.equips.map(e => ({ recipeId: e.recipeId, count: e.count })) });
  scheduleSave();
  await dialogAlert(`"${name || g.name}" 프리셋이 저장됐어요!`);
}

function openPresetModal() {
  renderPresetModal();
  document.getElementById('modal-preset').style.display = 'block';
}

function closePresetModal() {
  document.getElementById('modal-preset').style.display = 'none';
}

function renderPresetModal() {
  const el = document.getElementById('modal-preset-list');
  if (presets.length === 0) {
    el.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:32px;font-size:13px;">저장된 프리셋이 없어요<br><span style="font-size:11px;">그룹의 "저장" 버튼으로 추가하세요</span></div>`;
    return;
  }
  el.innerHTML = presets.map(p => {
    const detail = p.equips.map(e => {
      const r = RECIPES.find(r => r.id === e.recipeId);
      return r ? `${r.outputs[0].name}×${e.count}` : '';
    }).filter(Boolean).join('  ·  ');
    return `<div class="preset-item">
      <div style="flex:1;min-width:0;">
        <div class="preset-name">${p.name}</div>
        <div class="preset-detail" style="margin-top:3px;">${detail || '설비 없음'}</div>
      </div>
      <button class="btn btn-primary" style="font-size:11px;padding:4px 10px;flex-shrink:0;" onclick="loadPreset(${p.id})">공장에 추가</button>
      <button class="btn" style="font-size:11px;padding:4px 10px;flex-shrink:0;" onclick="openPresetEditModal(${p.id})">수정</button>
      <button class="ws-del-btn" style="font-size:16px;flex-shrink:0;" onclick="deletePreset(${p.id})">🗑</button>
    </div>`;
  }).join('');
}

function loadPreset(pid) {
  const p = presets.find(p => p.id === pid);
  if (!p) return;
  const id = od().nextGroupId++;
  od().groups.push({ id, name: p.name, mult: 1, equips: p.equips.map(e => ({ recipeId: e.recipeId, count: e.count })) });
  closePresetModal();
  renderWorkspace();
  renderResults();
  renderAuthProducts();
  scheduleSave();
}

async function deletePreset(pid) {
  const p = presets.find(p => p.id === pid);
  if (!p) return;
  const ok = await dialogConfirm(`"${p.name}" 프리셋을 삭제할까요?`);
  if (!ok) return;
  presets = presets.filter(p => p.id !== pid);
  renderPresetModal();
  scheduleSave();
}

// ========== 프리셋 수정 ==========
let editingPresetId = null;
let editingPresetEquips = []; // [{recipeId, count}] 임시 작업본

function openPresetEditModal(pid) {
  const p = presets.find(p => p.id === pid);
  if (!p) return;
  editingPresetId = pid;
  editingPresetEquips = p.equips.map(e => ({ ...e })); // 복사본
  document.getElementById('preset-edit-name').value = p.name;
  renderPresetEditBody();
  document.getElementById('modal-preset-edit').style.display = 'block';
}

function closePresetEditModal() {
  document.getElementById('modal-preset-edit').style.display = 'none';
  editingPresetId = null;
  editingPresetEquips = [];
}

function renderPresetEditBody() {
  const el = document.getElementById('preset-edit-body');
  if (editingPresetEquips.length === 0) {
    el.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:24px;font-size:12px;">설비가 없어요<br>아래 버튼으로 추가하세요</div>`;
    return;
  }
  el.innerHTML = editingPresetEquips.map((e, idx) => {
    const recipe = RECIPES.find(r => r.id === e.recipeId);
    if (!recipe) return '';
    const outLines = recipe.outputs.map(o =>
      `<div style="padding:1px 0;"><span style="color:var(--success);font-weight:700;">+</span> <span style="color:var(--text);">${o.name}</span></div>`
    ).join('');
    const inLines = recipe.inputs.length > 0
      ? recipe.inputs.map(i =>
          `<div style="padding:1px 0;"><span style="color:var(--danger);font-weight:700;">−</span> <span style="color:var(--text);">${i.name}</span> <span style="color:var(--text-muted);font-size:10px;">×${i.qty}</span></div>`
        ).join('')
      : `<div style="color:var(--text-muted);font-size:10px;">원자재</div>`;
    const divider = recipe.inputs.length > 0 ? `<div style="border-top:1px dashed rgba(80,100,140,0.4);margin:4px 0;"></div>` : '';

    return `<div style="border:1px solid rgba(255,255,255,0.12);border-radius:4px;padding:10px 12px;background:var(--bg-mid);display:grid;grid-template-columns:1fr 56px 28px 28px;gap:6px;align-items:start;">
      <div style="cursor:pointer;" onclick="openEquipModalForPresetChange(${idx})" title="클릭해서 레시피 변경">
        <div style="font-size:11px;">${outLines}</div>
        ${divider}
        <div style="font-size:11px;">${inLines}</div>
      </div>
      <input type="number" min="0" value="${e.count||''}" placeholder="0"
        class="ws-count-input"
        onchange="updatePresetEquipCount(${idx}, this.value)">
      <button class="ws-del-btn" onclick="removePresetEquip(${idx})" title="제거" style="font-size:14px;padding-top:4px;">×</button>
    </div>`;
  }).join('');
}

function updatePresetEquipCount(idx, val) {
  editingPresetEquips[idx].count = parseFloat(val) || 0;
}

function removePresetEquip(idx) {
  editingPresetEquips.splice(idx, 1);
  renderPresetEditBody();
}

// 프리셋 수정 모달에서 설비 추가 시 — openEquipModal을 프리셋용으로 재활용
let presetEditMode = false;
let presetEditChangeIdx = null;

function openEquipModalForPreset() {
  presetEditMode = true;
  presetEditChangeIdx = null;
  pendingGroupId = '__preset__';
  pendingChangeRecipeId = null;
  const equipTypes = [...new Set(RECIPES.map(r => r.equip))];
  modalSelectedEquip = equipTypes[0];
  document.getElementById('modal-equip-title').textContent = '설비 추가 (프리셋)';
  renderEquipModalTabs({ equips: editingPresetEquips }, equipTypes);
  renderEquipModalRecipesForPreset();
  document.getElementById('modal-equip').style.display = 'block';
}

function openEquipModalForPresetChange(idx) {
  presetEditMode = true;
  presetEditChangeIdx = idx;
  pendingGroupId = '__preset__';
  const cur = editingPresetEquips[idx];
  pendingChangeRecipeId = cur ? cur.recipeId : null;
  const equipTypes = [...new Set(RECIPES.map(r => r.equip))];
  modalSelectedEquip = cur ? (RECIPES.find(r => r.id === cur.recipeId)?.equip || equipTypes[0]) : equipTypes[0];
  document.getElementById('modal-equip-title').textContent = '레시피 변경 (프리셋)';
  renderEquipModalTabs({ equips: editingPresetEquips }, equipTypes);
  renderEquipModalRecipesForPreset();
  document.getElementById('modal-equip').style.display = 'block';
}

function renderEquipModalRecipesForPreset() {
  const usedIds = new Set(editingPresetEquips.map(e => e.recipeId));
  const recipes = RECIPES.filter(r => r.equip === modalSelectedEquip);
  const listEl = document.getElementById('modal-equip-list');

  listEl.innerHTML = recipes.map(r => {
    const isDup     = usedIds.has(r.id) && r.id !== pendingChangeRecipeId;
    const isCurrent = r.id === pendingChangeRecipeId;
    const outLines  = r.outputs.map(o =>
      `<div style="padding:1px 0;"><span style="color:var(--success);font-weight:700;">+</span> <span style="color:var(--text);margin-left:4px;">${o.name}</span> <span style="color:var(--text-muted);font-size:10px;">×${o.qty}</span></div>`
    ).join('');
    const inLines = r.inputs.length > 0
      ? r.inputs.map(i => `<div style="padding:1px 0;"><span style="color:var(--danger);font-weight:700;">−</span> <span style="color:var(--text);margin-left:4px;">${i.name}</span> <span style="color:var(--text-muted);font-size:10px;">×${i.qty}</span></div>`).join('')
      : `<div style="color:var(--text-muted);font-size:10px;">원자재</div>`;
    const divider = r.inputs.length > 0 ? `<div style="border-top:1px dashed rgba(80,100,140,0.4);margin:5px 0;"></div>` : '';
    let cardBorder = isCurrent ? 'var(--accent)' : isDup ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.1)';
    let cardBg     = isCurrent ? 'rgba(240,200,22,0.08)' : 'rgba(255,255,255,0.04)';

    return `<div onclick="${isDup ? '' : `confirmPresetEquipSelect(${r.id})`}"
      style="border:1px solid ${cardBorder};background:${cardBg};border-radius:4px;padding:10px 12px;
        cursor:${isDup ? 'not-allowed' : 'pointer'};opacity:${isDup ? '0.45' : '1'};transition:border-color 0.15s;"
      ${isDup ? '' : `onmouseenter="this.style.borderColor='var(--accent)';this.style.background='rgba(240,200,22,0.07)'"
        onmouseleave="this.style.borderColor='${cardBorder}';this.style.background='${cardBg}'"` }>
      <div style="display:flex;justify-content:space-between;">
        <div style="font-size:12px;">${outLines}</div>
        <div>${isDup ? '<span style="font-size:10px;color:var(--warning);">중복</span>' : ''} ${isCurrent ? '<span style="font-size:10px;color:var(--accent);">현재</span>' : ''}</div>
      </div>
      ${divider}
      <div style="font-size:11px;">${inLines}</div>
    </div>`;
  }).join('') || `<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:12px;">레시피 없음</div>`;
}

function confirmPresetEquipSelect(recipeId) {
  if (presetEditChangeIdx !== null) {
    editingPresetEquips[presetEditChangeIdx] = { recipeId, count: editingPresetEquips[presetEditChangeIdx]?.count || 1 };
  } else {
    if (editingPresetEquips.find(e => e.recipeId === recipeId)) return;
    editingPresetEquips.push({ recipeId, count: 1 });
  }
  document.getElementById('modal-equip').style.display = 'none';
  presetEditMode = false;
  presetEditChangeIdx = null;
  pendingGroupId = null;
  pendingChangeRecipeId = null;
  renderPresetEditBody();
}

function savePresetEdit() {
  const p = presets.find(p => p.id === editingPresetId);
  if (!p) return;
  p.name   = document.getElementById('preset-edit-name').value || p.name;
  p.equips = editingPresetEquips.map(e => ({ ...e }));
  closePresetEditModal();
  renderPresetModal();
  scheduleSave();
}

// ========== 아이콘 관리 모달 ==========
function openIconModal() {
  renderIconList();
  document.getElementById('modal-icons').style.display = 'block';
}
function closeIconModal() {
  document.getElementById('modal-icons').style.display = 'none';
}

function renderIconList() {
  // 계산기에 등장하는 모든 재료 이름 수집
  const allItems = new Set();
  RECIPES.forEach(r => {
    r.inputs.forEach(i => allItems.add(i.name));
    r.outputs.forEach(o => allItems.add(o.name));
  });
  RESOURCE_ITEMS.forEach(r => allItems.add(r.key));
  Object.keys(AUTH_VALUE).forEach(k => allItems.add(k));

  const el = document.getElementById('icon-list');
  el.innerHTML = [...allItems].sort().map(name => {
    const custom = ITEM_ICONS_CUSTOM[name];
    const wiki   = ITEM_ICONS_DEFAULT[name];
    const cur    = custom || wiki || null;
    return `<div style="display:flex;align-items:center;gap:10px;padding:6px 8px;border-bottom:1px solid rgba(255,255,255,0.08);">
      <!-- 현재 아이콘 미리보기 -->
      <div style="width:32px;height:32px;border:1px solid var(--border);border-radius:4px;display:flex;align-items:center;justify-content:center;background:var(--bg);flex-shrink:0;overflow:hidden;">
        ${cur ? `<img src="${cur}" width="28" height="28" style="object-fit:contain;" onerror="this.parentElement.innerHTML='?'">` : `<span style="color:var(--text-muted);font-size:12px;">?</span>`}
      </div>
      <!-- 이름 -->
      <span style="flex:1;font-size:12px;">${name}</span>
      <!-- 상태 뱃지 -->
      ${custom ? `<span style="font-size:10px;color:var(--success);margin-right:4px;">커스텀</span>` : wiki ? `<span style="font-size:10px;color:var(--text-muted);margin-right:4px;">위키</span>` : ''}
      <!-- 업로드 버튼 -->
      <label style="cursor:pointer;" title="이미지 업로드">
        <input type="file" accept="image/*" style="display:none;" onchange="handleIconUpload('${name}', this)">
        <span class="btn" style="font-size:10px;padding:3px 8px;">업로드</span>
      </label>
      <!-- 커스텀 삭제 버튼 -->
      ${custom ? `<button class="ws-del-btn" onclick="deleteCustomIcon('${name}');renderIconList();" title="커스텀 아이콘 삭제" style="font-size:14px;">×</button>` : ''}
    </div>`;
  }).join('');
}

function handleIconUpload(name, input) {
  const file = input.files[0];
  if (!file) return;
  uploadIcon(name, file);
  setTimeout(renderIconList, 200); // 업로드 후 목록 갱신
}

document.getElementById('modal-equip').addEventListener('click', function(e) { if (e.target===this) closeEquipModal(); });

// ========== RENDER RESULTS ==========
let currentResultFilter = 'all';
function renderResults() {
  const totals = calcTotals();
  const keys = Object.keys(totals);
  if (keys.length === 0) {
    document.getElementById('results-grid').innerHTML = `<div class="empty-state" style="padding:24px;">
      <div class="icon">🏭</div>
      <div style="font-size:12px;color:var(--text-muted);line-height:1.8;">
        공업생산품 탭에서<br>설비를 추가하고 수량을 입력하면<br>재료 수지가 여기에 표시돼요
      </div>
    </div>`;
    document.getElementById('summary-bar').style.display = 'none';
    return;
  }

  let deficit=0, surplus=0, balanced=0;
  let html = '';

  const sorted = keys.sort((a,b) => totals[a].balance - totals[b].balance);

  sorted.forEach(k => {
    const { consume, produce, balance } = totals[k];
    let cls = 'balanced', sign = '', balColor = 'var(--accent)';
    if (balance < -0.01) { cls = 'deficit'; sign = ''; balColor = 'var(--danger)'; deficit++; }
    else if (balance > 0.01) { cls = 'surplus'; sign = '+'; balColor = 'var(--success)'; surplus++; }
    else { balanced++; }

    if (currentResultFilter !== 'all' && cls !== currentResultFilter) return;

    const authVal = AUTH_VALUE[k];

    html += `<div class="compact-item">
      <div style="display:flex;align-items:center;gap:6px;min-width:0;">
        <div class="compact-dot ${cls}"></div>
        <span class="compact-name">${k}</span>
        ${authVal ? `<span style="font-size:9px;color:var(--accent2);font-family:'Share Tech Mono',monospace;flex-shrink:0;">◈${authVal}</span>` : ''}
      </div>
      <span style="font-size:10px;color:var(--text-muted);font-family:'Share Tech Mono',monospace;white-space:nowrap;">
        ${produce > 0.01 ? `▲${fmt(produce)}` : ''}${consume > 0.01 ? ` ▼${fmt(consume)}` : ''}
      </span>
      <span class="compact-balance" style="color:${balColor};">${sign}${fmt(Math.abs(balance))}</span>
    </div>`;
  });

  document.getElementById('results-grid').innerHTML = html || '<div class="empty-state" style="padding:16px;"><div class="icon">🔍</div>해당 조건 없음</div>';
  document.getElementById('summary-bar').style.display = 'flex';
  document.getElementById('deficit-count').textContent = deficit;
  document.getElementById('surplus-count').textContent = surplus;
  document.getElementById('balanced-count').textContent = balanced;
}

function filterEquip(btn, val) {
  document.querySelectorAll('.filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentEquipFilter = val;
  renderRecipes();
}

function filterResult(btn, val) {
  document.querySelectorAll('#result-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentResultFilter = val;
  renderResults();
}

// ========== AUTHORITY TAB ==========
// 거점별 관리권 구역 정의 (배포자가 추가)
