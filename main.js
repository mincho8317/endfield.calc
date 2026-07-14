
// ========== DATA ==========


// ========== 거점 정의 (배포자가 추가) ==========
// 현재 활성 거점
let activeOutpostId = OUTPOSTS[0].id;

// 거점별 데이터 저장소
// outpostData[id] = { resourceRates, groups, targetRates, nextGroupId }
const outpostData = {};
OUTPOSTS.forEach(o => {
  outpostData[o.id] = {
    resourceRates: Object.fromEntries(RESOURCE_ITEMS.map(r => [r.key, 0])),
    groups: [],
    targetRates: {},
    nextGroupId: 1,
  };
});

// 현재 거점 데이터 접근 헬퍼
function od() { return outpostData[activeOutpostId]; }
window.od = od;

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

// 설비 아이콘 URL 맵
const FACILITY_ICONS = {"배꽃 조경":"facility_icons/배꽃_조경.png","드래곤 버블 돌기둥":"facility_icons/드래곤_버블_돌기둥.png","풍선 교수":"facility_icons/풍선_교수.png","중추 박격포":"facility_icons/중추_박격포.png","'피클링' MK-I":"facility_icons/'피클링'_MK-I.png","고에너지 빔 타워":"facility_icons/고에너지_빔_타워.png","내산성 양수기 II":"facility_icons/내산성_양수기_II.png","다중 암관 출구":"facility_icons/다중_암관_출구.png","다중 암관 입구":"facility_icons/다중_암관_입구.png","정제기":"facility_icons/정제기.png","확장 반응기":"facility_icons/확장_반응기.png","파이프":"facility_icons/파이프.png","AF1 '아머 멜터'":"facility_icons/AF1_'아머_멜터'.png","급류 타워":"facility_icons/급류_타워.png","오염수 처리기":"facility_icons/오염수_처리기.png","수력 채굴기":"facility_icons/수력_채굴기.png","암관 출구":"facility_icons/암관_출구.png","암관 입구":"facility_icons/암관_입구.png","컨베이어 벨트":"facility_icons/컨베이어_벨트.png","총기 타워":"facility_icons/총기_타워.png","의료 타워":"facility_icons/의료_타워.png","유탄 타워":"facility_icons/유탄_타워.png","액체 질소 타워":"facility_icons/액체_질소_타워.png","확장 총기 타워":"facility_icons/확장_총기_타워.png","전 방향 음파 타워":"facility_icons/전_방향_음파_타워.png","빔 타워":"facility_icons/빔_타워.png","전류 타워":"facility_icons/전류_타워.png","감시 타워":"facility_icons/감시_타워.png","고폭 유탄 타워":"facility_icons/고폭_유탄_타워.png","액체 배출 장치":"facility_icons/액체_배출_장치.png","포이즌 머드 MK-Ⅰ":"facility_icons/포이즌_머드_MK-Ⅰ.png","스프링클러":"facility_icons/스프링클러.png","장거리 집라인 후크":"facility_icons/장거리_집라인_후크.png","집라인 후크":"facility_icons/집라인_후크.png","전언 신호기":"facility_icons/전언_신호기.png","간편 보관소":"facility_icons/간편_보관소.png","열에너지 뱅크":"facility_icons/열에너지_뱅크.png","식양 중계기":"facility_icons/식양_중계기.png","중계기":"facility_icons/중계기.png","식양 전력 공급기":"facility_icons/식양_전력_공급기.png","전력 공급기":"facility_icons/전력_공급기.png","분해기":"facility_icons/분해기.png","천화로":"facility_icons/천화로.png","반응기":"facility_icons/반응기.png","연마기":"facility_icons/연마기.png","포장기":"facility_icons/포장기.png","충진기":"facility_icons/충진기.png","장비 부품 합성기":"facility_icons/장비_부품_합성기.png","씨앗 추출기":"facility_icons/씨앗_추출기.png","재배기":"facility_icons/재배기.png","금석벼 논배미":"facility_icons/금석벼_논배미.png","성형기":"facility_icons/성형기.png","홍옥 인삼 논배미":"facility_icons/홍옥_인삼_논배미.png","쓴맛 나는 고추 논배미":"facility_icons/쓴맛_나는_고추_논배미.png","부품 가공기":"facility_icons/부품_가공기.png","회보리 논배미":"facility_icons/회보리_논배미.png","분쇄기":"facility_icons/분쇄기.png","야침 논배미":"facility_icons/야침_논배미.png","금초 논배미":"facility_icons/금초_논배미.png","아케톤 논배미":"facility_icons/아케톤_논배미.png","샌드리프 논배미":"facility_icons/샌드리프_논배미.png","시트론 논배미":"facility_icons/시트론_논배미.png","정련로":"facility_icons/정련로.png","메밀꽃 논배미":"facility_icons/메밀꽃_논배미.png","창고 입출력 라인 핵심 장치":"facility_icons/창고_입출력_라인_핵심_장치.png","창고 입출력 라인 기초 장치":"facility_icons/창고_입출력_라인_기초_장치.png","액체 저장 탱크":"facility_icons/액체_저장_탱크.png","창고 출력 포트":"facility_icons/창고_출력_포트.png","창고 입력 포트":"facility_icons/창고_입력_포트.png","프로토콜 저장함":"facility_icons/프로토콜_저장함.png","파이프 합류기":"facility_icons/파이프_합류기.png","파이프 물류 브리지":"facility_icons/파이프_물류_브리지.png","파이프 분류기":"facility_icons/파이프_분류기.png","파이프 컨트롤 포트":"facility_icons/파이프_컨트롤_포트.png","합류기":"facility_icons/합류기.png","물류 브리지":"facility_icons/물류_브리지.png","분류기":"facility_icons/분류기.png","아이템 컨트롤 포트":"facility_icons/아이템_컨트롤_포트.png","양수기":"facility_icons/양수기.png","전동 채굴기 II":"facility_icons/전동_채굴기_II.png","전동 채굴기":"facility_icons/전동_채굴기.png","휴대용 오리지늄 채굴기":"facility_icons/휴대용_오리지늄_채굴기.png"};

function getFacilityIcon(equipName, size=28) {
  const url = FACILITY_ICONS[equipName];
  if (!url) return `<span style="font-size:${size*0.7}px;line-height:${size}px;">🏭</span>`;
  return `<img src="${url}" alt="${equipName}" width="${size}" height="${size}"
    style="object-fit:contain;border-radius:4px;vertical-align:middle;flex-shrink:0;"
    onerror="this.parentElement.innerHTML='<span style=\\'font-size:${Math.round(size*0.7)}px;\\'>🏭</span>'">`;
}

// 아이템 아이콘 URL 맵 - 공식 위키(wiki.skport.com) 기반
const ITEM_ICONS_DEFAULT = {
  // 기초 재료
  '카본':           'icons/카본_조각.png',
  '카본 조각':      'icons/카본_조각.png',
  '고운오리지늄':   'icons/고운_오리지늄_가루.png',
  '오리지늄 광석':  'icons/오리지늄_광물.png',
  '페리움 광석':    'icons/페리움_광석.png',
  '적동 광석':      'icons/적동_광석.png',
  '적동':           'icons/적동_조각.png',
  '적동용액':       'icons/적동_용액.png',
  '혁동':           'icons/혁동_조각.png',
  '혁동용액':       'icons/혁동_용액.png',
  '혁동부품':       'icons/혁동_부품.png',
  '식양':           'icons/식양.png',
  '액화식양':       'icons/액화_식양.png',
  '중식양':         'icons/중식양.png',
  '중식양병':       'icons/중식양.png',
  '중식양부품':     'icons/중식양.png',
  '양정':           'icons/양정.png',
  '양정폐액':       'icons/양정_폐액.png',
  '불양정폐액':     'icons/불활성_양정_폐액.png',
  '산성침적물':     'icons/산성_침적물.png',
  '오염수':         'icons/오염수.png',
  '청정수':         'icons/청정수.png',
  '중용량 배터리':  'icons/중용량_무릉_배터리.png',
  '고금청':         'icons/고급_금초_청량음료.png',
  '옥동발산기':     'icons/실험용_옥동_발산기.png',
  '식양호리병':     'icons/식양호리병.png',
  '중식양병':       'icons/중식양병.png',
  '중식양부품':     'icons/중식양부품.png',
  '식양옥호리병':   'icons/식양_옥_호리병.png',
  // 관리권
  '협곡 관리권':    'icons/협곡_관리권.png',
  '무릉 관리권':    'icons/무릉_관리권.png',
  // 배터리
  '저용량 협곡 배터리': 'icons/저용량_협곡_배터리.png',
  '중용량 협곡 배터리': 'icons/중용량_협곡_배터리.png',
  '대용량 협곡 배터리': 'icons/대용량_협곡_배터리.png',
  '저용량 무릉 배터리': 'icons/저용량_무릉_배터리.png',
  '중용량 무릉 배터리': 'icons/중용량_무릉_배터리.png',
};

// 사용자가 직접 업로드한 아이콘 (base64) - localStorage에 저장됨
let ITEM_ICONS_CUSTOM = {};

function loadCustomIcons() {
  try {
    const raw = localStorage.getItem('endfield_icons_v1');
    if (raw) ITEM_ICONS_CUSTOM = JSON.parse(raw);
  } catch(e) {}
}

// 아이콘 조회 (공백 차이 자동 처리)
function getItemIconUrl(name) {
  if (ITEM_ICONS_DEFAULT[name]) return ITEM_ICONS_DEFAULT[name];
  // 공백 제거 후 재시도
  const nosp = name.replace(/\s/g, '');
  for (const k of Object.keys(ITEM_ICONS_DEFAULT)) {
    if (k.replace(/\s/g, '') === nosp) return ITEM_ICONS_DEFAULT[k];
  }
  // icons/ 폴더에서 파일명 추측 (공백→_)
  return 'icons/' + name.replace(/\s+/g,'_') + '.png';
}

function itemIcon(name, size = 32) {
  const url = getItemIconUrl(name);
  if (!url) return '';
  return `<img src="${url}" alt="${name}" width="${size}" height="${size}"
    style="border-radius:4px;object-fit:contain;vertical-align:middle;margin-right:6px;flex-shrink:0;background:rgba(255,255,255,0.05);"
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

// ========== RESOURCE 접기/펼치기 ==========
let resourceCollapsed = false;
function toggleResourceConfig() {
  resourceCollapsed = !resourceCollapsed;
  const wrap = document.getElementById('resource-config-wrap');
  const btn  = document.getElementById('resource-toggle-btn');
  wrap.classList.toggle('collapsed', resourceCollapsed);
  btn.textContent = resourceCollapsed ? '▼ 펼치기' : '▲ 접기';
}

// ========== WORKSPACE ==========
function renderWorkspace() {
  const ws = document.getElementById('workspace');
  if (!ws) return;
  const gs = od().groups;

  if (gs.length === 0) {
    ws.innerHTML = `<div class="empty-state" style="padding:32px;">
    <div class="icon">🏭</div>
    <div style="font-size:13px;font-weight:600;margin-bottom:8px;">아직 설비 그룹이 없어요</div>
    <div style="font-size:11px;color:var(--text-label);line-height:1.8;text-align:left;display:inline-block;">
      1️⃣ 위의 <b>+ 그룹 추가</b> 버튼으로 그룹을 만들고<br>
      2️⃣ 그룹 안의 <b>+ 설비</b>로 설비를 선택한 뒤<br>
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

    const makeItemCard = (item, color, sign) => {
      const rate = totalCnt > 0 ? fmt((60 / recipe.speed) * item.qty * totalCnt) : null;
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;min-width:56px;">
        <div style="position:relative;width:48px;height:48px;border-radius:8px;
          background:rgba(255,255,255,0.06);border:2px solid ${color};overflow:hidden;flex-shrink:0;">
          ${itemIcon(item.name, 48)}
          <span style="position:absolute;bottom:2px;right:3px;font-size:9px;
            font-weight:800;color:${color};text-shadow:0 0 4px #000;">${sign}${item.qty}</span>
        </div>
        <span style="font-size:10px;color:rgba(255,255,255,0.85);text-align:center;
          line-height:1.3;max-width:58px;word-break:keep-all;font-weight:500;">${item.name}</span>
        ${rate ? `<span style="font-size:9px;color:rgba(255,255,255,0.5);">${rate}/분</span>` : ''}
      </div>`;
    };

    const outCards = recipe.outputs.map(i => makeItemCard(i, '#4caf50', '+')).join('');
    const inCards  = recipe.inputs.map(i => makeItemCard(i, '#f44336', '−')).join('');

    const outSection = `<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:flex-start;">${outCards || '<span style="font-size:10px;color:rgba(255,255,255,0.3);">-</span>'}</div>`;
    const inSection  = inCards
      ? `<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:flex-start;">${inCards}</div>`
      : `<div style="font-size:10px;color:rgba(255,255,255,0.3);">원자재</div>`;

    const divider = `<div style="width:1px;background:rgba(255,255,255,0.1);align-self:stretch;margin:0 6px;flex-shrink:0;"></div>`;

    return `<div class="ws-equip-row">
      <div style="min-width:0;flex:1;cursor:pointer;" onclick="openEquipModal(${g.id}, ${e.recipeId})" title="클릭해서 레시피 변경">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
          ${getFacilityIcon(recipe.equip, 24)}
          <span style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.9);">${recipe.equip}</span>
          <span style="font-size:10px;color:rgba(255,255,255,0.4);">· ${recipe.label}</span>
        </div>
        <div style="display:flex;align-items:flex-start;">
          <div id="wsout-${g.id}-${e.recipeId}">${outSection}</div>
          ${divider}
          <div id="wsin-${g.id}-${e.recipeId}">${inSection}</div>
        </div>
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
    <div class="ws-group-header" style="flex-direction:column;gap:4px;padding:8px 10px;">
      <!-- 1줄: 접기 + 그룹명 + 수량 + 버튼 모두 한줄 -->
      <div style="display:flex;align-items:center;gap:6px;width:100%;">
        <button onclick="toggleGroupCollapse(${g.id})"
          style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:11px;padding:0 2px;flex-shrink:0;line-height:1;">
          ${collapsed ? '▶' : '▼'}
        </button>
        <input class="ws-group-name" value="${g.name}"
          oninput="updateGroupName(${g.id},this.value)" placeholder="그룹 이름"
          style="min-width:0;font-size:12px;">
        <div class="ws-group-mult" style="flex-shrink:0;">
          <span style="font-size:11px;color:var(--text-muted);">×</span>
          <input type="number" class="ws-mult-input" min="1" value="${g.mult||1}"
            oninput="updateGroupMult(${g.id},this.value)" style="width:36px;">
        </div>
        <button class="ws-add-equip-btn" onclick="openEquipModal(${g.id}, null)" style="padding:3px 8px;font-size:11px;flex-shrink:0;">+ 설비</button>
        <button class="btn" style="font-size:10px;padding:2px 8px;flex-shrink:0;" onclick="saveGroupAsPreset(${g.id})">저장</button>
        <button class="ws-del-btn" style="font-size:15px;flex-shrink:0;" onclick="removeGroup(${g.id})" title="그룹 삭제">🗑</button>
      </div>
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

  const makeItemCard = (item, color, sign) => {
    const rate = cnt > 0 ? fmt((60 / recipe.speed) * item.qty * cnt) : null;
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:3px;min-width:56px;">
      <div style="position:relative;width:48px;height:48px;border-radius:8px;
        background:rgba(255,255,255,0.06);border:2px solid ${color};overflow:hidden;flex-shrink:0;">
        ${itemIcon(item.name, 48)}
        <span style="position:absolute;bottom:2px;right:3px;font-size:9px;
          font-weight:800;color:${color};text-shadow:0 0 4px #000;">${sign}${item.qty}</span>
      </div>
      <span style="font-size:10px;color:rgba(255,255,255,0.85);text-align:center;
        line-height:1.3;max-width:58px;word-break:keep-all;font-weight:500;">${item.name}</span>
      ${rate ? `<span style="font-size:9px;color:rgba(255,255,255,0.5);">${rate}/분</span>` : ''}
    </div>`;
  };

  const outEl = document.getElementById(`wsout-${g.id}-${e.recipeId}`);
  const inEl  = document.getElementById(`wsin-${g.id}-${e.recipeId}`);
  if (outEl) outEl.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:flex-start;">${recipe.outputs.map(i=>makeItemCard(i,'#4caf50','+')).join('')}</div>`;
  if (inEl)  inEl.innerHTML  = recipe.inputs.length > 0
    ? `<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:flex-start;">${recipe.inputs.map(i=>makeItemCard(i,'#f44336','−')).join('')}</div>`
    : `<div style="font-size:10px;color:rgba(255,255,255,0.3);">원자재</div>`;
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

  renderEquipModal(g);
  document.getElementById('modal-equip').style.display = 'block';
}

// 모달 선택 상태
let modalSelectedCategory = null;
let modalSelectedEquipName = null;

function openEquipModal(gid, existingRecipeId = null) {
  pendingGroupId = gid;
  pendingChangeRecipeId = existingRecipeId;

  const g = od().groups.find(g => g.id === gid);
  if (!g) return;

  document.getElementById('modal-equip-title').textContent =
    existingRecipeId !== null ? '레시피 변경' : '설비 추가';

  // 기존 선택 설비의 카테고리/설비명으로 초기화
  const ALLOWED_CATS = ['합성과 제작', '기초 생산'];
  if (existingRecipeId !== null) {
    const r = RECIPES.find(r => r.id === existingRecipeId);
    const cat = r?.category || null;
    modalSelectedCategory = ALLOWED_CATS.includes(cat) ? cat : ALLOWED_CATS[0];
    modalSelectedEquipName = r?.equip || null;
  } else {
    modalSelectedCategory = ALLOWED_CATS[0];
    modalSelectedEquipName = null;
  }

  renderEquipModal(g);
  document.getElementById('modal-equip').style.display = 'block';
}

function renderEquipModal(g) {
  renderEquipModalTabs(g);
}

function renderEquipModalTabs(g) {
  const tabsEl = document.getElementById('modal-equip-tabs');
  const ALLOWED_CATEGORIES = ['합성과 제작', '기초 생산'];
  const categories = [...new Set(EQUIPMENT_LIST
    .filter(e => ALLOWED_CATEGORIES.includes(e.category))
    .map(e => e.category))];

  // 기본 카테고리가 허용 목록에 없으면 첫 번째로 재설정
  if (!ALLOWED_CATEGORIES.includes(modalSelectedCategory)) {
    modalSelectedCategory = categories[0] || null;
  }

  // 대카테고리 뱃지
  const catHtml = categories.map(cat => {
    const isActive = cat === modalSelectedCategory;
    return `<button onclick="selectCategory('${cat}')"
      style="padding:4px 12px;font-size:11px;font-weight:600;cursor:pointer;
        border-radius:20px;border:1px solid ${isActive ? 'var(--accent)' : 'var(--border)'};
        background:${isActive ? 'var(--accent)' : 'transparent'};
        color:${isActive ? 'var(--bg)' : 'var(--text-muted)'};
        transition:all 0.15s;">${cat}</button>`;
  }).join('');

  // 설비명 뱃지 (선택된 카테고리)
  const equipsInCat = EQUIPMENT_LIST.filter(e => e.category === modalSelectedCategory);
  const equipHtml = equipsInCat.map(e => {
    const hasRecipe = RECIPES.some(r => r.equip === e.name);
    const isActive = e.name === modalSelectedEquipName;
    return `<button onclick="selectEquipName('${e.name}')"
      style="padding:4px 8px;font-size:11px;cursor:pointer;
        border-radius:4px;border:1px solid ${isActive ? 'var(--teal)' : hasRecipe ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'};
        background:${isActive ? 'rgba(42,184,200,0.15)' : 'transparent'};
        color:${isActive ? 'var(--teal)' : hasRecipe ? 'var(--text-sub)' : 'var(--text-muted)'};
        opacity:${hasRecipe ? '1' : '0.5'};
        display:flex;align-items:center;gap:4px;
        transition:all 0.15s;">${getFacilityIcon(e.name, 18)}${e.name}${hasRecipe ? '' : ' (준비중)'}</button>`;
  }).join('');

  tabsEl.innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;">${catHtml}</div>
    <div style="display:flex;flex-wrap:wrap;gap:5px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.06);">${equipHtml}</div>`;

  renderEquipModalRecipes(g);
}

function selectCategory(cat) {
  modalSelectedCategory = cat;
  modalSelectedEquipName = null;
  const g = od().groups.find(g => g.id === pendingGroupId);
  if (presetEditMode) {
    renderEquipModalTabs({ equips: editingPresetEquips });
  } else {
    if (!g) return;
    renderEquipModalTabs(g);
  }
}

function selectEquipName(name) {
  modalSelectedEquipName = name;
  // 구 코드 호환
  modalSelectedEquip = name;
  const g = od().groups.find(g => g.id === pendingGroupId);
  if (presetEditMode) {
    renderEquipModalTabs({ equips: editingPresetEquips });
    renderEquipModalRecipesForPreset();
  } else {
    if (!g) return;
    renderEquipModalTabs(g);
  }
}

// 구 코드 호환용

function renderEquipModalRecipes(g) {
  const usedIds = new Set(g.equips.map(e => e.recipeId));
  const listEl  = document.getElementById('modal-equip-list');

  // 설비 미선택 상태
  if (!modalSelectedEquipName) {
    listEl.innerHTML = `<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:12px;">설비를 선택해주세요</div>`;
    return;
  }

  const recipes = RECIPES.filter(r => r.equip === modalSelectedEquipName);

  if (recipes.length === 0) {
    listEl.innerHTML = `<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:12px;">아직 레시피가 없어요<br><span style="font-size:10px;opacity:0.6;">추후 업데이트 예정</span></div>`;
    return;
  }

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
  modal.innerHTML = `
    <div style="background:var(--panel3);border:1px solid var(--border);border-top:2px solid var(--accent);border-radius:8px;padding:20px;width:90%;max-width:360px;box-shadow:0 12px 40px rgba(0,0,0,0.7);">
      <div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:14px;">설비 추가</div>
      <div style="font-size:12px;color:var(--text);margin-bottom:6px;">${recipe?.outputs[0]?.name || ''} <span style="color:var(--text-muted);font-size:11px;">(${recipe?.equip || ''})</span></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
        <span style="font-size:11px;color:var(--text-muted);">수량</span>
        <input id="add-equip-count" type="number" min="1" value="${existing ? existing.count : 1}"
          oninput="updateSubPreview(${recipeId})"
          style="width:70px;padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--bg-input);color:var(--text);font-size:12px;text-align:center;">
      </div>
      ${hasSubs ? `
        <div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;">하위 설비 자동 추가 예정</div>
        <div style="background:var(--bg);border-radius:4px;padding:8px 10px;margin-bottom:14px;max-height:120px;overflow-y:auto;">${subRows}</div>
      ` : ''}
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button onclick="document.getElementById('modal-auto-add')?.remove();"
          style="padding:6px 16px;border-radius:4px;border:1px solid var(--border);background:transparent;color:var(--text-sub);font-size:12px;cursor:pointer;">취소</button>
        ${hasSubs ? `<button onclick="doAddEquip(${pendingGroupId},${recipeId},false)"
          style="padding:6px 16px;border-radius:4px;border:1px solid var(--border);background:transparent;color:var(--text-sub);font-size:12px;cursor:pointer;">단독 추가</button>` : ''}
        <button onclick="doAddEquip(${pendingGroupId},${recipeId},${hasSubs})"
          style="padding:6px 16px;border-radius:4px;border:1px solid var(--accent);background:var(--accent);color:#1a1200;font-size:12px;font-weight:700;cursor:pointer;">${hasSubs ? '하위 포함 추가' : '추가'}</button>
      </div>
    </div>`;
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
    gtag('event', 'auto_sub_group_add', { recipe_id: recipeId });
  } else {
    gtag('event', 'equip_add', { recipe_id: recipeId });
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
  gtag('event', 'preset_load', { preset_id: pid });
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
  modalSelectedCategory = '합성과 제작';
  modalSelectedEquipName = null;
  document.getElementById('modal-equip-title').textContent = '설비 추가 (프리셋)';
  renderEquipModalTabs({ equips: editingPresetEquips });
  renderEquipModalRecipesForPreset();
  document.getElementById('modal-equip').style.display = 'block';
}

function openEquipModalForPresetChange(idx) {
  presetEditMode = true;
  presetEditChangeIdx = idx;
  pendingGroupId = '__preset__';
  const cur = editingPresetEquips[idx];
  pendingChangeRecipeId = cur ? cur.recipeId : null;
  if (cur) {
    const r = RECIPES.find(r => r.id === cur.recipeId);
    const cat = r?.category || null;
    modalSelectedCategory = ['합성과 제작','기초 생산'].includes(cat) ? cat : '합성과 제작';
    modalSelectedEquipName = r?.equip || null;
  } else {
    modalSelectedCategory = '합성과 제작';
    modalSelectedEquipName = null;
  }
  document.getElementById('modal-equip-title').textContent = '레시피 변경 (프리셋)';
  renderEquipModalTabs({ equips: editingPresetEquips });
  renderEquipModalRecipesForPreset();
  document.getElementById('modal-equip').style.display = 'block';
}

function renderEquipModalRecipesForPreset() {
  const usedIds = new Set(editingPresetEquips.map(e => e.recipeId));
  const listEl = document.getElementById('modal-equip-list');

  if (!modalSelectedEquipName) {
    listEl.innerHTML = `<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:12px;">설비를 선택해주세요</div>`;
    return;
  }

  const recipes = RECIPES.filter(r => r.equip === modalSelectedEquipName);

  if (recipes.length === 0) {
    listEl.innerHTML = `<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:12px;">아직 레시피가 없어요<br><span style="font-size:10px;opacity:0.6;">추후 업데이트 예정</span></div>`;
    return;
  }

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
  gtag('event', 'preset_save');
  const p = presets.find(p => p.id === editingPresetId);
  if (!p) return;
  p.name   = document.getElementById('preset-edit-name').value || p.name;
  p.equips = editingPresetEquips.map(e => ({ ...e }));
  closePresetEditModal();
  renderPresetModal();
  scheduleSave();
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

    const authVal = currentAuthValue()[k];

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

function filterResult(btn, val) {
  document.querySelectorAll('#result-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentResultFilter = val;
  renderResults();
}

// ========== AUTHORITY TAB ==========
// 거점별 관리권 구역 정의 (배포자가 추가)
// 슬롯 타입 한글 라벨
const SLOT_TYPE_LABEL = {
  authority: '관리권 생산 효율',
  exchange:  '관리권 교환 효율',
  exp:       '경험치 효율',
};

// 거점별 baseEff
const baseEff = {};
OUTPOSTS.forEach(o => {
  baseEff[o.id] = {};
  (BASE_DATA[o.id] || []).forEach(z => {
    baseEff[o.id][z.name] = { baseAmt: z.baseAmt, assignedOp: null, defenseLevel: 0, eventOn: false };
  });
});

// 방어 단계별 효율 (0~4단계)
const DEFENSE_EFF = [0, 0.10, 0.20, 0.30, 0.40];

// 특성 타입 한글 (구버전 호환 + 뱃지용)
const TRAIT_TYPE_KR = { faction:'소속', hobby:'취미', expertise:'특기' };

// 오퍼레이터가 슬롯 value와 일치하는지 확인 (faction/hobby/hobby2/expertise/expertise2 중 하나라도 일치)
function opMatchesValue(op, value) {
  return op.faction === value || op.hobby === value || op.hobby2 === value
      || op.expertise === value || op.expertise2 === value;
}

// 구역 효율 계산 헬퍼
function calcZoneEff(oId, zoneName) {
  const e    = baseEff[oId]?.[zoneName];
  const zone = (BASE_DATA[oId] || []).find(z => z.name === zoneName);
  if (!e || !zone) return { opper: 0, defense: 0, event: 0, opMatches: [] };

  const opMatches = []; // { type, value, label }
  let authorityCount = 0;

  if (e.assignedOp) {
    const op = OPERATOR_ROSTER.find(o => o.name === e.assignedOp);
    if (op) {
      (zone.traits || []).forEach(slot => {
        if (opMatchesValue(op, slot.value)) {
          opMatches.push({ type: slot.type, value: slot.value, label: SLOT_TYPE_LABEL[slot.type] || slot.type });
          if (slot.type === 'authority') authorityCount++;
        }
      });
    }
  }

  // authority 슬롯 매칭만 생산 효율에 반영 (슬롯당 +20%)
  const opper   = authorityCount * 0.20;
  const defense = (zone.hasDefense ? DEFENSE_EFF[e.defenseLevel || 0] : 0);
  const event   = e.eventOn ? 0.50 : 0;
  return { opper, defense, event, opMatches, authorityCount };
}

function calcFinalRate(baseAmt, opper, defense, event) {
  return baseAmt * (1 + opper + defense + event) / 60;
}

function calcOutpostAuthTotal(oId) {
  let total = 0;
  (BASE_DATA[oId] || []).forEach(z => {
    const e   = baseEff[oId]?.[z.name];
    if (!e) return;
    const eff = calcZoneEff(oId, z.name);
    total += calcFinalRate(e.baseAmt, eff.opper, eff.defense, eff.event);
  });
  return total;
}

// 활성 거점 공장에서 관리권 교환 가능 아이템 순생산량
function getAuthProductRatesFromFactory(oId) {
  const totals = calcTotals(oId || activeOutpostId);
  const rates = {};
  Object.keys(currentAuthValue()).forEach(k => {
    rates[k] = totals[k] ? Math.max(0, totals[k].balance) : 0;
  });
  return rates;
}

// 현재 활성 관리권 탭 거점
let activeAuthOutpostId = OUTPOSTS[0].id;

// 현재 거점의 AUTH_VALUE 반환 (거점별 구조 대응)
function getAuthValue(oId) {
  const id = oId || activeAuthOutpostId || activeOutpostId;
  if (AUTH_VALUE && typeof AUTH_VALUE === 'object') {
    // 거점별 구조인 경우
    if (AUTH_VALUE[id]) return AUTH_VALUE[id];
    // 하위 호환: flat 구조인 경우
    if (!AUTH_VALUE.valley4 && !AUTH_VALUE.wuling) return AUTH_VALUE;
  }
  return {};
}

// 현재 활성 거점 AUTH_VALUE
function currentAuthValue() {
  return getAuthValue(activeAuthOutpostId || activeOutpostId);
}
let activeAuthTab = 'base'; // 'base' | 'product' | 'overview'

// ========== 관리권 탭 렌더링 ==========
function renderAuthOutpostTabs() {
  const tabsEl = document.getElementById('auth-outpost-tabs');
  if (!tabsEl) return;
  tabsEl.innerHTML = OUTPOSTS.map(o => {
    const isActive = activeAuthOutpostId === o.id;
    return `<div class="inner-tab ${isActive ? 'active' : ''}"
      onclick="switchAuthView('outpost','${o.id}')">
      ${o.name}
    </div>`;
  }).join('');
}

function switchAuthView(type, oId) {
  activeAuthOutpostId = oId;
  renderAuthOutpostTabs();
  document.getElementById('auth-outpost-panel').style.display = '';
  renderAuthOutpostPanel(oId);
  // 마지막으로 열었던 내부 탭 복원
  const savedTab = authInnerTabState[oId] || 'base';
  if (savedTab !== 'base') switchOutpostInnerTab(savedTab, oId);
}

function renderAuthOutpostPanel(oId) {
  const panel = document.getElementById('auth-outpost-panel');
  const outpost = OUTPOSTS.find(o => o.id === oId);
  const authTotal = calcOutpostAuthTotal(oId);
  const fmt = n => Number.isFinite(n) ? n.toFixed(2) : '—';

  panel.innerHTML = `
    <div style="padding:10px 14px;border-bottom:1px solid var(--border);background:rgba(240,200,22,0.04);">
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px;">${outpost?.name || oId}</div>
      <div style="display:flex;align-items:baseline;gap:8px;">
        <span style="font-size:22px;font-weight:700;color:var(--accent);font-family:'Share Tech Mono',monospace;" id="auth-panel-total-${oId}">${authTotal > 0 ? fmt(authTotal) : '—'}</span>
        <span style="font-size:12px;color:var(--text-muted);">/분</span>
      </div>
    </div>
    <div id="base-config-${oId}"></div>
  `;
  renderOutpostBaseConfig(oId);
  updateOutpostAuthSummary(oId);
}

// 거점별 마지막 내부 탭 기억
const authInnerTabState = {};

function switchOutpostInnerTab(tab, oId) {
  authInnerTabState[oId] = tab; // 상태 저장
  document.getElementById(`auth-inner-base-${oId}`).style.display    = tab === 'base'    ? '' : 'none';
  document.getElementById(`auth-inner-product-${oId}`).style.display = tab === 'product' ? '' : 'none';
  document.getElementById(`atab-base-${oId}`).classList.toggle('active', tab === 'base');
  document.getElementById(`atab-product-${oId}`).classList.toggle('active', tab === 'product');
}

function renderOutpostBaseConfig(oId) {
  const zones = BASE_DATA[oId] || [];

  let html = zones.map(z => {
    const e    = baseEff[oId]?.[z.name] || { baseAmt:0, assignedOp:null, defenseLevel:0, eventOn:false };
    const eff  = calcZoneEff(oId, z.name);
    const rate = calcFinalRate(e.baseAmt, eff.opper, eff.defense, eff.event);
    const zid  = z.name.replace(/\s|\(|\)/g,'_');

    // 오퍼레이터 드롭다운 — 특성 매칭 개수 표시
    // 오퍼레이터 드롭다운 — 매칭 많은 순 정렬, 동점 시 authority 매칭 우선
    const scoredOps = OPERATOR_ROSTER.map(op => {
      const matched  = (z.traits || []).filter(slot => opMatchesValue(op, slot.value));
      const authHit  = matched.filter(s => s.type === 'authority').length;
      const totalHit = matched.length;
      return { op, totalHit, authHit };
    }).sort((a, b) =>
      b.totalHit - a.totalHit || b.authHit - a.authHit
    );

    const opSelectOptions = scoredOps.map(({ op, totalHit, authHit }) => {
      const badge = totalHit > 0 ? ` (✓${totalHit}${authHit > 0 ? ' +생산' : ''})` : '';
      return { value: op.name, label: op.name + badge };
    });

    // 매칭된 특성 태그 (연락관 옆)
    const matchTags = eff.opMatches.map(m => {
      const isAuth = m.type === 'authority';
      return `<span style="font-size:9px;padding:2px 6px;border-radius:4px;
        background:${isAuth ? 'rgba(240,200,22,0.18)' : 'rgba(255,255,255,0.06)'};
        color:${isAuth ? 'var(--accent)' : 'var(--text-muted)'};
        border:1px solid ${isAuth ? 'rgba(240,200,22,0.4)' : 'rgba(255,255,255,0.15)'};">
        ✓ ${m.label}</span>`;
    }).join('');

    // 구역 요구 특성 뱃지 — 슬롯 타입 + 조건값 + 매칭 여부
    const traitTags = (z.traits || []).map(slot => {
      const isMatch = eff.opMatches.some(m => m.value === slot.value && m.type === slot.type);
      const label   = SLOT_TYPE_LABEL[slot.type] || slot.type;
      // 기본(비매칭): 무채색 / 활성(매칭): 해당 타입 색
      const typeColor = isMatch ? {
        authority: '#a07808',
        exchange:  '#907020',
        exp:       '#207850',
      }[slot.type] || '#686868' : '#484848';
      const bgColor = isMatch ? {
        authority: 'rgba(240,200,22,0.08)',
        exchange:  'rgba(220,180,0,0.08)',
        exp:       'rgba(0,180,100,0.08)',
      }[slot.type] || 'rgba(255,255,255,0.03)' : 'transparent';
      const borderColor = isMatch ? {
        authority: 'rgba(240,200,22,0.25)',
        exchange:  'rgba(220,180,0,0.2)',
        exp:       'rgba(0,180,100,0.2)',
      }[slot.type] || 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.1)';
      return `<span style="font-size:9px;padding:3px 7px;border-radius:4px;
        background:${bgColor};color:${typeColor};
        border:1px solid ${borderColor};
        cursor:default;display:inline-flex;align-items:center;gap:3px;">
        ${isMatch ? '✓' : '○'} <b>${label}</b> · ${slot.value}</span>`;
    }).join('');

    // 방어 단계 버튼
    const defBtns = [0,1,2,3,4].map(lv => {
      const isActive = (e.defenseLevel || 0) === lv;
      return `<button onclick="updateZone('${oId}','${z.name}','defenseLevel',${lv})"
        style="padding:3px 9px;font-size:11px;border-radius:20px;cursor:pointer;
          border:1px solid ${isActive ? 'var(--accent)' : 'rgba(255,255,255,0.1)'};
          background:${isActive ? 'var(--accent)' : 'transparent'};
          color:${isActive ? 'var(--accent-text)' : 'var(--text-label)'};
          font-weight:${isActive ? '700' : '400'};">${lv}단계</button>`;
    }).join('');

    // 방어 단계 섹션 (hasDefense가 true인 거점만 표시)
    const defenseSection = z.hasDefense ? `
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
        <span style="font-size:11px;color:var(--text-sub);flex-shrink:0;font-weight:500;">방어</span>
        <div style="display:flex;gap:3px;flex-wrap:wrap;">${defBtns}</div>
        ${eff.defense > 0 ? `<span style="font-size:10px;color:var(--success);">+${Math.round(eff.defense*100)}%</span>` : ''}
      </div>` : '';

    // 이벤트 토글
    const evOn = e.eventOn;
    const evBtn = `<button onclick="updateZone('${oId}','${z.name}','eventOn',${!evOn})"
      style="padding:3px 12px;font-size:11px;border-radius:20px;cursor:pointer;
        border:1px solid ${evOn ? 'var(--success)' : 'var(--border)'};
        background:${evOn ? 'rgba(72,168,112,0.15)' : 'transparent'};
        color:${evOn ? 'var(--success)' : 'var(--text-label)'};">
      ${evOn ? '✓ ON (+50%)' : 'OFF'}</button>`;

    const totalPct = Math.round((eff.opper + eff.defense + eff.event) * 100);

    return `<div style="border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:12px 14px;background:var(--bg-mid);" class="zone-card-inner">
      <!-- 구역명 + 분당 관리권 -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div style="font-size:13px;font-weight:700;color:var(--text);">${z.name}</div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:10px;color:var(--text-label);">분당 관리권</span>
          <span style="font-size:20px;font-weight:700;color:var(--accent);font-family:'Share Tech Mono',monospace;line-height:1;" id="rate_${oId}_${zid}">${rate > 0 ? fmt(rate) : '—'}</span>
          ${totalPct > 0 ? `<span style="font-size:11px;font-weight:600;color:var(--success);">+${totalPct}%</span>` : `<span style="font-size:11px;color:var(--text-label);">+0%</span>`}
        </div>
      </div>
      <!-- 구역 요구 특성 -->
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;">${traitTags}</div>
      <!-- 기본 생산량 -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="font-size:11px;color:var(--text-sub);width:80px;flex-shrink:0;font-weight:500;">기본 생산량</span>
        <input class="eff-input" type="number" step="1" min="0"
          value="${e.baseAmt > 0 ? e.baseAmt : ''}" placeholder="0" style="width:80px;"
          onchange="updateZone('${oId}','${z.name}','baseAmt',+this.value)">
      </div>
      <!-- 배치 오퍼레이터 -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="font-size:11px;color:var(--text-sub);width:80px;flex-shrink:0;font-weight:500;">배치 오퍼레이터</span>
        <div id="cs-op-${oId}-${zid}" style="flex:1;min-width:0;"></div>
      </div>
      <!-- 방어 단계 (있는 경우만) -->
      ${defenseSection}
      <!-- 이벤트 -->
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:11px;color:var(--text-sub);width:80px;flex-shrink:0;font-weight:500;">이벤트</span>
        ${evBtn}
      </div>
    </div>`;
  }).join('');

  const el = document.getElementById(`base-config-${oId}`);
  if (el) {
    el.innerHTML = html;
    // 커스텀 드롭박스 초기화
    (BASE_DATA[oId] || []).forEach(z => {
      const zid = z.name.replace(/\s|\(|\)/g,'_');
      const e   = baseEff[oId]?.[z.name] || { assignedOp: null };
      const containerId = `cs-op-${oId}-${zid}`;

      const scoredOps = OPERATOR_ROSTER.map(op => {
        const matched  = (z.traits || []).filter(slot => opMatchesValue(op, slot.value));
        const authHit  = matched.filter(s => s.type === 'authority').length;
        const totalHit = matched.length;
        return { op, totalHit, authHit };
      }).sort((a, b) => b.totalHit - a.totalHit || b.authHit - a.authHit);

      const opts = scoredOps.map(({ op, totalHit, authHit }) => {
        const badge = totalHit > 0 ? ` (✓${totalHit}${authHit > 0 ? ' +생산' : ''})` : '';
        return { value: op.name, label: op.name + badge };
      });

      createCustomSelect(containerId, opts, e.assignedOp || '',
        val => updateZone(oId, z.name, 'assignedOp', val || null),
        '— 미배치 —');
    });
  }
}

function updateZone(oId, zoneName, field, val) {
  if (!baseEff[oId]) baseEff[oId] = {};
  if (!baseEff[oId][zoneName]) baseEff[oId][zoneName] = { baseAmt:0, assignedOp:null, defenseLevel:0, eventOn:false };
  // eventOn은 boolean, defenseLevel은 int, assignedOp은 string
  if (field === 'eventOn') baseEff[oId][zoneName][field] = Boolean(val);
  else if (field === 'defenseLevel') baseEff[oId][zoneName][field] = parseInt(val);
  else if (field === 'assignedOp') baseEff[oId][zoneName][field] = val || null;
  else baseEff[oId][zoneName][field] = parseFloat(val) || 0;

  // 구역 카드 전체 재렌더 (특성 매칭 뱃지 등 갱신)
  renderOutpostBaseConfig(oId);
  updateOutpostAuthSummary(oId);
  scheduleSave();
}

function updateOutpostAuthSummary(oId) {
  const authTotal = calcOutpostAuthTotal(oId);
  const factoryRates = getAuthProductRatesFromFactory(oId);
  const tr = outpostData[oId]?.targetRates || {};
  let totalConsume = 0;
  Object.entries(currentAuthValue()).forEach(([name, val]) => {
    totalConsume += val * (tr[name] || 0);
  });
  const balance = authTotal - totalConsume;

  // 상단 고정 요약 바 업데이트
  const produceEl = document.getElementById('auth-summary-produce');
  const consumeEl = document.getElementById('auth-summary-consume');
  const balEl     = document.getElementById('auth-summary-balance');
  if (produceEl) produceEl.textContent = authTotal > 0 ? fmt(authTotal) : '—';
  if (consumeEl) consumeEl.textContent = fmt(totalConsume);
  if (balEl) {
    balEl.textContent = authTotal > 0 ? (balance >= 0 ? '+' : '') + fmt(balance) : '—';
    balEl.style.color = balance >= 0 ? 'var(--success)' : 'var(--danger)';
  }

  // 거점 패널 헤더 총 분당 관리권 업데이트
  const panelTotalEl = document.getElementById(`auth-panel-total-${oId}`);
  if (panelTotalEl) panelTotalEl.textContent = authTotal > 0 ? fmt(authTotal) : '—';

  updateFactoryAuthBar();
}

function renderOutpostProducts(oId) {
  const factoryRates = getAuthProductRatesFromFactory(oId);
  const authTotal    = calcOutpostAuthTotal(oId);
  const tr           = outpostData[oId]?.targetRates || {};
  const el           = document.getElementById(`auth-product-body-${oId}`);
  if (!el) return;

  const isMobile = window.innerWidth < 768;
  isMobile ? renderProductsCards(el, oId, factoryRates, authTotal, tr)
           : renderProductsTable(el, oId, factoryRates, authTotal, tr);
}

function renderOutpostProductsTo(oId, targetId) {
  const factoryRates = getAuthProductRatesFromFactory(oId);
  const authTotal    = calcOutpostAuthTotal(oId);
  const tr           = outpostData[oId]?.targetRates || {};
  const el           = document.getElementById(targetId);
  if (!el) return;
  const isMobile = window.innerWidth < 768;
  isMobile ? renderProductsCards(el, oId, factoryRates, authTotal, tr)
           : renderProductsTable(el, oId, factoryRates, authTotal, tr);
}

function getAchieveHtml(factoryRate, targetRate, authTotal, val) {
  if (targetRate <= 0) return `<span style="color:var(--text-muted);font-size:11px;">—</span>`;
  const needed      = val * targetRate;
  const canProduce  = factoryRate >= targetRate - 0.001;
  const canAfford   = authTotal   >= needed     - 0.001;
  if (canProduce && canAfford)
    return `<span style="color:var(--success);font-weight:700;">✓ 가능</span>`;
  const r = [];
  if (!canProduce) r.push('생산 부족');
  if (!canAfford)  r.push('관리권 부족');
  return `<span style="color:var(--danger);font-size:10px;" title="${r.join(', ')}">✗ ${r[0]}</span>`;
}

// ── PC: 테이블 ──────────────────────────────────────────
function renderProductsTable(el, oId, factoryRates, authTotal, tr) {
  el.style.padding = '0';
  el.style.gap = '0';
  el.innerHTML = `
    <table class="auth-product-table">
      <thead><tr>
        <th>품명</th><th>관리권/개</th>
        <th>현재 생산<br><span style="color:var(--accent);font-size:9px;">공장 연동</span></th>
        <th>목표 생산<br><span style="color:var(--warning);font-size:9px;">직접 입력</span></th>
        <th>필요 관리권<br><span style="font-size:9px;">/분</span></th>
        <th>달성 여부</th>
      </tr></thead>
      <tbody>${
        Object.entries(currentAuthValue()).map(([name, val]) => {
          const factoryRate = factoryRates[name] || 0;
          const targetRate  = tr[name] || 0;
          const needed      = val * targetRate;
          return `<tr>
            <td>${name}</td>
            <td><span class="badge badge-orange active">◈${val}</span></td>
            <td style="color:${factoryRate>0?'var(--accent)':'var(--text-muted)'};">${fmt(factoryRate)}</td>
            <td><input class="auth-rate-input" type="number" min="0" step="0.1"
              value="${targetRate > 0 ? targetRate : ''}" placeholder="0"
              onchange="updateTargetRate('${oId}','${name}',this.value)" style="width:65px;"></td>
            <td style="color:${needed>0?'var(--warning)':'var(--text-muted)'};">${needed > 0 ? fmt(needed) : '—'}</td>
            <td>${getAchieveHtml(factoryRate, targetRate, authTotal, val)}</td>
          </tr>`;
        }).join('')
      }</tbody>
    </table>`;
}

// ── 모바일: 카드 ─────────────────────────────────────────
function renderProductsCards(el, oId, factoryRates, authTotal, tr) {
  el.style.padding = '8px';
  el.style.gap = '6px';
  el.innerHTML = Object.entries(currentAuthValue()).map(([name, val]) => {
    const factoryRate = factoryRates[name] || 0;
    const targetRate  = tr[name] || 0;
    const needed      = val * targetRate;
    const safeId      = name.replace(/\s/g,'_');
    return `<div style="border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:10px 12px;background:var(--bg-mid);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:12px;font-weight:600;color:var(--text);">${name}</span>
          <span class="badge badge-orange active">◈${val}</span>
        </div>
        <div id="achieve-${safeId}">${getAchieveHtml(factoryRate, targetRate, authTotal, val)}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;text-align:center;">
        <div style="background:rgba(0,0,0,0.15);border-radius:4px;padding:6px 4px;">
          <div style="font-size:9px;color:var(--text-muted);margin-bottom:3px;">현재 생산<br><span style="color:var(--accent);">공장 연동</span></div>
          <div style="font-size:13px;font-weight:700;font-family:'Share Tech Mono',monospace;color:${factoryRate>0?'var(--accent)':'var(--text-muted)'};">${fmt(factoryRate)}</div>
          <div style="font-size:9px;color:var(--text-muted);">/분</div>
        </div>
        <div style="background:rgba(0,0,0,0.15);border-radius:4px;padding:6px 4px;">
          <div style="font-size:9px;color:var(--text-muted);margin-bottom:3px;">목표 생산<br><span style="color:var(--warning);">직접 입력</span></div>
          <input type="number" min="0" step="0.1"
            value="${targetRate > 0 ? targetRate : ''}" placeholder="0"
            onchange="updateTargetRateInline('${oId}','${name}','${safeId}',this.value,${factoryRate},${authTotal},${val})"
            style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:4px;
              color:var(--text);font-size:12px;font-family:'Share Tech Mono',monospace;
              text-align:center;padding:2px 4px;outline:none;box-sizing:border-box;">
        </div>
        <div style="background:rgba(0,0,0,0.15);border-radius:4px;padding:6px 4px;">
          <div style="font-size:9px;color:var(--text-muted);margin-bottom:3px;">필요 관리권<br>&nbsp;</div>
          <div id="needed-${safeId}" style="font-size:13px;font-weight:700;font-family:'Share Tech Mono',monospace;color:${needed>0?'var(--warning)':'var(--text-muted)'};">${needed > 0 ? fmt(needed) : '—'}</div>
          <div style="font-size:9px;color:var(--text-muted);">/분</div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function updateTargetRateInline(oId, name, safeId, val, factoryRate, authTotal, authVal) {
  const rate = parseFloat(val) || 0;
  if (!outpostData[oId]) return;
  outpostData[oId].targetRates[name] = rate;

  // 달성 여부 인라인 업데이트 (카드 재렌더 없음)
  const achieveEl = document.getElementById(`achieve-${safeId}`);
  const neededEl  = document.getElementById(`needed-${safeId}`);
  if (achieveEl) achieveEl.innerHTML = getAchieveHtml(factoryRate, rate, authTotal, authVal);
  if (neededEl) {
    const needed = authVal * rate;
    neededEl.textContent = needed > 0 ? fmt(needed) : '—';
    neededEl.style.color = needed > 0 ? 'var(--warning)' : 'var(--text-muted)';
  }
  updateOutpostAuthSummary(oId);
  scheduleSave();
}

function updateTargetRate(oId, name, val) {
  if (!outpostData[oId]) return;
  outpostData[oId].targetRates[name] = parseFloat(val) || 0;
  updateOutpostAuthSummary(oId);
  scheduleSave();
}

// 기존 renderAuthProducts 호환용 - 활성 거점 기준으로 갱신
function renderAuthProducts() {
  updateFactoryAuthBar();
  // product 탭이 활성화 상태면 카드 재렌더 스킵 (입력 포커스 유지)
  const productPanel = document.getElementById(`auth-inner-product-${activeAuthOutpostId}`);
  const isProductTabOpen = productPanel && productPanel.style.display !== 'none';
  if (!isProductTabOpen) {
    renderOutpostProducts(activeAuthOutpostId);
  }
  updateOutpostAuthSummary(activeAuthOutpostId);
}

// ========== 공장 우측 관리권 현황 바 ==========
function updateFactoryAuthBar() {
  const oId = activeOutpostId;
  const authTotal = calcOutpostAuthTotal(oId);
  const factoryRates = getAuthProductRatesFromFactory(oId);
  let factoryConsume = 0;
  Object.entries(currentAuthValue()).forEach(([name, val]) => {
    factoryConsume += val * (factoryRates[name] || 0);
  });
  const balance = authTotal - factoryConsume;

  const produceEl = document.getElementById('fab-outpost-produce');
  const consumeEl = document.getElementById('fab-outpost-consume');
  const balEl     = document.getElementById('fab-outpost-balance');
  const labelEl   = document.getElementById('fab-outpost-label');
  if (labelEl)   labelEl.textContent   = OUTPOSTS.find(o=>o.id===oId)?.name || '';
  if (produceEl) produceEl.textContent = authTotal > 0 ? fmt(authTotal) : '0';
  if (consumeEl) consumeEl.textContent = fmt(factoryConsume);
  if (balEl) {
    balEl.textContent = (balance >= 0 ? '+' : '') + fmt(balance);
    balEl.className = 'auth-status-val ' + (balance >= 0 ? 'positive' : 'negative');
  }
  // 모바일 버튼은 항상 최신 관리권 수치로 갱신
  updateMobileStatusBtn();
}

// ========== 전체 현황 탭 ==========
function renderOverviewTab() {
  const el = document.getElementById('overview-body');
  if (!el) return;

  const isMobile = window.innerWidth < 768;
  let totalAuthProduce = 0, totalAuthConsume = 0;
  let html = '';

  OUTPOSTS.forEach(o => {
    const authTotal    = calcOutpostAuthTotal(o.id);
    const factoryRates = getAuthProductRatesFromFactory(o.id);
    const tr = outpostData[o.id]?.targetRates || {};
    let outpostConsume = 0;
    Object.entries(currentAuthValue()).forEach(([name, val]) => {
      outpostConsume += val * (tr[name] || 0);
    });
    totalAuthProduce += authTotal;
    totalAuthConsume += outpostConsume;
    const authBalance = authTotal - outpostConsume;

    const totals = calcTotals(o.id);
    const authItems    = Object.entries(totals).filter(([k,v]) =>  currentAuthValue()[k] && v.balance > 0.001).map(([k,v]) => ({ name:k, rate:v.balance, authCost:currentAuthValue()[k] }));
    const factoryItems = Object.entries(totals).filter(([k,v]) => !currentAuthValue()[k] && v.produce > 0.001 && v.balance > 0.001).map(([k,v]) => ({ name:k, balance:v.balance }));
    const deficitItems = Object.entries(totals).filter(([k,v]) => v.balance < -0.001).map(([k,v]) => ({ name:k, balance:v.balance }));

    const makeItems = (items, valueKey, color, emptyLabel) => items.length > 0
      ? items.map(item => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.0.2);gap:8px;">
            <span style="color:var(--text);font-size:11px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${itemIcon(item.name,14)}${item.name}</span>
            <span style="color:${color};font-family:'Share Tech Mono',monospace;font-size:10px;flex-shrink:0;">${fmt(item[valueKey] ?? item.rate)}/분</span>
          </div>`).join('')
      : `<div style="color:var(--text-muted);font-size:11px;padding:4px 0;">없음</div>`;

    if (isMobile) {
      // ── 모바일: 수치 3열 → 세로, 품목 섹션 → 세로 ──
      html += `<div style="border:1px solid rgba(255,255,255,0.12);border-radius:4px;overflow:hidden;">
        <!-- 헤더 -->
        <div style="padding:10px 14px;background:rgba(240,200,22,0.07);border-bottom:1px solid rgba(255,255,255,0.09);">
          <span style="font-size:13px;font-weight:700;color:var(--accent);">◈ ${o.name}</span>
        </div>
        <!-- 관리권 수치 3열 -->
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;padding:10px 12px;gap:6px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:center;">
          <div>
            <div style="font-size:9px;color:var(--text-muted);">생산</div>
            <div style="font-size:13px;font-weight:700;color:var(--success);font-family:'Share Tech Mono',monospace;">${authTotal > 0 ? fmt(authTotal) : '—'}</div>
            <div style="font-size:9px;color:var(--text-muted);">/분</div>
          </div>
          <div>
            <div style="font-size:9px;color:var(--text-muted);">소모</div>
            <div style="font-size:13px;font-weight:700;color:var(--danger);font-family:'Share Tech Mono',monospace;">${fmt(outpostConsume)}</div>
            <div style="font-size:9px;color:var(--text-muted);">/분</div>
          </div>
          <div>
            <div style="font-size:9px;color:var(--text-muted);">잔여</div>
            <div style="font-size:13px;font-weight:700;font-family:'Share Tech Mono',monospace;color:${authBalance>=0?'var(--success)':'var(--danger)'};">${authTotal>0?(authBalance>=0?'+':'')+fmt(authBalance):'—'}</div>
            <div style="font-size:9px;color:var(--text-muted);">/분</div>
          </div>
        </div>
        <!-- 품목 섹션 세로 나열 -->
        <div style="padding:10px 14px;display:flex;flex-direction:column;gap:10px;">
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--accent2);margin-bottom:4px;">관리권 교환 품목</div>
            ${makeItems(authItems, 'rate', 'var(--accent)', '없음')}
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--accent);margin-bottom:4px;">생산 품목</div>
            ${makeItems(factoryItems, 'balance', 'var(--success)', '없음')}
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--danger);margin-bottom:4px;">부족 품목</div>
            ${makeItems(deficitItems, 'balance', 'var(--danger)', '없음')}
          </div>
        </div>
      </div>`;
    } else {
      // ── PC: 기존 레이아웃 ──
      html += `<div style="border:1px solid rgba(255,255,255,0.12);border-radius:4px;overflow:hidden;">
        <div style="padding:12px 16px;background:rgba(240,200,22,0.07);border-bottom:1px solid rgba(255,255,255,0.09);display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:14px;font-weight:700;color:var(--accent);">◈ ${o.name}</span>
          <div style="display:flex;gap:16px;font-family:'Share Tech Mono',monospace;font-size:11px;">
            <span style="color:var(--success);">생산 ${authTotal > 0 ? fmt(authTotal) : '—'}/분</span>
            <span style="color:var(--danger);">소모 ${fmt(outpostConsume)}/분</span>
            <span style="color:${authBalance>=0?'var(--success)':'var(--danger)'};">잔여 ${authTotal>0?(authBalance>=0?'+':'')+fmt(authBalance):'—'}/분</span>
          </div>
        </div>
        <div style="padding:12px 16px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--accent2);letter-spacing:0.08em;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.08);">관리권 교환 품목</div>
            ${makeItems(authItems, 'rate', 'var(--accent)', '없음')}
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--accent);letter-spacing:0.08em;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.08);">생산 품목</div>
            ${makeItems(factoryItems, 'balance', 'var(--success)', '없음')}
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--danger);letter-spacing:0.08em;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.08);">부족 품목</div>
            ${makeItems(deficitItems, 'balance', 'var(--danger)', '없음')}
          </div>
        </div>
      </div>`;
    }
  });

  // 전체 합산 카드 (공통)
  const totalBalance = totalAuthProduce - totalAuthConsume;
  html += `<div style="border:1px solid rgba(240,200,22,0.35);border-radius:4px;padding:14px 16px;background:rgba(240,200,22,0.06);">
    <div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:10px;">📊 전체 합산 — 관리권</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;">
      <div>
        <div style="font-size:10px;color:var(--text-label);font-weight:500;">총 생산</div>
        <div style="font-size:${isMobile?'16':'20'}px;font-weight:700;color:var(--success);font-family:'Share Tech Mono',monospace;">${totalAuthProduce > 0 ? fmt(totalAuthProduce) : '—'}</div>
        <div style="font-size:10px;color:var(--text-muted);">/분</div>
      </div>
      <div>
        <div style="font-size:10px;color:var(--text-muted);">총 목표 소모</div>
        <div style="font-size:${isMobile?'16':'20'}px;font-weight:700;color:var(--danger);font-family:'Share Tech Mono',monospace;">${fmt(totalAuthConsume)}</div>
        <div style="font-size:10px;color:var(--text-muted);">/분</div>
      </div>
      <div>
        <div style="font-size:10px;color:var(--text-muted);">총 잔여</div>
        <div style="font-size:${isMobile?'16':'20'}px;font-weight:700;font-family:'Share Tech Mono',monospace;color:${totalBalance>=0?'var(--success)':'var(--danger)'};">
          ${totalAuthProduce > 0 ? (totalBalance >= 0 ? '+' : '') + fmt(totalBalance) : '—'}
        </div>
        <div style="font-size:10px;color:var(--text-muted);">/분</div>
      </div>
    </div>
  </div>`;

  el.innerHTML = html;
}

// ========== TAB SWITCH ==========
// 탭 체류시간 측정
var _tabStartTime = Date.now();
var _currentTab = 'authority';

function trackTabLeave(tab) {
  const duration = Math.round((Date.now() - _tabStartTime) / 1000);
  if (duration > 1) {
    gtag('event', 'tab_leave', { tab_name: tab, duration_sec: duration });
  }
}

function switchTab(tab) {
  trackTabLeave(_currentTab);
  _currentTab = tab;
  _tabStartTime = Date.now();
  gtag('event', 'tab_view', { tab_name: tab });
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  // outpost 탭: 기존 authority/factory 탭도 outpost로 리다이렉트
  const actualTab = (tab === 'authority' || tab === 'factory') ? 'outpost' : tab;
  const el = document.getElementById('tab-' + actualTab);
  if (el) el.classList.add('active');

  document.querySelectorAll('.tab').forEach(t => {
    if (t.getAttribute('onclick')?.includes(`'${actualTab}'`)) t.classList.add('active');
  });

  if (actualTab === 'overview') renderOverviewTab();
  if (actualTab === 'changelog') renderChangelog();
  if (actualTab === 'outpost') {
    renderOutpostBadges();
    switchOutpostTab(_currentOutpostTab || 'auth-produce');
  }
  if (actualTab === 'layout') {
    setTimeout(function() {
      var root = document.getElementById('factory-layout-root');
      if (root && !root._mounted && typeof FactoryLayout !== 'undefined') {
        root._mounted = true;
        ReactDOM.render(React.createElement(FactoryLayout), root);
      }
    }, 50);
  }
}

// ========== 거점 운영 서브탭 ==========
var _currentOutpostTab = 'auth-produce';

function renderOutpostBadges() {
  const el = document.getElementById('outpost-badge-wrap');
  if (!el) return;
  // 관리권/공장 모두 activeAuthOutpostId 기준으로 표시
  const currentId = activeAuthOutpostId || activeOutpostId;
  el.innerHTML = OUTPOSTS.map(o => {
    const isActive = o.id === currentId;
    return `<button onclick="switchOutpostOutpost('${o.id}')"
      style="padding:4px 14px;font-size:11px;font-weight:700;cursor:pointer;
        border-radius:9999px;border:2px solid ${isActive ? 'var(--accent)' : 'rgba(255,255,255,0.15)'};
        background:${isActive ? 'rgba(240,200,22,0.15)' : 'transparent'};
        color:${isActive ? 'var(--accent)' : 'var(--text-muted)'};
        font-family:'Noto Sans KR',sans-serif;transition:all 0.15s;">
      ${o.name}
    </button>`;
  }).join('');
}

function switchOutpostOutpost(oId) {
  activeOutpostId = oId;
  activeAuthOutpostId = oId;
  renderOutpostBadges();
  // 현재 열린 서브탭 내용 갱신
  switchOutpostTab(_currentOutpostTab || 'auth-produce');
}

function switchOutpostTab(tab) {
  _currentOutpostTab = tab;
  const panels = ['auth-produce', 'resource', 'auth-consume', 'factory'];
  panels.forEach(p => {
    const el = document.getElementById('opanel-' + p);
    if (el) el.style.display = p === tab ? '' : 'none';
    const btn = document.getElementById('otab-' + p);
    if (btn) btn.classList.toggle('active', p === tab);
  });

  // 관리권 요약 바: ①③에서만 표시
  const summaryBar = document.getElementById('auth-summary-fixed');
  if (summaryBar) summaryBar.style.display = (tab === 'auth-produce' || tab === 'auth-consume') ? '' : 'none';

  if (tab === 'auth-produce') {
    // ① 관리권 생산량: 기존 관리권 탭 "관리권 생산 계산"
    renderAuthOutpostTabs();
    switchAuthView('outpost', activeAuthOutpostId);
  }
  if (tab === 'resource') {
    // ② 천연자원 생산량: 기존 공장 탭 천연 자원 내용
    renderResourceInputs();
  }
  if (tab === 'auth-consume') {
    renderAuthConsumePanelContent(activeAuthOutpostId);
  }
  if (tab === 'factory') {
    renderWorkspace();
    renderResults();
    updateFactoryAuthBar();
  }
}

// ========== ③ 관리권 소모 계산 전용 ==========
function renderAuthConsumeOutpostTabs() {
  const el = document.getElementById('auth-outpost-tabs-consume');
  if (!el) return;
  el.innerHTML = OUTPOSTS.map(o => {
    const isActive = o.id === activeAuthOutpostId;
    return `<div class="inner-tab ${isActive ? 'active' : ''}"
      onclick="switchAuthConsumeView('${o.id}')">
      ${o.name}
    </div>`;
  }).join('');
}

function switchAuthConsumeView(oId) {
  activeAuthOutpostId = oId;
  activeOutpostId = oId;
  renderOutpostBadges();
  renderAuthConsumeOutpostTabs();
  renderAuthConsumePanelContent(oId);
}

function renderAuthConsumePanelContent(oId) {
  const panel = document.getElementById('auth-outpost-panel-consume');
  if (!panel) return;
  const outpost = OUTPOSTS.find(o => o.id === oId);
  const authTotal = calcOutpostAuthTotal(oId);
  const fmt = n => Number.isFinite(n) ? n.toFixed(2) : '—';

  panel.innerHTML = `
    <div style="padding:10px 14px;border-bottom:1px solid var(--border);background:rgba(240,200,22,0.04);">
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px;">${outpost?.name || oId}</div>
      <div style="display:flex;align-items:baseline;gap:8px;">
        <span style="font-size:22px;font-weight:700;color:var(--accent);font-family:'Share Tech Mono',monospace;">${authTotal > 0 ? fmt(authTotal) : '—'}</span>
        <span style="font-size:12px;color:var(--text-muted);">/분</span>
      </div>
    </div>
    <div style="padding:10px 14px;border-bottom:1px solid var(--border);background:rgba(0,0,0,0.1);display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
      <span style="font-size:10px;color:var(--text-muted);">목표 분당 생산량을 입력하면 관리권 소모량과 달성 가능 여부를 계산합니다</span>
      <button class="btn btn-primary" style="font-size:11px;padding:5px 12px;flex-shrink:0;" onclick="autoCalcFactory('${oId}')">
        ⚙ 공장 설비 자동 계산
      </button>
    </div>
    <div id="auth-product-body-consume-${oId}" style="padding:8px;display:flex;flex-direction:column;gap:6px;"></div>
  `;
  renderOutpostProductsTo(oId, `auth-product-body-consume-${oId}`);
  updateOutpostAuthSummary(oId);
}

// ========== 공장 거점 선택 탭 ==========
function renderFactoryOutpostTabs() {
  const el = document.getElementById('factory-outpost-tabs');
  if (!el) return;
  el.innerHTML = OUTPOSTS.map(o => {
    const isActive = o.id === activeOutpostId;
    return `<button onclick="switchOutpost('${o.id}')"
      style="padding:7px 22px;font-size:12px;font-weight:600;cursor:pointer;
        border-radius:9999px;border:1px solid ${isActive ? 'var(--accent)' : 'rgba(255,255,255,0.1)'};
        background:${isActive ? 'var(--accent)' : 'transparent'};
        color:${isActive ? 'var(--accent-text)' : 'var(--text-label)'};
        font-family:'Noto Sans KR',sans-serif;transition:all 0.15s;">
      ${o.name}
    </button>`;
  }).join('');
}

function switchOutpost(oId) {
  activeOutpostId = oId;
  renderFactoryOutpostTabs();
  renderResourceInputs();
  renderWorkspace();
  renderResults();
  updateFactoryAuthBar();
}

function resetAll() {
  od().groups = [];
  renderWorkspace();
  renderResults();
  renderAuthProducts();
  scheduleSave();
}

// ========== LOCAL STORAGE ==========
const SAVE_KEY = 'endfield_calc_v1';

// 값이 바뀔 때마다 자동 저장 (디바운스 300ms)
let saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveData, 300);
}

function saveData() {
  try {
    // outpostData 직렬화
    const savedOutpostData = {};
    OUTPOSTS.forEach(o => {
      savedOutpostData[o.id] = {
        resourceRates: outpostData[o.id].resourceRates,
        groups:        outpostData[o.id].groups,
        targetRates:   outpostData[o.id].targetRates,
        nextGroupId:   outpostData[o.id].nextGroupId,
      };
    });
    const data = { outpostData: savedOutpostData, baseEff, presets, activeOutpostId, opStates, activeOperatorName };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    markSaved();
  } catch(e) { console.warn('저장 실패:', e); }
}

function loadData() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);

    if (data.activeOutpostId) activeOutpostId = data.activeOutpostId;

    if (data.outpostData) {
      OUTPOSTS.forEach(o => {
        const saved = data.outpostData[o.id];
        if (!saved) return;
        if (saved.resourceRates) Object.assign(outpostData[o.id].resourceRates, saved.resourceRates);
        if (saved.groups)        outpostData[o.id].groups      = saved.groups;
        if (saved.targetRates)   Object.assign(outpostData[o.id].targetRates, saved.targetRates);
        if (saved.nextGroupId)   outpostData[o.id].nextGroupId = saved.nextGroupId;
      });
    }
    // 구버전 호환
    if (!data.outpostData && data.groups) outpostData[OUTPOSTS[0].id].groups = data.groups;

    if (data.baseEff) {
      OUTPOSTS.forEach(o => {
        if (data.baseEff[o.id]) {
          Object.entries(data.baseEff[o.id]).forEach(([zoneName, saved]) => {
            if (baseEff[o.id]?.[zoneName]) {
              // 새 구조 필드로 복원
              if (saved.baseAmt !== undefined) baseEff[o.id][zoneName].baseAmt = saved.baseAmt;
              if (saved.assignedOp !== undefined) baseEff[o.id][zoneName].assignedOp = saved.assignedOp;
              if (saved.defenseLevel !== undefined) baseEff[o.id][zoneName].defenseLevel = saved.defenseLevel;
              if (saved.eventOn !== undefined) baseEff[o.id][zoneName].eventOn = saved.eventOn;
              // 구버전 호환
              if (saved.opper !== undefined && !saved.assignedOp) { /* 무시 */ }
              if (saved.defense !== undefined && !saved.defenseLevel) baseEff[o.id][zoneName].defenseLevel = Math.round(saved.defense / 0.10);
              if (saved.event !== undefined && !saved.eventOn) baseEff[o.id][zoneName].eventOn = saved.event > 0;
            }
          });
        }
      });
    }
    if (data.presets) presets = data.presets;
    if (data.opStates) { opStates = data.opStates; }
    if (data.activeOperatorName) activeOperatorName = data.activeOperatorName;
    // 구 버전 호환
    if (data.operators && !data.opStates) {
      data.operators.forEach(op => { opStates[op.name] = op; });
      if (data.operators.length > 0) activeOperatorName = data.operators[data.operators.length-1].name;
    }
  } catch(e) { console.warn('불러오기 실패:', e); }
}

// ========== 오퍼레이터 육성 계산기 ==========

// 돌파(승격) 재료 - Elite 1~4
// Elite N: 레벨캡 20→40→60→80→90
const PROMOTION_COST = [
  { label: '정예 1', capFrom: 20, capTo: 40,
    mats: [{ name: '탈로시안 화폐', qty: 1600 }, { name: '프로토콜 디스크', qty: 8 }, { name: '연한 기둥 버섯', qty: 3 }] },
  { label: '정예 2', capFrom: 40, capTo: 60,
    mats: [{ name: '탈로시안 화폐', qty: 6500 }, { name: '프로토콜 디스크', qty: 25 }, { name: '보통 기둥 버섯', qty: 5 }] },
  { label: '정예 3', capFrom: 60, capTo: 80,
    mats: [{ name: '탈로시안 화폐', qty: 18000 }, { name: '프로토콜 디스크 세트', qty: 24 }, { name: '진한 기둥 버섯', qty: 5 }] },
  { label: '정예 4', capFrom: 80, capTo: 90,
    mats: [{ name: '탈로시안 화폐', qty: 100000 }, { name: '프로토콜 디스크 세트', qty: 36 }] },
  // 정예 4 고유 재료는 캐릭터별로 OPERATOR_ROSTER 또는 별도 로직에서 처리
];

// EXP 누적 필요량 (레벨 구간별)
const EXP_TABLE = [
  { from: 1,  to: 20, exp: 23000 },
  { from: 21, to: 40, exp: 249000 },  // 272000 - 23000
  { from: 41, to: 60, exp: 475110 },  // 747110 - 272000
  { from: 61, to: 80, exp: 465230 },  // 1212340 - 747110
  { from: 81, to: 90, exp: 579950 },  // 1792290 - 1212340
];

// 스킬 레벨업 재료 (레벨 1→9, 각 레벨 업그레이드 비용)
// 스킬 4종(기본공격/배틀스킬/콤보스킬/궁극기) 모두 동일 비용
const SKILL_LEVEL_COST = [
  { from: 1,  to: 2,  mats: [{ name: '탈로시안 화폐', qty: 1000  }, { name: '프로토콜 프리즘', qty: 6  }, { name: '칼코덴드라', qty: 1 }] },
  { from: 2,  to: 3,  mats: [{ name: '탈로시안 화폐', qty: 2700  }, { name: '프로토콜 프리즘', qty: 12 }, { name: '칼코덴드라', qty: 2 }] },
  { from: 3,  to: 4,  mats: [{ name: '탈로시안 화폐', qty: 3200  }, { name: '프로토콜 프리즘', qty: 16 }, { name: '크리소덴드라', qty: 1 }] },
  { from: 4,  to: 5,  mats: [{ name: '탈로시안 화폐', qty: 4200  }, { name: '프로토콜 프리즘', qty: 21 }, { name: '크리소덴드라', qty: 1 }] },
  { from: 5,  to: 6,  mats: [{ name: '탈로시안 화폐', qty: 5400  }, { name: '프로토콜 프리즘', qty: 27 }, { name: '크리소덴드라', qty: 2 }] },
  { from: 6,  to: 7,  mats: [{ name: '탈로시안 화폐', qty: 8200  }, { name: '프로토콜 프리즘', qty: 6  }, { name: '비트로덴드라', qty: 1 }] },
  { from: 7,  to: 8,  mats: [{ name: '탈로시안 화폐', qty: 10500 }, { name: '프로토콜 프리즘 세트', qty: 8  }, { name: '비트로덴드라', qty: 1 }] },
  { from: 8,  to: 9,  mats: [{ name: '탈로시안 화폐', qty: 18000 }, { name: '프로토콜 프리즘 세트', qty: 15 }, { name: '비트로덴드라', qty: 2 }] },
  // Lv9→12 마스터리 — 존속의 흔적 + 캐릭터별 고유 재료 (opSkillMats1/2 로 참조)
  { from: 9,  to: 10, mats: [{ name: '탈로시안 화폐', qty: 24000 }, { name: '프로토콜 프리즘 세트', qty: 15 }, { name: '존속의 흔적', qty: 1 }], usesSkillMats: true, skillMatsQty: [6, 3]  },
  { from: 10, to: 11, mats: [{ name: '탈로시안 화폐', qty: 30000 }, { name: '프로토콜 프리즘 세트', qty: 24 }, { name: '존속의 흔적', qty: 2 }], usesSkillMats: true, skillMatsQty: [16, 6] },
  { from: 11, to: 12, mats: [{ name: '탈로시안 화폐', qty: 65000 }, { name: '프로토콜 프리즘 세트', qty: 50 }, { name: '존속의 흔적', qty: 3 }], usesSkillMats: true, skillMatsQty: [36, 12] },
];

// 어빌리티 매트릭스(재능 노드) 비용
// 구조: [{label, requireElite, mats}]
const TALENT_NODE_COST = [
  { label: '능력치 R1',      requireElite: 1, mats: [{ name: '탈로시안 화폐', qty: 1000  }, { name: '프로토콜 프리즘', qty: 5  }] },
  { label: '능력치 R2',      requireElite: 2, mats: [{ name: '탈로시안 화폐', qty: 1800  }, { name: '프로토콜 프리즘', qty: 10 }] },
  { label: '능력치 R3',      requireElite: 3, mats: [{ name: '탈로시안 화폐', qty: 6000  }, { name: '프로토콜 프리즘 세트', qty: 10 }] },
  { label: '능력치 R4',      requireElite: 3, mats: [{ name: '탈로시안 화폐', qty: 18000 }, { name: '프로토콜 프리즘 세트', qty: 20 }] },
  { label: '재능1 R1',       requireElite: 1, mats: [{ name: '탈로시안 화폐', qty: 2400  }, { name: '프로토콜 프리즘', qty: 12 }] },
  { label: '재능1 R2',       requireElite: 2, mats: [{ name: '탈로시안 화폐', qty: 8600  }, { name: '프로토콜 프리즘', qty: 40 }] },
  { label: '재능2 R1',       requireElite: 2, mats: [{ name: '탈로시안 화폐', qty: 10800 }, { name: '프로토콜 프리즘', qty: 48 }] },
  { label: '재능2 R2',       requireElite: 3, mats: [{ name: '탈로시안 화폐', qty: 24600 }, { name: '프로토콜 프리즘 세트', qty: 28 }] },
  { label: '인프라스킬1 R1', requireElite: 1, mats: [{ name: '탈로시안 화폐', qty: 1600  }, { name: '프로토콜 프리즘', qty: 6  }] },
  { label: '인프라스킬1 R2', requireElite: 3, mats: [{ name: '탈로시안 화폐', qty: 8000  }, { name: '프로토콜 프리즘 세트', qty: 12 }] },
  { label: '인프라스킬2 R1', requireElite: 2, mats: [{ name: '탈로시안 화폐', qty: 3000  }, { name: '프로토콜 프리즘', qty: 12 }] },
  { label: '인프라스킬2 R2', requireElite: 4, mats: [{ name: '탈로시안 화폐', qty: 20000 }, { name: '프로토콜 프리즘 세트', qty: 20 }] },
  { label: '장비 조합 I',    requireElite: 1, mats: [{ name: '탈로시안 화폐', qty: 1800  }] },
  { label: '장비 조합 II',   requireElite: 2, mats: [{ name: '탈로시안 화폐', qty: 6500  }] },
  { label: '장비 조합 III',  requireElite: 3, mats: [{ name: '탈로시안 화폐', qty: 25600 }] },
];

// 스킬 종류
const SKILL_TYPES = ['기본 공격', '배틀 스킬', '콤보 스킬', '궁극기'];

// 전체 오퍼레이터 목록 (이름, 레어리티, 클래스, 원소)
const ELEMENT_COLOR = {
  Nature: '#4caf50', Electric: '#ab47bc', Heat: '#ef5350',
  Cryo: '#29b6f6', Physical: '#90a4ae',
};
const RARITY_COLOR = { 6: '#ffd740', 5: '#b39ddb', 4: '#4fc3f7' };
const CLASS_KR = {
  Guard:'가드', Striker:'스트라이커', Defender:'디펜더',
  Caster:'캐스터', Supporter:'서포터', Vanguard:'뱅가드',
};

// 오퍼레이터별 육성 상태 맵 { name: opData }
let opStates = {};
let activeOperatorName = null;

// 하위호환 - operators/activeOperatorId 접근 코드와 호환
function getActiveOp() {
  if (!activeOperatorName) return null;
  if (!opStates[activeOperatorName]) {
    opStates[activeOperatorName] = getDefaultOperator(activeOperatorName);
  }
  return opStates[activeOperatorName];
}

// 구 코드 호환용
let operators = [];
let activeOperatorId = null;
let nextOperatorId = 1;

function getDefaultOperator(name) {
  const roster = OPERATOR_ROSTER.find(o => o.name === name);
  return {
    id: name,  // id를 name으로 사용
    name,
    rarity: roster?.rarity || 5,
    currentElite: 0, targetElite: 0,
    currentLevel: 1, targetLevel: 1,
    skills: SKILL_TYPES.map(type => ({ type, currentLv: 1, targetLv: 1 })),
    curTalentNodes: TALENT_NODE_COST.map((n, i) => ({ idx: i, enabled: false })),
    tgtTalentNodes: TALENT_NODE_COST.map((n, i) => ({ idx: i, enabled: false })),
  };
}

function calcOperatorMats(op) {
  const result = {};
  const add = (name, qty) => { if (name) result[name] = (result[name] || 0) + qty; };

  const curElite = op.currentElite || 0;
  const tgtElite = op.targetElite  || 0;
  const roster   = OPERATOR_ROSTER.find(r => r.name === op.name);

  // 1. 정예화 재료
  for (let e = curElite; e < tgtElite; e++) {
    const cost = PROMOTION_COST[e];
    if (!cost) continue;
    cost.mats.forEach(m => add(m.name, m.qty));
    // 정예 4 고유 재료
    if (e === 3 && roster) {
      if (roster.e4mat1) add(roster.e4mat1, 8);
      if (roster.e4mat2) add(roster.e4mat2, 20);
    }
  }

  // 2. EXP (레벨업)
  const curLv = op.currentLevel || 1;
  const tgtLv = op.targetLevel  || 1;
  let totalExp = 0;
  EXP_TABLE.forEach(row => {
    const overlapFrom = Math.max(curLv, row.from);
    const overlapTo   = Math.min(tgtLv, row.to);
    if (overlapFrom >= overlapTo) return;
    const ratio = (overlapTo - overlapFrom) / (row.to - row.from);
    totalExp += Math.ceil(row.exp * ratio);
  });
  if (totalExp > 0) {
    const adv = Math.floor(totalExp / 10000);
    const rem1 = totalExp % 10000;
    const mid = Math.floor(rem1 / 3000);
    const rem2 = rem1 % 3000;
    const bas = Math.ceil(rem2 / 1000);
    if (adv > 0) add('고급 전투기록', adv);
    if (mid > 0) add('중급 전투기록', mid);
    if (bas > 0) add('초급 전투기록', bas);
  }

  // 3. 스킬 레벨업 — A 그룹(기본공격/배틀스킬), B 그룹(콤보스킬/궁극기) 구분
  (op.skills || []).forEach((sk, i) => {
    const from = sk.currentLv || 1;
    const to   = sk.targetLv  || 1;
    const isGroupA = i < 2; // 0=기본공격, 1=배틀스킬 → A
    SKILL_LEVEL_COST.forEach(cost => {
      if (cost.from >= from && cost.to <= to) {
        cost.mats.forEach(m => add(m.name, m.qty));
        // 마스터리 고유 재료 (Lv9~12)
        if (cost.usesSkillMats && roster) {
          const [q1, q2] = cost.skillMatsQty;
          if (isGroupA) {
            if (roster.skillMatA1) add(roster.skillMatA1, q1);
            if (roster.skillMatA2) add(roster.skillMatA2, q2);
          } else {
            if (roster.skillMatB1) add(roster.skillMatB1, q1);
            if (roster.skillMatB2) add(roster.skillMatB2, q2);
          }
        }
      }
    });
  });

  // 4. 재능 노드
  (op.tgtTalentNodes || op.talentNodes || []).forEach(tn => {
    if (!tn.enabled) return;
    const node = TALENT_NODE_COST[tn.idx];
    if (!node) return;
    if (node.requireElite > tgtElite) return;
    node.mats.forEach(m => add(m.name, m.qty));
  });

  return result;
}

// 선택된 오퍼레이터 재료 계산
function calcTotalMats() {
  const op = getActiveOp();
  if (!op) return {};
  return calcOperatorMats(op);
}

// ===== 렌더링 =====
// 등급별 이름 색상
const RARITY_NAME_COLOR = { 6: '#ff6b6b', 5: '#e8b800', 4: '#b39ddb' };
const RARITY_BG_COLOR   = { 6: 'rgba(255,107,107,0.25)', 5: 'rgba(232,184,0,0.25)', 4: 'rgba(179,157,219,0.25)' };

function renderOperatorList() {
  const el = document.getElementById('operator-list');
  if (!el) return;

  const roster = OPERATOR_ROSTER;
  if (!roster || roster.length === 0) {
    el.innerHTML = '<div style="padding:16px;color:var(--text-muted);font-size:12px;">오퍼레이터 데이터 없음</div>';
    return;
  }

  const groups = [6, 5, 4];
  let html = '';
  groups.forEach(rarity => {
    const ops = roster.filter(o => o.rarity === rarity);
    if (!ops.length) return;
    const rc  = RARITY_NAME_COLOR[rarity] || 'var(--text-muted)';
    const rbg = RARITY_BG_COLOR[rarity]   || 'rgba(255,255,255,0.1)';
    html += `<div style="padding:6px 10px 2px;font-size:10px;font-weight:700;color:${rc};letter-spacing:0.06em;">★${rarity}</div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(64px,1fr));gap:6px;padding:0 8px 8px;">`;
    ops.forEach(o => {
      const isActive = activeOperatorName === o.name;
      const state = opStates[o.name];
      const hasData = state && (state.currentElite > 0 || state.targetElite > 0 || state.currentLevel > 1);
      const thumbName2 = o.name === '관리자' ? '관리자(여)' : o.name;
      const thumbUrl2 = `op_icons/${thumbName2.replace(/\s+/g,'_')}.png`;
      html += `<div onclick="selectOperatorByName('${o.name}')"
        style="cursor:pointer;border-radius:6px;overflow:hidden;
          border:2px solid ${isActive ? 'var(--accent)' : hasData ? rc+'88' : 'rgba(255,255,255,0.1)'};
          background:${isActive ? 'rgba(240,200,22,0.1)' : 'rgba(255,255,255,0.03)'};
          transition:all 0.15s;text-align:center;">
        <div style="width:100%;aspect-ratio:1;background:rgba(255,255,255,0.05);overflow:hidden;">
          <img src="${thumbUrl2}" alt="${o.name}"
            style="width:100%;height:100%;object-fit:cover;"
            onerror="this.parentElement.innerHTML='<span style=\\'font-size:20px;display:flex;align-items:center;justify-content:center;width:100%;height:100%;\\'>👤</span>'">
        </div>
        <div style="padding:3px 2px;font-size:10px;font-weight:600;
          color:var(--text);
          background:${isActive ? 'rgba(240,200,22,0.3)' : rbg};
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          ${o.name}
        </div>
      </div>`;
    });
    html += `</div>`;
  });

  el.innerHTML = html;
}

function selectOperatorByName(name) {
  activeOperatorName = name;
  if (!opStates[name]) {
    opStates[name] = getDefaultOperator(name);
  }
  // 구 코드 호환
  activeOperatorId = name;
  renderOperatorList();
  renderOperatorConfig();
  saveData();
}

// 오퍼레이터 상태 가져오기 - opStates 기반
function getActiveOp() {
  if (!activeOperatorName) return null;
  if (!opStates[activeOperatorName]) {
    opStates[activeOperatorName] = getDefaultOperator(activeOperatorName);
  }
  return opStates[activeOperatorName];
}

function renderOperatorConfig() {
  const panel = document.getElementById('operator-config-panel');
  if (!panel) return;
  const op = getActiveOp();
  if (!op) {
    panel.innerHTML = `<div class="empty-state" style="padding:48px;">
      <div class="icon">👤</div>
      <div style="font-size:12px;color:var(--text-muted);line-height:1.8;">
        왼쪽에서 오퍼레이터를 선택하거나<br>
        <b>+ 추가</b> 버튼으로 새로 추가하세요<br><br>
        <span style="font-size:11px;">현재→목표를 설정하면<br>필요 재료가 자동 계산됩니다</span>
      </div>
    </div>`;
    return;
  }

  const mats = calcOperatorMats(op);
  const matHtml = Object.entries(mats).length > 0
    ? Object.entries(mats).map(([name, qty]) =>
        `<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:11px;">
          <span style="color:var(--text);">${itemIcon(name, 16)}${name}</span>
          <span style="color:var(--accent);font-family:'Share Tech Mono',monospace;font-weight:700;">${qty.toLocaleString()}</span>
        </div>`).join('')
    : `<div style="color:var(--text-muted);font-size:11px;padding:8px 0;">목표를 설정하면 재료가 계산됩니다</div>`;

  // ── 새 UI: 현재/목표 병렬 패널 ──────────────────────────
  const EQUIP_GRADE = [
    {idx:12, label:'장비 조합 I',   color:'#4fc3f7', afterE:1},
    {idx:13, label:'장비 조합 II',  color:'#b39ddb', afterE:2},
    {idx:14, label:'장비 조합 III', color:'#ffd740', afterE:3},
  ];

  function nodePanel(mode) {
    const isCur = mode === 'cur';
    const elite  = isCur ? op.currentElite : op.targetElite;
    const lv     = isCur ? op.currentLevel  : op.targetLevel;
    const color  = isCur ? '#48c880' : '#e8b800';
    const label  = isCur ? '현재' : '목표';
    const tnKey  = isCur ? 'curTalentNodes' : 'tgtTalentNodes';
    const tn     = op[tnKey] || TALENT_NODE_COST.map((_,i)=>({idx:i,enabled:false}));
    const curTn  = op['curTalentNodes'] || TALENT_NODE_COST.map((_,i)=>({idx:i,enabled:false}));
    const curChainStep = getChainStep(op, 'cur');

    // 헬퍼: 토글 onclick
    const tog = (idx, cur) =>
      `toggleTalentNode('${op.id}',${idx},${!cur},'${mode}')`;

    // ── 규칙 상수 ──
    // 스킬 최대 랭크: E0→1, E1→3, E2→6, E3→9, E4→12
    const SKILL_MAX = [1,3,6,9,12];
    const skillMax = SKILL_MAX[elite] || 1;

    // ── 레벨 ──
    const levelHtml = `<div style="display:flex;align-items:center;gap:6px;">
      <span style="font-size:10px;color:var(--text-muted);">Lv</span>
      <input type="number" min="1" max="90" value="${lv}"
        class="ws-count-input" style="width:50px;font-size:12px;text-align:center;"
        onchange="updateOpField('${op.id}','${isCur?'currentLevel':'targetLevel'}',+this.value)">
      <span style="font-size:10px;color:var(--text-muted);">/90</span>
    </div>`;

    // ── 스킬 강화 ──
    const skillHtml = SKILL_TYPES.map((type, si) => {
      const sk = op.skills?.[si] || { currentLv:1, targetLv:1 };
      const curLv = isCur ? sk.currentLv : sk.targetLv;
      const bars = Array.from({length:9}, (_,r) => {
        const rank = r+1;
        const locked = rank > skillMax;
        const filled = !locked && curLv >= rank;
        return `<div style="height:8px;flex:1;border-radius:2px;
          background:${filled?color:locked?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.12)'};
          cursor:${locked?'default':'pointer'};opacity:${locked?0.3:1};transition:background 0.1s;"
          onclick="${locked?'':('updateSkillLv(\''+op.id+'\',' +si+',\''+( isCur?'currentLv':'targetLv')+'\',' +rank+')')}"
          title="Rank ${rank}${locked?' (잠김)':''}"></div>`;
      }).join('');
      const hexes = Array.from({length:3}, (_,r) => {
        const rank = r+10;
        const locked = rank > skillMax;
        const filled = !locked && curLv >= rank;
        const pts = '12,2 22,7 22,17 12,22 2,17 2,7';
        return `<svg width="22" height="22" viewBox="0 0 24 24"
          style="cursor:${locked?'default':'pointer'};opacity:${locked?0.3:1};"
          onclick="${locked?'':('updateSkillLv(\''+op.id+'\',' +si+',\''+( isCur?'currentLv':'targetLv')+'\',' +rank+')')}"
          title="Rank ${rank}${locked?' (잠김)':''}">
          <polygon points="${pts}"
            fill="${filled?color+'33':'transparent'}"
            stroke="${filled?color:locked?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.25)'}"
            stroke-width="1.5"/>
          <text x="12" y="15" text-anchor="middle" font-size="7"
            fill="${filled?color:'rgba(255,255,255,0.4)'}" font-weight="700">${rank}</text>
        </svg>`;
      }).join('');
      return `<div style="margin-bottom:5px;">
        <div style="font-size:9px;color:var(--text-muted);margin-bottom:2px;">${type} <span style="color:${color};font-size:8px;">Rank ${curLv}/${skillMax}</span></div>
        <div style="display:flex;align-items:center;gap:3px;">
          <div style="display:flex;gap:2px;flex:1;">${bars}</div>
          <div style="display:flex;gap:1px;">${hexes}</div>
        </div>
      </div>`;
    }).join('');

    // ── 능력치 강화 (E1→R1, E2→R2, E3→R3, E4→R4, 순서 의존) ──
    const statNodes = [0,1,2,3].map(i => {
      const requireElite = i+1;
      const cur = tn[i] || {enabled:false};
      const avail = elite >= requireElite;
      const active = cur.enabled && avail;
      const curLocked = !isCur && curTn[i]?.enabled && active; // 목표에서 현재값 잠금
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;opacity:${avail?1:0.3};">
        <div onclick="${avail&&!curLocked?tog(i,cur.enabled):(avail&&curLocked?'showCurLockedMsg()':'void(0)')}"
          style="width:28px;height:28px;border-radius:50%;
            border:2px solid ${active?(curLocked?'rgba(255,100,100,0.6)':color):'rgba(255,255,255,0.2)'};
            background:${active?color+'22':'transparent'};
            cursor:${avail?'pointer':'default'};
            display:flex;align-items:center;justify-content:center;transition:all 0.15s;">
          <span style="font-size:8px;color:${active?color:'var(--text-muted)'};">${curLocked?'🔒':'R'+(i+1)}</span>
        </div>
        <span style="font-size:8px;color:var(--text-muted);">E${requireElite}</span>
      </div>`;
    }).join('');

    // ── 정예화 + 장비 해금 (ELITE_CHAIN 기반) ──
    const curStep = getChainStep(op, mode);
    const CHAIN_EQUIP_COLORS = ['#4fc3f7','#b39ddb','#ffd740'];

    const eliteItemsArr = ELITE_CHAIN.map((c, chainIdx) => {
      const active = curStep >= chainIdx;
      const lvOk = lv >= c.lvReq;
      const canClick = lvOk;
      const tgtLocked = !isCur && active && curChainStep >= chainIdx;
      const clickFn = tgtLocked
        ? 'showCurLockedMsg()'
        : 'toggleEliteChain(\'' + op.id + '\','  + chainIdx + ',\'' + mode + '\')';

      if (c.type === 'elite') {
        const locked = !active && !canClick;
        return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:1px;min-height:44px;opacity:${locked?0.35:1};">
          <div onclick="${canClick||active?clickFn:'void(0)'}"
            style="width:30px;height:30px;border-radius:50%;
              border:2px solid ${active?(tgtLocked?'rgba(255,100,100,0.6)':color):locked?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.25)'};
              background:${active?color+'22':'transparent'};
              cursor:${canClick||active?'pointer':'default'};
              display:flex;align-items:center;justify-content:center;transition:all 0.15s;">
            <span style="font-size:9px;font-weight:700;color:${active?color:locked?'rgba(255,255,255,0.15)':'var(--text-muted)'};">${tgtLocked?'🔒':'E'+c.elite}</span>
          </div>
          <span style="font-size:7px;color:${!active&&canClick?'var(--text-muted)':'transparent'};">Lv${c.lvReq}</span>
        </div>`;
      } else {
        const eqColor = CHAIN_EQUIP_COLORS[Math.floor((chainIdx-1)/2)];
        const locked = !active && !canClick;
        return `<div style="display:flex;align-items:center;gap:2px;opacity:${locked?0.35:1};margin-bottom:13px;">
          <div style="width:8px;height:2px;background:rgba(255,255,255,0.12);"></div>
          <div onclick="${canClick||active?clickFn:'void(0)'}"
            style="width:20px;height:20px;border-radius:3px;
              border:1.5px solid ${active?(tgtLocked?'rgba(255,100,100,0.6)':eqColor):locked?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.25)'};
              background:${active?eqColor+'22':'transparent'};
              cursor:${canClick||active?'pointer':'default'};
              display:flex;align-items:center;justify-content:center;transition:all 0.15s;">
            <span style="font-size:9px;color:${active?(tgtLocked?'rgba(255,100,100,0.8)':eqColor):'rgba(255,255,255,0.3)'};">${tgtLocked?'🔒':'◆'}</span>
          </div>
          <div style="width:8px;height:2px;background:rgba(255,255,255,0.12);"></div>
        </div>`;
      }
    });
    const eliteLine = `<div style="display:flex;align-items:center;flex-wrap:wrap;gap:1px;">${eliteItemsArr.join('')}</div>`;

    // ── 재능 ──
    const talentGroups = [
      { label:'재능 1', nodes:[{idx:4,req:1,label:'1단계'},{idx:5,req:2,label:'2단계'}] },
      { label:'재능 2', nodes:[{idx:6,req:2,label:'1단계'},{idx:7,req:3,label:'2단계'}] },
    ];
    const talentHtml = talentGroups.map(({label, nodes}) => {
      const nodeHtml = nodes.map(({idx,req,label:lbl}, i) => {
        const cur = tn[idx] || {enabled:false};
        const avail = elite >= req; // 한번에 상위 선택 가능
        const active = cur.enabled && avail;
        const curLocked = !isCur && curTn[idx]?.enabled && active;
        return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;opacity:${avail?1:0.3};">
          <div onclick="${avail&&!curLocked?tog(idx,cur.enabled):(avail&&curLocked?'showCurLockedMsg()':'void(0)')}"
            style="width:26px;height:26px;border-radius:50%;
              border:2px solid ${active?(curLocked?'rgba(255,100,100,0.6)':color):'rgba(255,255,255,0.2)'};
              background:${active?color+'22':'transparent'};
              cursor:${avail?'pointer':'default'};
              display:flex;align-items:center;justify-content:center;transition:all 0.15s;">
            <span style="font-size:8px;color:${active?color:'var(--text-muted)'};">${curLocked?'🔒':(i+1)}</span>
          </div>
          <span style="font-size:8px;color:var(--text-muted);">${lbl}</span>
        </div>`;
      }).join('<div style="width:6px;height:2px;background:rgba(255,255,255,0.1);margin-top:12px;"></div>');
      return `<div>
        <div style="font-size:9px;color:var(--text-muted);margin-bottom:3px;">${label}</div>
        <div style="display:flex;align-items:flex-start;gap:2px;">${nodeHtml}</div>
      </div>`;
    }).join('');

    // ── 인프라 스킬 ──
    // E1→알파1, E2→베타1, E3→알파2, E4→베타2
    const infraGroups = [
      { label:'인프라 α', nodes:[{idx:8,req:1,label:'1단계'},{idx:9,req:3,label:'2단계'}] },
      { label:'인프라 β', nodes:[{idx:10,req:2,label:'1단계'},{idx:11,req:4,label:'2단계'}] },
    ];
    const infraHtml = infraGroups.map(({label, nodes}) => {
      const nodeHtml = nodes.map(({idx,req,label:lbl}, i) => {
        const cur = tn[idx] || {enabled:false};
        const avail = elite >= req; // 한번에 상위 선택 가능
        const active = cur.enabled && avail;
        const curLocked = !isCur && curTn[idx]?.enabled && active;
        return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;opacity:${avail?1:0.3};">
          <div onclick="${avail&&!curLocked?tog(idx,cur.enabled):(avail&&curLocked?'showCurLockedMsg()':'void(0)')}"
            style="width:26px;height:26px;border-radius:4px;
              border:2px solid ${active?(curLocked?'rgba(255,100,100,0.6)':color):'rgba(255,255,255,0.2)'};
              background:${active?color+'22':'transparent'};
              cursor:${avail?'pointer':'default'};
              display:flex;align-items:center;justify-content:center;transition:all 0.15s;">
            <span style="font-size:8px;color:${active?color:'var(--text-muted)'};">${curLocked?'🔒':(i+1)}</span>
          </div>
          <span style="font-size:8px;color:var(--text-muted);">${lbl}</span>
        </div>`;
      }).join('<div style="width:6px;height:2px;background:rgba(255,255,255,0.1);margin-top:12px;"></div>');
      return `<div>
        <div style="font-size:9px;color:var(--text-muted);margin-bottom:3px;">${label}</div>
        <div style="display:flex;align-items:flex-start;gap:2px;">${nodeHtml}</div>
      </div>`;
    }).join('');

    return `<div style="flex:1;min-width:0;background:var(--panel3);
      border:1px solid rgba(255,255,255,0.08);border-top:2px solid ${color};
      border-radius:6px;padding:10px 12px;">
      <div style="font-size:11px;font-weight:700;color:${color};margin-bottom:10px;">${label}</div>

      <div style="margin-bottom:8px;">
        <div style="font-size:9px;color:var(--text-muted);margin-bottom:4px;">레벨</div>
        ${levelHtml}
      </div>
      <div style="height:1px;background:rgba(255,255,255,0.07);margin:6px 0;"></div>

      <div style="margin-bottom:6px;">
        <div style="font-size:9px;color:var(--text-muted);margin-bottom:4px;">스킬 강화</div>
        ${skillHtml}
      </div>
      <div style="height:1px;background:rgba(255,255,255,0.07);margin:6px 0;"></div>

      <div style="margin-bottom:6px;">
        <div style="font-size:9px;color:var(--text-muted);margin-bottom:4px;">능력치 강화</div>
        <div style="display:flex;gap:6px;">${statNodes}</div>
      </div>
      <div style="height:1px;background:rgba(255,255,255,0.07);margin:6px 0;"></div>

      <div style="margin-bottom:6px;">
        <div style="font-size:9px;color:var(--text-muted);margin-bottom:4px;">재능</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">${talentHtml}</div>
      </div>
      <div style="height:1px;background:rgba(255,255,255,0.07);margin:6px 0;"></div>

      <div style="margin-bottom:6px;">
        <div style="font-size:9px;color:var(--text-muted);margin-bottom:4px;">인프라 스킬</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">${infraHtml}</div>
      </div>
      <div style="height:1px;background:rgba(255,255,255,0.07);margin:6px 0;"></div>

      <div>
        <div style="font-size:9px;color:var(--text-muted);margin-bottom:4px;">정예화</div>
        ${eliteLine}
        <div style="font-size:9px;color:var(--text-muted);margin-top:4px;">
          <span style="font-size:9px;color:var(--text-muted);">E${elite} / 다음: Lv${[0,20,40,60,80][elite+1]||'MAX'} 필요</span>
        </div>
      </div>
    </div>`;
  }
  // ── 무기 특성 섹션 ──
  const weaponName = op.weapon || '';
  const weaponData = (window.WEAPONS || []).find(w => w.name === weaponName);
  const weaponHtml = weaponName ? (() => {
    if (!weaponData) return `
      <div style="color:var(--text-muted);font-size:11px;padding:8px 0;">
        ${weaponName} — 특성 데이터 없음
      </div>`;
    const renderTrait = (t, color, label) => {
      if (!t) return '';
      return `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:8px 10px;border:1px solid ${color}33;margin-bottom:6px;">
        <div style="font-size:9px;color:${color};font-weight:700;margin-bottom:3px;">${label}</div>
        <div style="font-size:11px;color:var(--text);font-weight:600;">${t.label || ''}</div>
        ${t.initVal ? `<div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${t.initVal}</div>` : ''}
      </div>`;
    };
    const t3 = weaponData.trait3;
    const t3Html = t3 ? `<div style="background:rgba(0,0,0,0.2);border-radius:6px;padding:8px 10px;border:1px solid #ffd74033;margin-bottom:6px;">
      <div style="font-size:9px;color:#ffd740;font-weight:700;margin-bottom:3px;">고유 능력 · ${t3.keyword || ''}</div>
      <div style="font-size:11px;color:var(--text);font-weight:600;">${t3.fullLabel || ''}</div>
      ${t3.initVal ? `<div style="font-size:10px;color:var(--text-muted);margin-top:2px;line-height:1.4;">${t3.initVal.slice(0,80)}${t3.initVal.length>80?'…':''}</div>` : ''}
    </div>` : '';
    return `
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
        <span style="font-size:11px;font-weight:700;color:var(--text);">⚔ ${weaponName}</span>
        <span style="font-size:10px;color:var(--text-muted);">${weaponData.type || ''}</span>
      </div>
      ${renderTrait(weaponData.trait1, '#4fc3f7', '주 속성')}
      ${renderTrait(weaponData.trait2, '#b39ddb', '추가 속성')}
      ${t3Html}`;
  })() : `<div style="color:var(--text-muted);font-size:11px;padding:4px 0;">무기 정보 없음</div>`;

  panel.innerHTML = `<div class="panel" style="padding:0;overflow:hidden;">
    <div style="padding:10px 14px;border-bottom:1px solid var(--border);background:rgba(240,200,22,0.06);display:flex;align-items:center;gap:10px;">
      <input value="${op.name}" style="background:transparent;border:none;border-bottom:1px solid var(--border);color:var(--text);font-size:14px;font-weight:700;outline:none;flex:1;"
        oninput="updateOpName('${op.id}',this.value)">
    </div>
    <div style="padding:10px;display:flex;gap:8px;align-items:flex-start;" class="op-dual-panel">
      ${nodePanel('cur')}
      ${nodePanel('tgt')}
    </div>
    <div style="padding:12px 14px;border-top:1px solid var(--border);">
      <div style="font-size:10px;font-weight:700;color:#4fc3f7;letter-spacing:0.08em;margin-bottom:8px;">⚔ 무기 특성</div>
      ${weaponHtml}
    </div>
    <div style="padding:12px 14px;border-top:1px solid var(--border);">
      <div style="font-size:10px;font-weight:700;color:var(--accent);letter-spacing:0.08em;margin-bottom:8px;">📦 필요 재료</div>
      ${matHtml}
    </div>
  </div>`;
}

function renderOperatorTotal() {
  const isMobile = window.innerWidth < 768;
  const mats = calcTotalMats();
  const hasMats = !!getActiveOp() && Object.keys(mats).length > 0;
  const sorted = Object.entries(mats).sort((a,b) => b[1]-a[1]);

  if (isMobile) {
    // 모바일: 상단 접이식 바
    const bar = document.getElementById('op-mobile-total-bar');
    const preview = document.getElementById('op-mobile-total-preview');
    const full = document.getElementById('op-mobile-total-full');
    if (!bar) return;
    bar.style.display = hasMats ? '' : 'none';
    if (!hasMats) return;
    // 미리보기: 상위 3개만 뱃지로
    preview.innerHTML = sorted.slice(0, 3).map(([name, qty]) =>
      `<span style="font-size:10px;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.06);color:var(--text);">
        ${name} <b style="color:var(--accent);">${qty.toLocaleString()}</b>
      </span>`
    ).join('') + (sorted.length > 3 ? `<span style="font-size:10px;color:var(--text-muted);">+${sorted.length-3}종</span>` : '');
    // 전체
    full.innerHTML = `<div style="display:flex;flex-direction:column;gap:3px;">
      ${sorted.map(([name, qty]) =>
        `<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.0.2);font-size:11px;">
          <span style="color:var(--text);">${itemIcon(name,14)}${name}</span>
          <span style="color:var(--accent);font-family:'Share Tech Mono',monospace;font-weight:700;">${qty.toLocaleString()}</span>
        </div>`).join('')}
    </div>`;
  } else {
    // PC: 기존 패널
    const totalPanel = document.getElementById('operator-total-panel');
    const body = document.getElementById('operator-total-body');
    if (!totalPanel || !body) return;
    totalPanel.style.display = hasMats ? '' : 'none';
    if (!hasMats) return;
    body.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:4px;">
      ${sorted.map(([name, qty]) =>
        `<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 8px;background:var(--bg-mid);border:1px solid rgba(255,255,255,0.08);border-radius:4px;font-size:11px;">
          <span style="color:var(--text);">${itemIcon(name, 14)}${name}</span>
          <span style="color:var(--accent);font-family:'Share Tech Mono',monospace;font-weight:700;">${qty.toLocaleString()}</span>
        </div>`).join('')}
    </div>`;
  }
}

let opTotalExpanded = false;
function toggleOpTotalBar() {
  opTotalExpanded = !opTotalExpanded;
  const full = document.getElementById('op-mobile-total-full');
  const chevron = document.getElementById('op-total-chevron');
  const preview = document.getElementById('op-mobile-total-preview');
  if (full)    full.style.display    = opTotalExpanded ? '' : 'none';
  if (preview) preview.style.display = opTotalExpanded ? 'none' : '';
  if (chevron) chevron.style.transform = opTotalExpanded ? 'rotate(180deg)' : '';
}

function updateOpName(id, val) {
  const op = opStates[id] || null;
  if (op) { op.name = val; renderOperatorList(); renderOperatorTotal(); saveData(); }
}

// 정예화 조건 체크 헬퍼
// ── 정예화+장비 체인 ──────────────────────────────────────
// 체인: [E1, 파랑, E2, 보라, E3, 노랑, E4]
// 각 단계의 레벨 조건 (해당 단계를 활성화하려면 필요한 레벨)
const ELITE_CHAIN = [
  { type:'elite', elite:1, lvReq:20,  tnIdx:null },
  { type:'equip', elite:1, lvReq:20,  tnIdx:12   }, // 파랑
  { type:'elite', elite:2, lvReq:40,  tnIdx:null },
  { type:'equip', elite:2, lvReq:40,  tnIdx:13   }, // 보라
  { type:'elite', elite:3, lvReq:60,  tnIdx:null },
  { type:'equip', elite:3, lvReq:60,  tnIdx:14   }, // 노랑
  { type:'elite', elite:4, lvReq:80,  tnIdx:null },
];

// 스킬 최대 랭크
function skillMaxRank(elite) {
  return [1,3,6,9,12][elite] || 1;
}

// 체인에서 현재 활성화 단계 수 가져오기
function getChainStep(op, mode) {
  const eliteField = mode === 'cur' ? 'currentElite' : 'targetElite';
  const tnKey = mode === 'cur' ? 'curTalentNodes' : 'tgtTalentNodes';
  const tn = op[tnKey] || [];
  const elite = op[eliteField] || 0;
  // 체인에서 마지막으로 활성화된 단계 인덱스 찾기
  let step = -1;
  for (let i = 0; i < ELITE_CHAIN.length; i++) {
    const c = ELITE_CHAIN[i];
    if (c.type === 'elite' && elite >= c.elite) step = i;
    else if (c.type === 'equip' && tn[c.tnIdx]?.enabled) step = i;
    else break; // 체인이 끊기면 중단
  }
  return step;
}

// 체인을 step까지 활성화 (이후는 모두 해제)
function applyChainStep(op, mode, step) {
  const eliteField = mode === 'cur' ? 'currentElite' : 'targetElite';
  const lvField    = mode === 'cur' ? 'currentLv'    : 'targetLv';
  const tnKey      = mode === 'cur' ? 'curTalentNodes' : 'tgtTalentNodes';
  if (!op[tnKey]) op[tnKey] = TALENT_NODE_COST.map((_,i) => ({idx:i,enabled:false}));

  let maxElite = 0;
  for (let i = 0; i <= step && i < ELITE_CHAIN.length; i++) {
    const c = ELITE_CHAIN[i];
    if (c.type === 'elite') maxElite = c.elite;
    else if (c.type === 'equip') op[tnKey][c.tnIdx].enabled = true;
  }
  // step 이후 모두 해제
  for (let i = step + 1; i < ELITE_CHAIN.length; i++) {
    const c = ELITE_CHAIN[i];
    if (c.type === 'equip') op[tnKey][c.tnIdx].enabled = false;
  }
  op[eliteField] = maxElite;

  // 스킬 최대 랭크 제한
  const maxRank = skillMaxRank(maxElite);
  if (op.skills) op.skills.forEach(sk => {
    if (sk[lvField] > maxRank) sk[lvField] = maxRank;
  });
}

// 레벨 변경 시 조건 미충족 체인 단계 자동 해제
function enforceChainByLevel(op, mode) {
  const lv     = mode === 'cur' ? op.currentLevel : op.targetLevel;
  const tnKey  = mode === 'cur' ? 'curTalentNodes' : 'tgtTalentNodes';
  const tn     = op[tnKey] || [];
  // 레벨 조건 미충족 첫 단계 찾기
  for (let i = 0; i < ELITE_CHAIN.length; i++) {
    const c = ELITE_CHAIN[i];
    if (lv < c.lvReq) {
      // 이 단계부터 모두 해제
      applyChainStep(op, mode, i - 1);
      return;
    }
  }
}

// 능력치/재능/인프라 그룹 순서 강제
function enforceDepGroups(op, mode) {
  const tnKey = mode === 'cur' ? 'curTalentNodes' : 'tgtTalentNodes';
  const tn = op[tnKey] || [];
  const elite = mode === 'cur' ? op.currentElite : op.targetElite;
  const depGroups = [
    { nodes:[{idx:0,req:1},{idx:1,req:2},{idx:2,req:3},{idx:3,req:4}] }, // 능력치
    { nodes:[{idx:4,req:1},{idx:5,req:2}] },                              // 재능1
    { nodes:[{idx:6,req:2},{idx:7,req:3}] },                              // 재능2
    { nodes:[{idx:8,req:1},{idx:9,req:3}] },                              // 인프라α
    { nodes:[{idx:10,req:2},{idx:11,req:4}] },                            // 인프라β
  ];
  depGroups.forEach(({nodes}) => {
    let broken = false;
    nodes.forEach(({idx,req}, i) => {
      if (broken || elite < req || (i > 0 && !tn[nodes[i-1].idx]?.enabled)) {
        tn[idx] = {idx, enabled:false};
        broken = true;
      }
    });
  });
}

function updateOpField(id, field, val) {
  const op = opStates[id] || null;
  if (!op) return;

  op[field] = val;
  op.currentLevel = Math.max(1, Math.min(90, op.currentLevel || 1));
  op.targetLevel  = Math.max(1, Math.min(90, op.targetLevel  || 1));

  // 레벨 역전 방지
  if (field === 'currentLevel' && op.currentLevel > op.targetLevel) {
    op.targetLevel = op.currentLevel; // 현재 올리면 목표도 올림
  }
  if (field === 'targetLevel' && op.targetLevel < op.currentLevel) {
    op.targetLevel = op.currentLevel; // 목표를 현재 이하로 못 낮춤
    showCurLockedMsg();
  }

  // 레벨 변경 시 체인 강제
  if (field === 'currentLevel') enforceChainByLevel(op, 'cur');
  if (field === 'targetLevel')  enforceChainByLevel(op, 'tgt');

  // 역전 방지 - 현재값이 고정, 목표가 변수
  if (field === 'currentLevel' && op.currentLevel > op.targetLevel)  op.targetLevel  = op.currentLevel; // 현재 올리면 목표 최솟값 올림
  if (field === 'currentElite' && op.currentElite > op.targetElite)  op.targetElite  = op.currentElite;
  if (field === 'targetElite'  && op.targetElite  < op.currentElite) op.targetElite  = op.currentElite; // 목표 낮추면 현재값까지만

  enforceDepGroups(op, 'cur');
  enforceDepGroups(op, 'tgt');

  renderOperatorList();
  renderOperatorConfig();
  renderOperatorTotal();
  saveData();
}

function updateSkillLv(id, idx, field, val) {
  const op = opStates[id] || null;
  if (!op || !op.skills[idx]) return;
  const elite = field === 'currentLv' ? op.currentElite : op.targetElite;
  op.skills[idx][field] = Math.max(1, Math.min(skillMaxRank(elite), val));
  if (field === 'currentLv' && op.skills[idx].currentLv > op.skills[idx].targetLv) {
    op.skills[idx].targetLv = op.skills[idx].currentLv; // 현재 올리면 목표도 올림
  }
  if (field === 'targetLv' && op.skills[idx].targetLv < op.skills[idx].currentLv) {
    op.skills[idx].targetLv = op.skills[idx].currentLv; // 목표를 현재 이하로 못 낮춤
    showCurLockedMsg();
  }
  renderOperatorList(); renderOperatorConfig(); renderOperatorTotal(); saveData();
}

// 체인 클릭 핸들러 - 이미 활성화된 단계 클릭 시 해제, 아니면 해당 단계까지 활성화
function toggleEliteChain(id, chainIdx, mode) {
  const op = opStates[id] || null;
  if (!op) return;
  const lv = mode === 'cur' ? op.currentLevel : op.targetLevel;

  // 레벨 조건 확인
  for (let i = 0; i <= chainIdx; i++) {
    if (lv < ELITE_CHAIN[i].lvReq) {
      showToast(`Lv${ELITE_CHAIN[i].lvReq} 이상이어야 해요`, 'error');
      return;
    }
  }

  const curStep = getChainStep(op, mode);

  // 목표 패널에서 현재보다 낮게 선택 시 불가
  if (mode === 'tgt') {
    const curChainStep = getChainStep(op, 'cur');
    const newStep = curStep >= chainIdx ? chainIdx - 1 : chainIdx;
    if (newStep < curChainStep) {
      showToast('현재 단계보다 낮게 설정할 수 없어요', 'error');
      return;
    }
  }

  if (curStep >= chainIdx) {
    // 해제
    if (mode === 'cur') {
      const newStep = chainIdx - 1;
      applyChainStep(op, 'cur', newStep);
      if (getChainStep(op, 'tgt') < newStep) {
        applyChainStep(op, 'tgt', newStep);
      }
    } else {
      applyChainStep(op, mode, chainIdx - 1);
    }
  } else {
    // 활성화
    applyChainStep(op, mode, chainIdx);
    // 현재 올릴 때 목표도 최솟값 맞춤
    if (mode === 'cur') {
      const tgtStep = getChainStep(op, 'tgt');
      if (tgtStep < chainIdx) {
        applyChainStep(op, 'tgt', chainIdx);
      }
    }
  }

  enforceDepGroups(op, mode);
  renderOperatorList(); renderOperatorConfig(); renderOperatorTotal(); saveData();
}

function toggleTalentNode(id, idx, checked, mode) {
  const op = opStates[id] || null;
  if (!op) return;
  const curKey = 'curTalentNodes';
  const tgtKey = 'tgtTalentNodes';
  if (!op[curKey]) op[curKey] = TALENT_NODE_COST.map((_,i) => ({idx:i,enabled:false}));
  if (!op[tgtKey]) op[tgtKey] = TALENT_NODE_COST.map((_,i) => ({idx:i,enabled:false}));
  const key = mode === 'cur' ? curKey : tgtKey;

  const depGroups = [
    [0,1,2,3],   // 능력치
    [4,5],        // 재능1
    [6,7],        // 재능2
    [8,9],        // 인프라α
    [10,11],      // 인프라β
  ];

  if (checked) {
    // 활성화 - 중간 단계도 채우기
    depGroups.forEach(group => {
      const pos = group.indexOf(idx);
      if (pos === -1) return;
      for (let i = 0; i <= pos; i++) {
        op[key][group[i]].enabled = true;
      }
    });
    // 현재에서 활성화 시 목표도 최솟값으로 맞춤
    if (mode === 'cur') {
      depGroups.forEach(group => {
        const pos = group.indexOf(idx);
        if (pos === -1) return;
        for (let i = 0; i <= pos; i++) {
          if (!op[tgtKey][group[i]].enabled) {
            op[tgtKey][group[i]].enabled = true;
          }
        }
      });
    }
  } else {
    // 비활성화
    if (mode === 'tgt') {
      // 목표에서 해제 시 현재보다 낮아지면 불가
      const curEnabled = op[curKey][idx]?.enabled;
      if (curEnabled) {
        showToast('현재 단계보다 낮게 설정할 수 없어요', 'error');
        return;
      }
    }
    // 해제 + 이후 연쇄 해제
    op[key][idx].enabled = false;
    depGroups.forEach(group => {
      const pos = group.indexOf(idx);
      if (pos === -1) return;
      for (let i = pos + 1; i < group.length; i++) {
        op[key][group[i]].enabled = false;
      }
    });
    // 현재에서 해제 시 목표도 같이 낮아져야 함
    if (mode === 'cur') {
      op[tgtKey][idx].enabled = false;
      depGroups.forEach(group => {
        const pos = group.indexOf(idx);
        if (pos === -1) return;
        for (let i = pos + 1; i < group.length; i++) {
          op[tgtKey][group[i]].enabled = false;
        }
      });
    }
  }

  enforceDepGroups(op, 'cur');
  enforceDepGroups(op, 'tgt');
  renderOperatorList(); renderOperatorConfig(); renderOperatorTotal(); saveData();
}
// ========== 커스텀 드롭박스 ==========
// createCustomSelect(containerId, options, selectedValue, onChange, placeholder)
// options: [{value, label}]
function createCustomSelect(containerId, options, selectedValue, onChange, placeholder = '— 선택 —', extraClass = '') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  container.className = 'custom-select-wrap block ' + extraClass;
  renderCustomSelect(container, options, selectedValue, onChange, placeholder);
}

function renderCustomSelect(container, options, selectedValue, onChange, placeholder) {
  const sel = options.find(o => o.value === selectedValue);
  const labelText = sel ? sel.label : placeholder;
  const isPlaceholder = !sel;

  container.innerHTML = `
    <button class="custom-select-btn${isOpen(container) ? ' open' : ''}" onclick="toggleCustomSelect(this)">
      <span class="cs-label" style="${isPlaceholder ? 'color:var(--text-muted);font-style:italic;' : ''}">${labelText}</span>
      <svg class="cs-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
    </button>`;

  // 데이터 저장
  container._csOptions    = options;
  container._csSelected   = selectedValue;
  container._csOnChange   = onChange;
  container._csPlaceholder = placeholder;
}

function isOpen(container) {
  return !!container.querySelector('.custom-select-dropdown');
}

function toggleCustomSelect(btn) {
  const container = btn.closest('.custom-select-wrap');
  if (!container) return;
  const existing = document.querySelector('.custom-select-dropdown');
  if (existing) {
    closeAllCustomSelects();
    return;
  }
  closeAllCustomSelects();
  btn.classList.add('open');

  const dropdown = document.createElement('div');
  dropdown.className = 'custom-select-dropdown';
  dropdown.dataset.ownerId = container.dataset.csId || '';

  const options    = container._csOptions || [];
  const selected   = container._csSelected;
  const placeholder = container._csPlaceholder || '— 선택 —';

  // 빈 옵션(placeholder)
  const ph = document.createElement('div');
  ph.className = 'cs-option placeholder' + (selected === '' || selected === null || selected === undefined ? ' selected' : '');
  ph.textContent = placeholder;
  ph.onclick = () => selectCustomOption(container, '', placeholder, true);
  dropdown.appendChild(ph);

  options.forEach(opt => {
    const item = document.createElement('div');
    item.className = 'cs-option' + (opt.value === selected ? ' selected' : '');
    item.innerHTML = opt.label;
    item.onclick = () => selectCustomOption(container, opt.value, opt.label, false);
    dropdown.appendChild(item);
  });

  // body에 fixed로 붙이기
  document.body.appendChild(dropdown);

  // 버튼 위치 기준으로 드롭다운 위치 계산
  const rect = btn.getBoundingClientRect();
  const dropH = Math.min(220, options.length * 34 + 34);
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  dropdown.style.position = 'fixed';
  dropdown.style.left = rect.left + 'px';
  dropdown.style.width = rect.width + 'px';
  dropdown.style.zIndex = '9999';

  if (spaceBelow >= dropH || spaceBelow >= spaceAbove) {
    // 아래로 펼치기
    const maxH = Math.min(220, spaceBelow - 8);
    dropdown.style.top = (rect.bottom + 2) + 'px';
    dropdown.style.maxHeight = maxH + 'px';
    dropdown.style.height = Math.min(dropH, maxH) + 'px';
  } else {
    // 위로 펼치기
    const maxH = Math.min(220, spaceAbove - 8);
    dropdown.style.bottom = (window.innerHeight - rect.top + 2) + 'px';
    dropdown.style.top = 'auto';
    dropdown.style.maxHeight = maxH + 'px';
    dropdown.style.height = Math.min(dropH, maxH) + 'px';
  }
  dropdown.style.overflowY = 'scroll';
  dropdown.style.overflowX = 'hidden';

  // 선택된 항목으로 스크롤
  setTimeout(() => {
    const selEl = dropdown.querySelector('.selected');
    if (selEl) selEl.scrollIntoView({ block: 'nearest' });
  }, 10);

  // 외부 클릭 닫기
  setTimeout(() => {
    document.addEventListener('click', closeOnOutside, { once: true });
  }, 0);
}

function selectCustomOption(container, value, label, isPlaceholder) {
  container._csSelected = value;
  const btn = container.querySelector('.custom-select-btn');
  if (btn) {
    const labelEl = btn.querySelector('.cs-label');
    if (labelEl) {
      labelEl.innerHTML = isPlaceholder ? container._csPlaceholder : label;
      labelEl.style.color = isPlaceholder ? 'var(--text-muted)' : '';
      labelEl.style.fontStyle = isPlaceholder ? 'italic' : '';
    }
  }
  closeAllCustomSelects();
  if (container._csOnChange) container._csOnChange(value);
}

function closeOnOutside(e) {
  if (!e.target.closest('.custom-select-wrap') && !e.target.closest('.custom-select-dropdown')) closeAllCustomSelects();
  else document.addEventListener('click', closeOnOutside, { once: true });
}

// 스크롤 시 드롭다운 닫기 (드롭다운 내부 스크롤은 제외)
window.addEventListener('scroll', function(e) {
  if (e.target.closest && e.target.closest('.custom-select-dropdown')) return;
  closeAllCustomSelects();
}, true);

function closeAllCustomSelects() {
  document.querySelectorAll('.custom-select-dropdown').forEach(d => d.remove());
  document.querySelectorAll('.custom-select-btn.open').forEach(b => b.classList.remove('open'));
}

// ========== 관리권 교환 계산 → 공장 설비 자동 계산 ==========
async function autoCalcFactory(oId) {
  gtag('event', 'auto_calc_target');
  const tr = outpostData[oId]?.targetRates || {};

  // 목표가 설정된 품목만 필터
  const targets = Object.entries(tr).filter(([name, rate]) => rate > 0);
  if (targets.length === 0) {
    await dialogAlert('목표 생산량을 먼저 입력해주세요.');
    return;
  }

  // 확인 모달
  const itemList = targets.map(([name, rate]) =>
    `<div style="display:flex;justify-content:space-between;font-size:11px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.0.2);">
      <span style="color:var(--text);">${name}</span>
      <span style="color:var(--accent);font-family:'Share Tech Mono',monospace;">${rate}/분</span>
    </div>`
  ).join('');

  const ok = await showDialog({
    title: '⚙ 공장 설비 자동 계산',
    message: `아래 생산품에 맞는 설비 그룹을 자동으로 생성해요.<br>
      <div style="margin:10px 0;">${itemList}</div>
      <span style="font-size:10px;color:var(--warning);">※ 기존 공장 그룹은 그대로 유지됩니다. 같은 이름의 그룹이 있어도 새로 추가돼요.</span>`,
    buttons: [
      { label: '취소', value: false },
      { label: '생성', value: true, primary: true },
    ]
  });
  if (!ok) return;

  // 거점 전환 (공장 탭에서도 같은 거점 기준으로 생성)
  const targetOutpostId = oId;

  let addedGroups = 0;

  targets.forEach(([productName, targetRate]) => {
    // 이 생산품을 만드는 레시피 찾기
    const recipe = RECIPES.find(r => r.outputs.some(o => o.name === productName));
    if (!recipe) return;

    // 목표 분당 생산량 달성에 필요한 설비 개수 계산
    // targetRate = (60 / recipe.speed) * outputQty * count
    const outputQty = recipe.outputs.find(o => o.name === productName)?.qty || 1;
    const producePerUnit = (60 / recipe.speed) * outputQty;
    const rawCount = targetRate / producePerUnit;
    const rootCount = Math.round(rawCount * 100) / 100;

    // 정수 배수로 떨어지면 설비 1개 + 그룹 배율로 처리
    const isWholeNumber = Math.abs(rawCount - Math.round(rawCount)) < 0.001;
    const groupMult = isWholeNumber ? Math.round(rawCount) : 1;
    const actualRootCount = isWholeNumber ? 1 : rootCount;

    // 하위 설비 맵 계산 (actualRootCount 기준)
    const subMap = buildSubEquipMap(recipe.id, actualRootCount, new Set([recipe.id]));

    const groupName = `${productName} 제작 설비`;
    const groupId = outpostData[targetOutpostId].nextGroupId++;
    const equips = [{ recipeId: recipe.id, count: actualRootCount }];

    Object.entries(subMap).forEach(([rid, cnt]) => {
      const id = parseInt(rid);
      const existing = equips.find(e => e.recipeId === id);
      if (existing) { existing.count += cnt; }
      else { equips.push({ recipeId: id, count: cnt }); }
    });

    outpostData[targetOutpostId].groups.push({
      id: groupId,
      name: groupName,
      mult: groupMult,  // 정수 배수면 배율 적용
      equips,
    });
    addedGroups++;
  });

  // 공장 탭 거점을 같은 거점으로 맞추고 렌더링
  activeOutpostId = targetOutpostId;
  renderFactoryOutpostTabs();
  renderResourceInputs();
  renderWorkspace();
  renderResults();
  updateFactoryAuthBar();
  scheduleSave();

  showToast(`⚙ ${addedGroups}개 그룹이 공장 탭에 생성됐어요!`);

  // 공장 탭으로 이동
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-factory').classList.add('active');
  document.querySelector('.tab[onclick*="factory"]')?.classList.add('active');
}
const SANITY_PER_MIN = 1 / 7.2;
const SANITY_PER_DAY = 240; // 자연회복 200 + 일일 퀘스트 이성회복제 40

function sanityToTime(sanity) {
  const mins = sanity / SANITY_PER_MIN;
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  const m = Math.floor(mins % 60);
  const parts = [];
  if (days  > 0) parts.push(`${days}일`);
  if (hours > 0) parts.push(`${hours}시간`);
  if (m     > 0) parts.push(`${m}분`);
  return parts.join(' ') || '즉시';
}

// ========== 오퍼레이터 탭 내부 탭 전환 ==========
let currentOpTab = 'config';
function switchOpTab(tab) {
  currentOpTab = tab;
  document.getElementById('op-panel-config').style.display  = tab === 'config'  ? '' : 'none';
  document.getElementById('op-panel-farming').style.display = tab === 'farming' ? '' : 'none';
  document.getElementById('op-tab-config').classList.toggle('active',  tab === 'config');
  document.getElementById('op-tab-farming').classList.toggle('active', tab === 'farming');
  if (tab === 'farming') renderFarmingGuide();
}

// ========== 파밍 가이드 렌더링 ==========
function renderFarmingGuide() {
  const el = document.getElementById('farming-guide-body');
  if (!el) return;

  const totalMats = calcTotalMats();
  if (Object.keys(totalMats).length === 0) {
    el.innerHTML = `<div class="empty-state" style="padding:48px;"><div class="icon">🌾</div>오퍼레이터를 추가하고<br>목표를 설정하면<br>파밍 가이드가 표시됩니다</div>`;
    return;
  }

  let totalSanity = 0;
  const matEntries = Object.entries(totalMats).sort((a,b) => b[1] - a[1]);

  const cards = matEntries.map(([name, qty]) => {
    const fd = FARMING_DATA[name];
    const icon = fd?.icon || '📦';

    let bestSanity = null, bestSource = null;
    if (fd?.sources) {
      const farmable = fd.sources.filter(s => s.sanityPerRun > 0 && s.itemPerRun > 0);
      if (farmable.length > 0) {
        const best = farmable.reduce((a,b) => (a.itemPerRun/a.sanityPerRun) >= (b.itemPerRun/b.sanityPerRun) ? a : b);
        const runs = Math.ceil(qty / best.itemPerRun);
        bestSanity = runs * best.sanityPerRun;
        bestSource = best;
        totalSanity += bestSanity;
      }
    }

    const sanityLine = bestSanity !== null
      ? `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:4px;">
          <span style="font-size:10px;color:var(--warning);">⚡ ${bestSanity.toLocaleString()} 이성</span>
          <span style="font-size:10px;color:var(--text-muted);">🕐 ${sanityToTime(bestSanity)}</span>
          <span style="font-size:10px;color:var(--text-muted);">📅 ${(bestSanity/SANITY_PER_DAY).toFixed(1)}일치</span>
        </div>`
      : `<div style="font-size:10px;color:var(--success);margin-top:4px;">⚡ 이성 불필요 (탐색·제조)</div>`;

    const sourcesHtml = fd?.sources.map(s =>
      `<div style="font-size:10px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <span style="color:var(--text);">📍 ${s.name}</span>
        <span style="color:var(--text-muted);flex-shrink:0;">${s.detail}</span>
        ${s.sanityPerRun > 0 ? `<span style="color:var(--warning);flex-shrink:0;font-family:'Share Tech Mono',monospace;">${s.sanityPerRun}이성/${s.itemPerRun}개</span>` : ''}
      </div>`
    ).join('') || `<div style="font-size:10px;color:var(--text-muted);">파밍 데이터 미확인</div>`;

    return `<div style="border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:12px 14px;background:var(--bg-mid);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:16px;">${icon}</span>
          <span style="font-size:13px;font-weight:600;color:var(--text);">${name}</span>
        </div>
        <span style="font-size:14px;font-weight:700;color:var(--accent);font-family:'Share Tech Mono',monospace;">${qty.toLocaleString()}개</span>
      </div>
      ${sanityLine}
      <div style="margin-top:8px;border-top:1px solid rgba(255,255,255,0.08);padding-top:6px;">${sourcesHtml}</div>
      ${fd?.notes ? `<div style="font-size:10px;color:var(--text-muted);margin-top:6px;font-style:italic;">💡 ${fd.notes}</div>` : ''}
    </div>`;
  }).join('');

  const totalDays = totalSanity / SANITY_PER_DAY;
  const summary = `<div style="border:1px solid rgba(240,200,22,0.35);border-radius:4px;padding:14px 16px;background:rgba(240,200,22,0.05);margin-bottom:12px;">
    <div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:10px;">⚡ 파밍 총 요약</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;">
      <div>
        <div style="font-size:10px;color:var(--text-muted);">총 필요 이성</div>
        <div style="font-size:20px;font-weight:700;color:var(--warning);font-family:'Share Tech Mono',monospace;">${totalSanity.toLocaleString()}</div>
        <div style="font-size:10px;color:var(--text-muted);">이성</div>
      </div>
      <div>
        <div style="font-size:10px;color:var(--text-muted);">자연 회복 기준</div>
        <div style="font-size:20px;font-weight:700;color:var(--accent);font-family:'Share Tech Mono',monospace;">${totalDays.toFixed(1)}</div>
        <div style="font-size:10px;color:var(--text-muted);">일 (자연회복+일퀘)</div>
      </div>
      <div>
        <div style="font-size:10px;color:var(--text-muted);">이성 회복 속도</div>
        <div style="font-size:18px;font-weight:700;color:var(--success);font-family:'Share Tech Mono',monospace;">7분 12초</div>
        <div style="font-size:10px;color:var(--text-muted);">/ 1이성</div>
      </div>
    </div>
    <div style="margin-top:10px;font-size:10px;color:var(--text-muted);border-top:1px solid rgba(255,255,255,0.08);padding-top:8px;">
      ※ 이성 수치는 가장 효율 좋은 고위 에너지 응집점 기준 추정값입니다 (하루 240이성 = 자연회복 200 + 일일퀘스트 이성회복제 40). 볼레테·희귀 재료는 이성 외 탐색 시간도 필요합니다.
    </div>
  </div>`;

  el.innerHTML = summary + `<div style="display:flex;flex-direction:column;gap:8px;">${cards}</div>`;
}

// ========== 기질(Essence) 파밍 데이터 ==========
// 고위 에너지 응집점 — 스킬 속성만 장소마다 고정, 주 속성·추가 속성은 전체 공통
// trait1(주 속성)은 모든 고위 에너지 응집점 공통: 민첩 증가, 힘 증가, 의지 증가, 지능 증가, 주요 능력치 증가
const ALLUVIUM_TRAIT1 = ['민첩 증가','힘 증가','의지 증가','지능 증가','주요 능력치 증가'];

const ALLUVIUMS = [
  { id:'base_zone',      region:'4번 협곡', name:'거점 지역',
    trait2:['공격력 증가','열기 피해 증가','전기 피해 증가','냉기 피해 증가','자연 피해 증가','오리지늄 아츠 강도 증가','궁극기 충전 효율 증가','아츠 피해 증가'],
    skills:['강공','억제','추격','분쇄','기예','방출','흐름','효율'] },
  { id:'research_zone',  region:'4번 협곡', name:'오리지늄 연구 구역',
    trait2:['공격력 증가','물리 피해 증가','전기 피해 증가','냉기 피해 증가','자연 피해 증가','치명타 확률 증가','궁극기 충전 효율 증가','아츠 피해 증가'],
    skills:['억제','추격','사기','기예','고통','의료','골절','효율'] },
  { id:'vein_zone',      region:'4번 협곡', name:'광맥 구역',
    trait2:['생명력 증가','물리 피해 증가','열기 피해 증가','냉기 피해 증가','자연 피해 증가','치명타 확률 증가','오리지늄 아츠 강도 증가','치유 효율 증가'],
    skills:['강공','억제','기예','잔혹','고통','방출','어둠','효율'] },
  { id:'energy_plateau', region:'4번 협곡', name:'에너지 공급 고지',
    trait2:['공격력 증가','생명력 증가','물리 피해 증가','열기 피해 증가','자연 피해 증가','치명타 확률 증가','오리지늄 아츠 강도 증가','치유 효율 증가'],
    skills:['추격','분쇄','사기','잔혹','고통','의료','골절','흐름'] },
  { id:'wuling_city',    region:'무릉',     name:'무릉성',
    trait2:['공격력 증가','생명력 증가','전기 피해 증가','냉기 피해 증가','치명타 확률 증가','궁극기 충전 효율 증가','아츠 피해 증가','치유 효율 증가'],
    skills:['강공','분쇄','잔혹','의료','골절','방출','어둠','흐름'] },
  { id:'cheongpachae',   region:'무릉',     name:'청파채',
    trait2:['생명력 증가','물리 피해 증가','전기 피해 증가','냉기 피해 증가','오리지늄 아츠 강도 증가','궁극기 충전 효율 증가','아츠 피해 증가','치유 효율 증가'],
    skills:['억제','분쇄','사기','기예','의료','골절','방출','어둠'] },
  { id:'sudon',          region:'무릉',     name:'수돈',
    trait2:['공격력 증가','물리 피해 증가','열기 피해 증가','전기 피해 증가','자연 피해 증가','치명타 확률 증가','궁극기 충전 효율 증가','아츠 피해 증가'],
    skills:['강공','추격','사기','잔혹','고통','어둠','흐름','효율'] },
  { id:'lab_zone',       region:'무릉',     name:'실험 구역',
    trait2:['생명력 증가','열기 피해 증가','전기 피해 증가','냉기 피해 증가','자연 피해 증가','오리지늄 아츠 강도 증가','궁극기 충전 효율 증가','치유 효율 증가'],
    skills:['억제','분쇄','기예','잔혹','고통','골절','어둠','흐름'] },
];

// 무기 데이터 — primary/secondary/skill 은 각 배열의 값 사용
// 데이터 미확인 항목은 null 처리 (사용자가 엑셀로 채워 넣어야 함)
const WEAPON_DATA = [
  { name:'해라펜거',               rarity:6, type:'대검',    operator:'라스트 라이트',  primary:'힘 강화',   secondary:'냉기 피해 강화', skill:'기폭' },
  { name:'용조의 불꽃',            rarity:6, type:'검',      operator:'레바테인',       primary:'민첩 강화', secondary:'열 피해 강화',   skill:'기폭' },
  { name:'바다와 별의 꿈',         rarity:6, type:'검',      operator:'아델리아',       primary:null, secondary:null, skill:null },
  { name:'천둥의 흔적',            rarity:6, type:'대검',    operator:'엠버',           primary:null, secondary:null, skill:null },
  { name:'사명의 길',              rarity:6, type:'창',      operator:'질베르타',       primary:null, secondary:null, skill:null },
  { name:'장대한 염원',            rarity:6, type:'핸드캐논',operator:'관리자',         primary:null, secondary:null, skill:null },
  { name:'예술의 폭군',            rarity:6, type:'아츠',    operator:'이본',           primary:null, secondary:null, skill:null },
  { name:'망각',                   rarity:6, type:'아츠',    operator:'펠리카',         primary:null, secondary:null, skill:null },
  { name:'산의 지배자',            rarity:6, type:'검',      operator:'여풍',           primary:null, secondary:null, skill:null },
  { name:'끝없는 방랑',            rarity:6, type:'대검',    operator:'포그라니치니크', primary:null, secondary:null, skill:null },
  { name:'늑대의 혈흔',            rarity:6, type:'창',      operator:'로시',           primary:null, secondary:null, skill:null },
  { name:'반항',                   rarity:6, type:'검',      operator:'탕탕',           primary:null, secondary:null, skill:null },
  { name:'고독한 나룻배',          rarity:6, type:'핸드캐논',operator:'장방이',         primary:null, secondary:null, skill:null },
  { name:'린수를 찾아서 3.0',      rarity:5, type:'뱅가드',  operator:'알레쉬',         primary:null, secondary:null, skill:null },
  { name:'십이문',                 rarity:5, type:'핸드캐논',operator:'아크라이트',     primary:null, secondary:null, skill:null },
  { name:'중심력',                 rarity:5, type:'아츠',    operator:'아비웨나',       primary:null, secondary:null, skill:null },
  { name:'숭배의 시선',            rarity:5, type:'대검',    operator:'진천우',         primary:null, secondary:null, skill:null },
  { name:'고대의 강줄기',          rarity:5, type:'검',      operator:'판',             primary:null, secondary:null, skill:null },
  { name:'최후의 메아리',          rarity:5, type:'아츠',    operator:'스노우샤인',     primary:null, secondary:null, skill:null },
  { name:'이성적인 작별',          rarity:5, type:'창',      operator:'울프가드',       primary:null, secondary:null, skill:null },
  { name:'선교의 자유',            rarity:5, type:'핸드캐논',operator:'자이히',         primary:null, secondary:null, skill:null },
  { name:'O.B.J. 엣지 오브 라이트',rarity:4, type:'검',      operator:'아케쿠리',       primary:null, secondary:null, skill:null },
  { name:'O.B.J. 아츠 아이덴티티', rarity:4, type:'대검',    operator:'안탈',           primary:null, secondary:null, skill:null },
  { name:'O.B.J. 헤비 버든',       rarity:4, type:'창',      operator:'카치르',         primary:null, secondary:null, skill:null },
  { name:'O.B.J. 스파이크',        rarity:4, type:'핸드캐논',operator:'에스텔라',       primary:null, secondary:null, skill:null },
  { name:'O.B.J. 벨로시투스',      rarity:4, type:'아츠',    operator:'플루라이트',     primary:null, secondary:null, skill:null },
];

// 고위 에너지 응집점에서 특정 스킬 속성을 드롭하는 장소 찾기
function getAlluviumsBySkill(skill) {
  return ALLUVIUMS.filter(a => a.skills.includes(skill));
}

// 무기와 매칭되는 고위 에너지 응집점 찾기
function getBestAlluviumsForWeapon(weapon) {
  if (!weapon.skill) return [];
  return getAlluviumsBySkill(weapon.skill);
}

// ========== 기질 탭 전환 ==========
let currentEssenceTab = 'check';
function switchEssenceTab(tab) {
  currentEssenceTab = tab;
  ['check','weapon'].forEach(t => {
    document.getElementById(`epanel-${t}`).style.display = t === tab ? '' : 'none';
    document.getElementById(`etab-${t}`).classList.toggle('active', t === tab);
  });
}

// ========== 기질 파밍 탭 초기화 ==========
function initEssenceTab() {
  const weapons = window.WEAPONS || [];

  const stripSize = s => s ? s.replace(/\xa0/g,' ').trim().replace(/\s*·\s*(대|중|소)$/, '') : '';

  const trait1Set = new Set();
  const trait2Set = new Set();
  const trait3Set = new Set();
  weapons.forEach(w => {
    if (w.trait1?.label) trait1Set.add(stripSize(w.trait1.label));
    if (w.trait2?.label) trait2Set.add(stripSize(w.trait2.label));
    if (w.trait3?.keyword) trait3Set.add(stripSize(w.trait3.keyword));
  });

  const t1 = [...trait1Set].sort();
  const t2 = [...trait2Set].sort();
  const t3 = [...trait3Set].sort();

  createCustomSelect('cs-ec-primary',
    t1.map(p => ({ value: p, label: p })),
    '', () => renderEssenceCheck(), '— 주 속성 선택 —');
  createCustomSelect('cs-ec-secondary',
    t2.map(s => ({ value: s, label: s })),
    '', () => renderEssenceCheck(), '— 추가 속성 선택 —');
  createCustomSelect('cs-ec-skill',
    t3.map(s => ({ value: s, label: s })),
    '', () => renderEssenceCheck(), '— 스킬 속성 선택 —');
  const sortedWeapons = [...(window.WEAPONS || [])].sort((a, b) => {
    if ((b.rarity||0) !== (a.rarity||0)) return (b.rarity||0) - (a.rarity||0); // 등급 내림차순
    const typeCmp = (a.type||'').localeCompare(b.type||'', 'ko');
    if (typeCmp !== 0) return typeCmp; // 유형 가나다순
    return (a.name||'').localeCompare(b.name||'', 'ko'); // 이름 가나다순
  });
  createCustomSelect('cs-ew-select',
    sortedWeapons.map((w) => ({
      value: String((window.WEAPONS || []).indexOf(w)),
      label: `<span style="color:${rarityColor(w.rarity)};font-weight:700;">★${w.rarity||'?'}</span> ${w.name} (${w.type || ''})`
    })),
    '', () => renderWeaponFarming(), '— 무기 선택 —');
}


// ========== ① 기질 체커 ==========
function renderEssenceCheck() {
  const pri = document.getElementById('cs-ec-primary')?._csSelected || '';
  const sec = document.getElementById('cs-ec-secondary')?._csSelected || '';
  const sk  = document.getElementById('cs-ec-skill')?._csSelected || '';
  const el  = document.getElementById('ec-result');
  if (!el) return;

  if (!pri && !sec && !sk) {
    el.innerHTML = `<div class="empty-state" style="padding:32px;"><div class="icon">💎</div>특성을 선택하면 매칭 무기가 표시됩니다</div>`;
    return;
  }

  const stripSize = s => s ? s.replace(/\xa0/g,' ').trim().replace(/\s*·\s*(대|중|소)$/, '') : '';
  const weapons = window.WEAPONS || [];
  const selectedCount = [pri,sec,sk].filter(Boolean).length;

  // 각 무기의 매칭 점수 계산
  const scored = weapons.map(w => {
    const t1 = stripSize(w.trait1?.label || '');
    const t2 = stripSize(w.trait2?.label || '');
    const t3 = stripSize(w.trait3?.keyword || '');
    const pMatch = pri && (t1 === pri || t2 === pri);
    const sMatch = sec && (t1 === sec || t2 === sec);
    const kMatch = sk  && t3 === sk;
    const score = (pMatch?1:0) + (sMatch?1:0) + (kMatch?1:0);
    return { w, score, pMatch, sMatch, kMatch };
  }).filter(x => x.score >= 2); // 2개 이상 매칭만

  if (scored.length === 0) {
    el.innerHTML = `<div class="empty-state" style="padding:24px;"><div class="icon">🔍</div>2개 이상 매칭되는 무기가 없어요<br><span style="font-size:11px;color:var(--text-label);">특성 조합을 바꿔보세요</span></div>`;
    return;
  }

  // 점수 내림차순 정렬
  scored.sort((a, b) => b.score - a.score);

  const perfect = scored.filter(x => x.score === selectedCount);
  const partial = scored.filter(x => x.score < selectedCount);

  el.innerHTML = `
    <div style="font-size:11px;color:var(--text-label);margin-bottom:10px;">
      ${selectedCount}개 특성 선택 →
      <b style="color:var(--accent);">${perfect.length}개</b> 완전 매칭,
      <b style="color:var(--text-sub);">${partial.length}개</b> 부분 매칭
    </div>
    ${perfect.length > 0 ? `
    <div style="font-size:10px;font-weight:700;color:var(--success);letter-spacing:0.06em;margin-bottom:6px;">
      ✓ 완전 매칭 (${perfect.length}개)
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
      ${perfect.map(x => wikiWeaponCard(x.w, pri, sec, sk)).join('')}
    </div>` : ''}
    ${partial.length > 0 ? `
    <div style="font-size:10px;font-weight:700;color:var(--text-muted);letter-spacing:0.06em;margin-bottom:6px;">
      ○ 부분 매칭 — 2개 일치 (${partial.length}개)
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      ${partial.map(x => wikiWeaponCard(x.w, pri, sec, sk)).join('')}
    </div>` : ''}`;
}

// ========== ② 무기별 고위 에너지 응집점 + 한번에 파밍 통합 ==========
function renderWeaponFarming() {
  const idx = document.getElementById('cs-ew-select')?._csSelected;
  const el  = document.getElementById('ew-result');
  if (!el || idx === '') return;

  // WEAPONS(공식 위키) 기반
  const wikiWeapon = (window.WEAPONS || [])[parseInt(idx)];
  if (!wikiWeapon) return;

  // WEAPON_DATA에서 기질/오퍼레이터/등급 정보 조회
  const wdMatch = WEAPON_DATA.find(d => d.name === wikiWeapon.name);

  // trait1/2/3 → primary/secondary/skill 매핑
  const stripSize = s => s ? s.replace(/\xa0/g,' ').trim().replace(/\s*·\s*(대|중|소)$/, '') : '';
  const w = {
    name: wikiWeapon.name,
    rarity: wdMatch?.rarity || null,
    type: wikiWeapon.type || wdMatch?.type || '',
    operator: wdMatch?.operator || null,
    primary:   wikiWeapon.trait1 ? stripSize(wikiWeapon.trait1.label) : (wdMatch?.primary || null),
    secondary: wikiWeapon.trait2 ? stripSize(wikiWeapon.trait2.label) : (wdMatch?.secondary || null),
    skill:     wikiWeapon.trait3 ? (wikiWeapon.trait3.keyword || stripSize(wikiWeapon.trait3.label)) : (wdMatch?.skill || null),
  };

  if (!w.primary && !w.secondary && !w.skill) {
    el.innerHTML = `<div class="empty-state" style="padding:24px;"><div class="icon">⚠</div>이 무기의 기질 데이터가 아직 미확인이에요<br><span style="font-size:11px;color:var(--text-label);">엑셀 DB에 입력 후 반영해주세요</span></div>`;
    return;
  }

  // 0. 무기 특성 상세 박스 제거 — 아래 주속성/보조속성/스킬 박스와 중복

  // 1. 무기 기질 3가지 표시
  const statsHtml = `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px;">
      <div style="background:rgba(0,0,0,0.2);border-radius:4px;padding:10px 12px;border:1px solid rgba(79,195,247,0.3);">
        <div style="font-size:9px;color:#4FC3F7;margin-bottom:4px;font-weight:700;">주속성</div>
        <div style="font-size:14px;font-weight:700;color:var(--text);">${w.primary || '<span style="color:var(--text-muted);">미확인</span>'}</div>
      </div>
      <div style="background:rgba(0,0,0,0.2);border-radius:4px;padding:10px 12px;border:1px solid rgba(255,213,128,0.3);">
        <div style="font-size:9px;color:#FFD580;margin-bottom:4px;font-weight:700;">보조속성</div>
        <div style="font-size:14px;font-weight:700;color:var(--text);">${w.secondary || '<span style="color:var(--text-muted);">미확인</span>'}</div>
      </div>
      <div style="background:rgba(0,0,0,0.2);border-radius:4px;padding:10px 12px;border:1px solid rgba(128,255,128,0.3);">
        <div style="font-size:9px;color:#80FF80;margin-bottom:4px;font-weight:700;">스킬</div>
        <div style="font-size:14px;font-weight:700;color:var(--text);">${w.skill || '<span style="color:var(--text-muted);">미확인</span>'}</div>
      </div>
    </div>`;

  // 2. 고위 에너지 응집점 리스트 (스킬 속성 기준, 전체 표시 + 추천 표시)
  const alluviums = w.skill ? getBestAlluviumsForWeapon(w) : ALLUVIUMS;
  const notFoundSkill = w.skill && alluviums.length === 0;

  const alluviumsHtml = (notFoundSkill
    ? `<div style="font-size:11px;color:var(--danger);padding:8px 0;">⚠ 이 스킬 속성을 드롭하는 고위 에너지 응집점이 없어요 — 데이터를 확인해주세요</div>`
    : alluviums.map(a => {
        // 같이 파밍하면 좋은 무기: 선택한 무기와 스킬 속성이 동일 + 추가 속성이 이 응집점의 trait2 풀에 포함
        const bundleWeapons = (window.WEAPONS || []).filter(bw => {
          if (bw.name === wikiWeapon.name) return false;
          const bwSkill = bw.trait3 ? (bw.trait3.keyword || stripSize(bw.trait3.label)) : null;
          const bwSecondary = bw.trait2 ? stripSize(bw.trait2.label) : null;
          const skillMatch = bwSkill && bwSkill === w.skill;
          const secondaryAvailable = bwSecondary && (a.trait2 || []).includes(bwSecondary);
          return skillMatch && secondaryAvailable;
        });

        const bundleHtml = bundleWeapons.length > 0
          ? `<div style="margin-top:10px;padding-top:10px;border-top:1px dashed rgba(255,255,255,0.09);">
              <div style="font-size:10px;font-weight:700;color:var(--accent2);margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:4px;"
                onclick="(function(el){
                  const body = document.getElementById('bundle-${a.id}');
                  const arrow = el.querySelector('.bundle-arrow');
                  const collapsed = body.style.display === 'none';
                  body.style.display = collapsed ? 'flex' : 'none';
                  arrow.textContent = collapsed ? '▾' : '▸';
                })(this)">
                <span class="bundle-arrow">▸</span> 📦 같이 파밍하면 좋은 무기 (${bundleWeapons.length}개)
              </div>
              <div id="bundle-${a.id}" style="display:none;flex-direction:column;gap:4px;">
                ${bundleWeapons.map(bw => wikiWeaponCard(bw, null, null, bw.trait3?.keyword)).join('')}
              </div>
            </div>`
          : `<div style="margin-top:8px;font-size:10px;color:var(--text-muted);">이 장소에서 같이 파밍하면 좋은 무기 없음</div>`;

        const isRecommended = bundleWeapons.length > 0;

        return `<div style="border:1px solid ${isRecommended ? 'rgba(240,200,22,0.4)' : 'rgba(255,255,255,0.09)'};border-radius:4px;overflow:hidden;margin-bottom:8px;background:${isRecommended ? 'rgba(240,200,22,0.06)' : 'rgba(255,255,255,0.04)'};">
          <div style="padding:10px 14px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
            <div>
              <span style="font-size:13px;font-weight:700;color:var(--accent);">📍 ${a.name}</span>
              <span style="font-size:10px;color:var(--text-muted);margin-left:8px;">${a.region}</span>
            </div>
            ${isRecommended
              ? `<span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:4px;background:rgba(240,200,22,0.14);color:var(--accent);border:1px solid rgba(240,200,22,0.35);">⭐ 추천</span>`
              : `<span style="font-size:10px;color:var(--text-muted);">단독 파밍</span>`}
          </div>
          <div style="padding:10px 14px;">
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:4px;">
              ${a.skills.map(s => {
                const isTarget = s === w.skill;
                return `<span style="font-size:10px;padding:2px 7px;border-radius:4px;
                  background:${isTarget ? 'rgba(128,255,128,0.2)' : 'rgba(255,255,255,0.05)'};
                  color:${isTarget ? '#80FF80' : 'var(--text-muted)'};
                  border:1px solid ${isTarget ? 'rgba(128,255,128,0.4)' : 'rgba(255,255,255,0.1)'};
                  font-weight:${isTarget ? '700' : '400'};">${s}${isTarget ? ' ✓' : ''}</span>`;
              }).join('')}
            </div>
            ${bundleHtml}
          </div>
        </div>`;
      }).join('')
  );

  el.innerHTML = `
    <!-- 무기 헤더 -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--border);">
      ${w.rarity ? `<span style="font-size:18px;font-weight:700;color:${rarityColor(w.rarity)};">★${w.rarity}</span>` : ''}
      ${w.operator ? `<span style="font-size:12px;color:var(--text-label);">${w.operator} 전용 무기</span>` : ''}
    </div>

    ${statsHtml}

    <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:8px;">
      고위 에너지 응집점 목록
      ${w.skill ? `<span style="color:var(--text-muted);font-weight:400;margin-left:4px;">— 스킬 속성 <b style="color:#80FF80;">${w.skill}</b> 기준</span>` : ''}
    </div>
    ${alluviumsHtml}
    <div style="font-size:10px;color:var(--text-muted);margin-top:8px;">
      ※ 주 속성·추가 속성은 모든 고위 에너지 응집점에서 랜덤 드롭돼요. 스킬 속성이 나오는 장소를 선택해야 해요.
    </div>`;
}

// ========== 공통 헬퍼 ==========
function rarityColor(r) {
  return r===6 ? '#ff5252' : r===5 ? '#ffd740' : r===4 ? '#b39ddb' : '#4fc3f7';
}

function wikiWeaponCard(w, hiT1, hiT2, hiT3) {
  const stripSize = s => s ? s.replace(/\xa0/g,' ').trim().replace(/\s*·\s*(대|중|소)$/, '') : '';
  const t1 = stripSize(w.trait1?.label || '');
  const t2 = stripSize(w.trait2?.label || '');
  const t3kw = stripSize(w.trait3?.keyword || '');
  const t1Match = hiT1 && (t1 === hiT1 || t2 === hiT1);
  const t2Match = hiT2 && (t1 === hiT2 || t2 === hiT2);
  const t3Match = hiT3 && t3kw === hiT3;
  const allMatch = (!hiT1||t1Match) && (!hiT2||t2Match) && (!hiT3||t3Match);

  // 등급 정보: weapons.js의 w.rarity 우선, 없으면 WEAPON_DATA fallback
  const wd = WEAPON_DATA.find(d => d.name === w.name);
  const rarity = w.rarity || wd?.rarity || '';
  const operator = wd?.operator || '';
  const rc = rarity ? rarityColor(rarity) : 'var(--text-muted)';

  return `<div style="border:1px solid ${allMatch?'rgba(240,200,22,0.5)':'rgba(255,255,255,0.08)'};border-radius:6px;padding:10px 12px;
    background:${allMatch?'rgba(240,200,22,0.05)':'rgba(255,255,255,0.03)'};">
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
      ${rarity ? `<span style="font-size:11px;font-weight:700;color:${rc};">★${rarity}</span>` : ''}
      <span style="font-size:13px;font-weight:700;color:var(--text);">${w.name}</span>
      <span style="font-size:10px;color:var(--text-muted);">${w.type||''}</span>
      ${operator ? `<span style="font-size:10px;color:var(--accent2);">${operator}</span>` : ''}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:5px;">
      ${w.trait1 ? `<span style="font-size:10px;color:#4FC3F7;font-weight:700;padding:1px 5px;border-radius:3px;
          background:rgba(79,195,247,${t1Match?'0.15':'0.05'});border:1px solid rgba(79,195,247,${t1Match?'0.4':'0.15'});">
          ${t1}</span>` : ''}
      ${w.trait2 ? `<span style="font-size:10px;color:#FFD580;font-weight:700;padding:1px 5px;border-radius:3px;
          background:rgba(255,213,128,${t2Match?'0.15':'0.05'});border:1px solid rgba(255,213,128,${t2Match?'0.4':'0.15'});">
          ${t2}</span>` : ''}
      ${w.trait3 ? `<span style="font-size:10px;color:#80FF80;font-weight:700;padding:1px 5px;border-radius:3px;
          background:rgba(128,255,128,${t3Match?'0.15':'0.05'});border:1px solid rgba(128,255,128,${t3Match?'0.4':'0.15'});">
          ${w.trait3.keyword||''}</span>` : ''}
    </div>
  </div>`;
}
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-theme');
  document.getElementById('theme-icon-dark').style.display  = isLight ? 'none'  : '';
  document.getElementById('theme-icon-light').style.display = isLight ? ''      : 'none';
  localStorage.setItem('endfield_theme', isLight ? 'light' : 'dark');
}

function loadTheme() {
  const saved = localStorage.getItem('endfield_theme');
  if (saved === 'light') {
    document.body.classList.add('light-theme');
    const d = document.getElementById('theme-icon-dark');
    const l = document.getElementById('theme-icon-light');
    if (d) d.style.display = 'none';
    if (l) l.style.display = '';
  }
}

// ========== 변경 이력 ==========
let lastSavedTime = null;

function markSaved() {
  lastSavedTime = new Date();
  const badge = document.getElementById('last-saved-badge');
  if (!badge) return;
  const h = lastSavedTime.getHours().toString().padStart(2,'0');
  const m = lastSavedTime.getMinutes().toString().padStart(2,'0');
  const s = lastSavedTime.getSeconds().toString().padStart(2,'0');
  badge.textContent = `✓ ${h}:${m}:${s} 저장됨`;
  badge.style.opacity = '1';
  clearTimeout(badge._fadeTimer);
  badge._fadeTimer = setTimeout(() => { badge.style.opacity = '0'; }, 3000);
}

// ========== 내보내기 ==========
function openOverlayHelper() {
  if (window.__TAURI__) {
    const data = btoa(encodeURIComponent(JSON.stringify(od())));
    window.__TAURI__.invoke('open_overlay', { data });
    return;
  }
  // URL Scheme 시도 → 2초 후 앱 없으면 다운로드 안내
  const data = btoa(encodeURIComponent(JSON.stringify(od())));
  window.location.href = 'endfield://overlay?data=' + data;
  setTimeout(function() {
    if (document.visibilityState === 'visible') {
      showOverlayModal();
    }
  }, 2000);
}

function showOverlayModal() {
  const DOWNLOAD_URL = 'https://github.com/mincho8317/endfield.calc/releases/latest/download/Endfield-Factory-Calc-setup.exe';
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;display:flex;align-items:center;justify-content:center;';

  const box = document.createElement('div');
  box.style.cssText = 'background:var(--panel3);border:1px solid rgba(255,255,255,0.1);border-top:2px solid var(--accent);border-radius:8px;padding:28px 28px 24px;max-width:420px;width:90%;box-shadow:0 12px 40px rgba(0,0,0,0.7);';

  box.innerHTML =
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M9 10l2 2 4-4" stroke-width="2.5"/></svg>' +
      '<span style="font-size:15px;font-weight:700;color:var(--text);">배치 도우미 앱</span>' +
    '</div>' +
    '<p style="font-size:12px;color:var(--text-sub);line-height:1.8;margin-bottom:8px;">배치 도우미 앱을 설치하면 게임 화면 위에<br><b style="color:var(--text);">반투명 오버레이</b>로 설비 위치를 표시해드려요.</p>' +
    '<div style="background:rgba(240,200,22,0.06);border:1px solid rgba(240,200,22,0.15);border-radius:6px;padding:12px 14px;margin-bottom:16px;">' +
      '<div style="font-size:11px;color:var(--text-sub);line-height:1.9;">✓ &nbsp;게임 화면 위 반투명 격자 오버레이<br>✓ &nbsp;설비 위치 / 방향 실시간 표시<br>✓ &nbsp;캘리브레이션으로 해상도 자동 보정<br>✓ &nbsp;마우스 이동/줌 추적</div>' +
    '</div>' +
    '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:6px;padding:10px 14px;margin-bottom:20px;">' +
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">설치 방법</div>' +
      '<div style="font-size:11px;color:var(--text-sub);line-height:1.8;">1. 아래 버튼으로 .exe 다운로드<br>2. 실행 → 보안 경고 시 "추가 정보" → "실행"<br>3. 설치 완료 후 "설치 완료했어요" 버튼 클릭</div>' +
    '</div>' +
    '<div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;" id="overlay-modal-btns"></div>';

  modal.appendChild(box);
  document.body.appendChild(modal);
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

  // 버튼들 따로 생성 (템플릿 리터럴 중첩 방지)
  const btnContainer = box.querySelector('#overlay-modal-btns');

  // 닫기
  const btnClose = document.createElement('button');
  btnClose.textContent = '닫기';
  btnClose.style.cssText = 'padding:7px 18px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:var(--text-sub);font-size:12px;cursor:pointer;';
  btnClose.onclick = function() { modal.remove(); };
  btnContainer.appendChild(btnClose);

  // 다운로드
  const btnDownload = document.createElement('a');
  btnDownload.href = DOWNLOAD_URL;
  btnDownload.target = '_blank';
  btnDownload.style.cssText = 'padding:7px 18px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:#1a1200;font-size:12px;font-weight:700;cursor:pointer;text-decoration:none;display:flex;align-items:center;gap:5px;';
  btnDownload.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>앱 다운로드';
  btnDownload.onclick = function() { setTimeout(function() { modal.remove(); }, 500); };
  btnContainer.appendChild(btnDownload);
}


// ── 업데이트 이력 ──────────────────────────────────────────
const CHANGELOG = [
  {
    version: 'v1.0.6', date: '2026.06.18',
    badge: { text: '최신', cls: 'badge-cyan' }, latest: true,
    items: [
      { type: '+', text: '거점 운영 탭 재구성 — 관리권/공장 탭을 4개 서브탭(관리권 생산·천연자원·관리권 소모·공장 배치)으로 통합, 협곡/무릉 뱃지 하나로 전체 동기화' },
      { type: '+', text: '고위 에너지 응집점(舊 파밍처) 데이터 8곳으로 확장 및 전면 갱신 — 장소명, 스킬 속성 8종, 추가 속성 8종 전체 재정리' },
      { type: '+', text: '무기 특성 명칭 공식화 — trait1/2/3 → 주 속성/추가 속성/스킬 속성' },
      { type: '+', text: '무기 데이터(71개) 등급(rarity) 필드 신설 — 주 속성 라벨 크기(소/중/대) 및 특성 개수 기준 추정 로직' },
      { type: '+', text: '"같이 파밍하면 좋은 무기" 추천 로직 — 선택한 무기와 스킬 속성이 동일하고, 추가 속성이 해당 응집점에서 파밍 가능한 무기만 추천' },
      { type: '+', text: '기질 파밍처 무기 선택 드롭다운에 등급별 색상(★6 빨강·★5 노랑·★4 보라·★3 파랑) 적용, 등급→유형→이름 순 정렬' },
      { type: '+', text: '같이 파밍하면 좋은 무기 목록 접기/펼치기 토글 추가 (기본 접힌 상태)' },
      { type: '✕', text: '무기 데이터 오류 수정 — 용조의 불꽃/장대한 염원/끝없는 방랑 특성 누락 보정, 타르 11 등 5종 스킬 속성 오분류 수정, 린수를 찾아서 3.0 데이터 누락 추가' },
      { type: '↑', text: '기질 체커 — 3개 완전 매칭 외 2개 부분 매칭 무기도 별도 섹션으로 표시' },
      { type: '↑', text: '무기 상세 카드 UI 정리 — 중복 특성 설명 박스 제거, 오퍼레이터 전용 무기 표기 간소화, 추천 카드 속성 뱃지 가로 정렬' },
      { type: '✕', text: '거점 운영 탭 div 닫힘 누락으로 일부 탭이 노출되지 않던 문제 수정' },
    ]
  },
  {
    version: 'v1.0.5', date: '2026.06.04',
    items: [
      { type: '+', text: '피드백 기능 추가 (Discord 실시간 알림 + Google Sheets 자동 저장)' },
      { type: '+', text: '배치 도우미 앱 다운로드 연동 (항상 최신 버전 자동 연결)' },
      { type: '↑', text: '배치 도우미 모달 UI 개선' },
    ]
  },
  {
    version: 'v1.0.4', date: '2026.06.03',
    items: [
      { type: '↑', text: '공장 배치 탭 오버레이 앱 연동 구조 개선' },
      { type: '↑', text: 'Tauri 앱 개발자 도구 활성화' },
      { type: '↑', text: '앱 메인 창 로딩 방식 수정' },
    ]
  },
  {
    version: 'v1.0.3', date: '2026.06.02',
    items: [
      { type: '↑', text: '앱 설치 파일명 고정 (버전 무관 동일 URL)' },
      { type: '↑', text: 'GitHub Actions 빌드 파이프라인 개선' },
    ]
  },
  {
    version: 'v1.0.2', date: '2026.06.01',
    items: [
      { type: '+', text: '배치 도우미 버튼 추가 (공장 배치 탭)' },
      { type: '✕', text: '탭 이동 버그 수정' },
      { type: '✕', text: '드롭다운 overflow 잘림 수정' },
      { type: '↑', text: '설비 행 UI 개선' },
    ]
  },
  {
    version: 'v1.0.0', date: '2026.05',
    badge: { text: '최초 출시', cls: 'badge-orange' },
    items: [
      { type: '+', text: '관리권 계산기' },
      { type: '+', text: '공장 계산기' },
      { type: '+', text: '오퍼레이터 육성' },
      { type: '+', text: '기질 파밍' },
      { type: '+', text: '공장 배치' },
    ]
  },
];

function renderChangelog() {
  const container = document.getElementById('changelog-list');
  if (!container || container.dataset.rendered) return;
  container.dataset.rendered = '1';
  const typeColor = { '+': 'var(--success)', '↑': 'var(--teal)', '✕': 'var(--danger)' };

  CHANGELOG.forEach((v, i) => {
    const isOpen = i === 0;
    const wrap = document.createElement('div');
    wrap.style.cssText = 'border-bottom:1px solid var(--border);';

    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;gap:10px;padding:12px 16px;cursor:pointer;transition:background 0.12s;user-select:none;';
    header.onmouseenter = function() { this.style.background = 'rgba(255,255,255,0.03)'; };
    header.onmouseleave = function() { this.style.background = 'transparent'; };

    const verBadge = document.createElement('span');
    verBadge.textContent = v.version;
    verBadge.style.cssText = v.latest
      ? 'background:var(--accent);color:var(--accent-text);font-size:11px;font-weight:700;padding:2px 10px;border-radius:3px;font-family:var(--font-mono);flex-shrink:0;'
      : 'background:var(--panel3);color:var(--text-sub);font-size:11px;font-weight:700;padding:2px 10px;border-radius:3px;font-family:var(--font-mono);border:1px solid var(--border-strong);flex-shrink:0;';

    const dateEl = document.createElement('span');
    dateEl.textContent = v.date;
    dateEl.style.cssText = 'font-size:11px;color:var(--text-muted);font-family:var(--font-mono);';

    header.appendChild(verBadge);
    header.appendChild(dateEl);
    if (v.badge) {
      const b = document.createElement('span');
      b.className = 'badge ' + v.badge.cls;
      b.textContent = v.badge.text;
      header.appendChild(b);
    }

    const summary = document.createElement('span');
    summary.style.cssText = 'font-size:11px;color:var(--text-muted);margin-left:auto;margin-right:4px;';
    summary.textContent = v.items.length + '개 변경';
    summary.style.display = isOpen ? 'none' : '';
    header.appendChild(summary);

    const arrow = document.createElement('span');
    arrow.style.cssText = 'color:var(--text-muted);font-size:11px;transition:transform 0.2s;flex-shrink:0;';
    arrow.textContent = '▼';
    arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    header.appendChild(arrow);

    const body = document.createElement('div');
    body.style.cssText = 'overflow:hidden;transition:max-height 0.25s ease,opacity 0.2s;';
    body.style.maxHeight = isOpen ? '400px' : '0';
    body.style.opacity = isOpen ? '1' : '0';

    const inner = document.createElement('div');
    inner.style.cssText = 'padding:4px 16px 14px 16px;display:flex;flex-direction:column;gap:7px;';
    v.items.forEach(item => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--text-sub);';
      row.innerHTML = '<span style="color:' + typeColor[item.type] + ';flex-shrink:0;margin-top:1px;font-weight:700;">' + item.type + '</span>' + item.text;
      inner.appendChild(row);
    });
    body.appendChild(inner);

    let open = isOpen;
    header.onclick = function() {
      open = !open;
      body.style.maxHeight = open ? '400px' : '0';
      body.style.opacity = open ? '1' : '0';
      arrow.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
      summary.style.display = open ? 'none' : '';
    };

    wrap.appendChild(header);
    wrap.appendChild(body);
    container.appendChild(wrap);
  });
}

// ── 피드백 ──────────────────────────────────────────
const FEEDBACK_WEBHOOK = 'https://discord.com/api/webhooks/1511927326487744562/_abO9uTtb_AXNwMTeO-smxdpKtXHJgUyKlowOdhanVQ99nIF-fBh5iERMX082P4QONRN';
const FEEDBACK_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyZTAPoO07X_wMDC5YO157LjViyqDvjuU6l6FE-1BgqWaRyzvSCmKHGzE5om7HxrlY5/exec';

function openFeedbackModal() {
  if (document.getElementById('feedback-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'feedback-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;display:flex;align-items:center;justify-content:center;';

  const box = document.createElement('div');
  box.style.cssText = 'background:var(--panel3);border:1px solid rgba(255,255,255,0.1);border-top:2px solid var(--accent);border-radius:8px;padding:24px;width:90%;max-width:460px;box-shadow:0 12px 40px rgba(0,0,0,0.7);';

  box.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        '<span style="font-size:14px;font-weight:700;color:var(--text);">피드백 보내기</span>' +
      '</div>' +
      '<button id="feedback-close" style="background:transparent;border:none;color:var(--text-muted);font-size:16px;cursor:pointer;">✕</button>' +
    '</div>' +
    '<div style="margin-bottom:12px;">' +
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;">유형</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;" id="feedback-type-btns">' +
        '<button data-type="버그" style="padding:4px 12px;border-radius:20px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:var(--text-sub);font-size:11px;cursor:pointer;">🐛 버그</button>' +
        '<button data-type="개선" style="padding:4px 12px;border-radius:20px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:var(--text-sub);font-size:11px;cursor:pointer;">💡 개선</button>' +
        '<button data-type="데이터" style="padding:4px 12px;border-radius:20px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:var(--text-sub);font-size:11px;cursor:pointer;">📊 데이터</button>' +
        '<button data-type="기타" style="padding:4px 12px;border-radius:20px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:var(--text-sub);font-size:11px;cursor:pointer;">💬 기타</button>' +
      '</div>' +
    '</div>' +
    '<div style="margin-bottom:12px;">' +
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;">닉네임 <span style="color:var(--text-muted);font-weight:400;">(선택 · 피드백 반영 시 업데이트 노트에 표시됩니다)</span></div>' +
      '<input id="feedback-nickname" type="text" placeholder="이름 없는 사용자" maxlength="20" ' +
        'style="width:100%;background:var(--bg-input);border:1px solid rgba(255,255,255,0.08);border-radius:6px;color:var(--text);font-size:12px;padding:8px 10px;font-family:inherit;">' +
    '</div>' +
    '<div style="margin-bottom:16px;">' +
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;">내용 <span style="color:var(--danger);">*</span></div>' +
      '<textarea id="feedback-text" placeholder="불편한 점, 개선 아이디어, 데이터 오류 등 자유롭게 작성해주세요." ' +
        'style="width:100%;height:120px;background:var(--bg-input);border:1px solid rgba(255,255,255,0.08);border-radius:6px;color:var(--text);font-size:12px;padding:10px;resize:vertical;line-height:1.6;font-family:inherit;"></textarea>' +
    '</div>' +
    '<div style="display:flex;justify-content:flex-end;gap:8px;">' +
      '<button id="feedback-cancel" style="padding:7px 18px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:var(--text-sub);font-size:12px;cursor:pointer;">취소</button>' +
      '<button id="feedback-submit" style="padding:7px 18px;border-radius:6px;border:1px solid var(--accent);background:var(--accent);color:#1a1200;font-size:12px;font-weight:700;cursor:pointer;">전송</button>' +
    '</div>';

  modal.appendChild(box);
  document.body.appendChild(modal);

  // 유형 선택
  let selectedType = '기타';
  box.querySelectorAll('[data-type]').forEach(btn => {
    btn.addEventListener('click', function() {
      box.querySelectorAll('[data-type]').forEach(b => {
        b.style.background = 'transparent';
        b.style.borderColor = 'rgba(255,255,255,0.1)';
        b.style.color = 'var(--text-sub)';
      });
      this.style.background = 'rgba(240,200,22,0.15)';
      this.style.borderColor = 'rgba(240,200,22,0.4)';
      this.style.color = '#f0c816';
      selectedType = this.dataset.type;
    });
  });

  // 닫기
  box.querySelector('#feedback-close').onclick = function() { modal.remove(); };
  box.querySelector('#feedback-cancel').onclick = function() { modal.remove(); };
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });

  // 전송
  box.querySelector('#feedback-submit').onclick = async function() {
    const text = document.getElementById('feedback-text').value.trim();
    const nickname = (document.getElementById('feedback-nickname').value.trim()) || '이름 없는 사용자';
    if (!text) { showToast('내용을 입력해주세요.', 'error'); return; }

    const btn = this;
    btn.textContent = '전송 중...';
    btn.disabled = true;

    try {
      const now = new Date().toLocaleString('ko-KR');

      // Discord + Google Sheets 동시 전송
      const [discordRes] = await Promise.all([
        fetch(FEEDBACK_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [{
              title: '📬 새 피드백 — ' + selectedType,
              description: text,
              color: selectedType === '버그' ? 0xd04040 :
                     selectedType === '개선' ? 0x48a870 :
                     selectedType === '데이터' ? 0x3ab8c8 : 0xf0c816,
              fields: [{ name: '닉네임', value: nickname, inline: true }],
              footer: { text: 'ECT • ' + now }
            }]
          })
        }),
        fetch(FEEDBACK_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: now,
            type: selectedType,
            nickname: nickname,
            content: text
          })
        })
      ]);

      if (discordRes.ok) {
        modal.remove();
        showToast('피드백이 전송됐어요! 감사합니다 😊');
      } else {
        throw new Error('Discord 전송 실패');
      }
    } catch(e) {
      btn.textContent = '전송';
      btn.disabled = false;
      showToast('전송에 실패했어요. 다시 시도해주세요.', 'error');
    }
  };
}

function exportData() {
  const savedOutpostData = {};
  OUTPOSTS.forEach(o => {
    savedOutpostData[o.id] = {
      resourceRates: outpostData[o.id].resourceRates,
      groups:        outpostData[o.id].groups,
      targetRates:   outpostData[o.id].targetRates,
      nextGroupId:   outpostData[o.id].nextGroupId,
    };
  });
  const payload = {
    version: 2,
    exportedAt: new Date().toISOString(),
    outpostData: savedOutpostData,
    baseEff,
    presets,
    activeOutpostId,
    operators,
    nextOperatorId,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const date = new Date().toISOString().slice(0,10);
  a.href     = url;
  a.download = `endfield_${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📤 데이터를 내보냈어요!');
}

// ========== 가져오기 ==========
function importData(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      applyImportedData(data);
      showToast('📥 데이터를 불러왔어요!', 'success');
    } catch(err) {
      showToast('❌ 파일을 읽는데 실패했어요', 'error');
    }
    input.value = '';
  };
  reader.readAsText(file);
}

function applyImportedData(data) {
  if (data.outpostData) {
    OUTPOSTS.forEach(o => {
      const saved = data.outpostData[o.id];
      if (!saved) return;
      if (saved.resourceRates) Object.assign(outpostData[o.id].resourceRates, saved.resourceRates);
      if (saved.groups)        outpostData[o.id].groups      = saved.groups;
      if (saved.targetRates)   Object.assign(outpostData[o.id].targetRates, saved.targetRates);
      if (saved.nextGroupId)   outpostData[o.id].nextGroupId = saved.nextGroupId;
    });
  }
  if (data.baseEff) {
    OUTPOSTS.forEach(o => {
      if (data.baseEff[o.id]) {
        Object.entries(data.baseEff[o.id]).forEach(([zoneName, saved]) => {
          if (baseEff[o.id]?.[zoneName]) Object.assign(baseEff[o.id][zoneName], saved);
        });
      }
    });
  }
  if (data.presets)       presets        = data.presets;
  if (data.activeOutpostId) activeOutpostId = data.activeOutpostId;
  if (data.operators)     operators      = data.operators;
  if (data.nextOperatorId) nextOperatorId = data.nextOperatorId;

  // UI 전체 갱신
  renderFactoryOutpostTabs();
  renderResourceInputs();
  renderWorkspace();
  renderResults();
  updateFactoryAuthBar();
  renderAuthOutpostTabs();
  switchAuthView('outpost', activeAuthOutpostId);
  renderOperatorList();
  renderOperatorConfig();
  renderOperatorTotal();
  saveData();
}

// ========== 공유 링크 ==========
function shareLink() {
  try {
    const savedOutpostData = {};
    OUTPOSTS.forEach(o => {
      savedOutpostData[o.id] = {
        resourceRates: outpostData[o.id].resourceRates,
        groups:        outpostData[o.id].groups,
        targetRates:   outpostData[o.id].targetRates,
        nextGroupId:   outpostData[o.id].nextGroupId,
      };
    });
    const payload = {
      v: 2,
      outpostData: savedOutpostData,
      baseEff,
      presets,
      activeOutpostId,
      opStates,
      activeOperatorName,
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
    const url = `${location.origin}${location.pathname}?d=${encoded}`;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('🔗 링크를 클립보드에 복사했어요!');
      });
    } else {
      // 폴백: 텍스트 선택
      const ta = document.createElement('textarea');
      ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('🔗 링크를 클립보드에 복사했어요!');
    }
  } catch(e) {
    showToast('❌ 공유 링크 생성에 실패했어요', 'error');
  }
}

// URL 파라미터로 공유 데이터 불러오기
function loadFromURL() {
  const params = new URLSearchParams(location.search);
  const d = params.get('d');
  if (!d) return false;
  try {
    const data = JSON.parse(decodeURIComponent(atob(d)));
    applyImportedData(data);
    // URL 파라미터 제거 (깔끔하게)
    history.replaceState(null, '', location.pathname);
    showToast('🔗 공유 링크로 데이터를 불러왔어요!', 'success');
    return true;
  } catch(e) {
    return false;
  }
}

// ========== 토스트 알림 ==========
function showCurLockedMsg() {
  showToast('현재 단계보다 낮게 설정할 수 없어요', 'error');
}
function showToast(msg, type = 'info') {
  const existing = document.getElementById('toast-msg');
  if (existing) existing.remove();

  const colors = { info: 'var(--accent)', success: 'var(--success)', error: 'var(--danger)' };
  const toast = document.createElement('div');
  toast.id = 'toast-msg';
  toast.textContent = msg;
  toast.style.cssText = `
    position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
    background:var(--surface);border:1px solid ${colors[type]};
    color:var(--text);padding:10px 20px;border-radius:4px;
    font-size:13px;font-family:'Noto Sans KR',sans-serif;
    z-index:99999;box-shadow:0 4px 16px rgba(0,0,0,0.4);
    animation:fadeInUp 0.2s ease;white-space:nowrap;
  `;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 2500);
}

// ========== 모바일 현황 드로어 ==========
let drawerCurrentFilter = 'all';

function openStatusDrawer() {
  syncDrawerData();
  const overlay = document.getElementById('status-drawer-overlay');
  const drawer  = document.getElementById('status-drawer');
  overlay.style.display = 'block';
  requestAnimationFrame(() => { drawer.style.transform = 'translateY(0)'; });
}

function closeStatusDrawer() {
  const drawer  = document.getElementById('status-drawer');
  const overlay = document.getElementById('status-drawer-overlay');
  drawer.style.transform = 'translateY(100%)';
  setTimeout(() => { overlay.style.display = 'none'; }, 300);
}

function syncDrawerData() {
  const produce = document.getElementById('fab-outpost-produce')?.textContent || '0';
  const consume = document.getElementById('fab-outpost-consume')?.textContent || '0';
  const balance = document.getElementById('fab-outpost-balance')?.textContent || '0';
  const balEl   = document.getElementById('fab-outpost-balance');

  const dp = document.getElementById('drawer-produce');
  const dc = document.getElementById('drawer-consume');
  const db = document.getElementById('drawer-balance');
  if (dp) dp.textContent = produce;
  if (dc) dc.textContent = consume;
  if (db) {
    db.textContent = balance;
    db.style.color = balEl?.style.color || 'var(--text)';
  }

  const src  = document.getElementById('results-grid');
  const dest = document.getElementById('drawer-results-grid');
  if (src && dest) dest.innerHTML = src.innerHTML;
  applyDrawerFilter(drawerCurrentFilter);
}

function applyDrawerFilter(type) {
  const dest = document.getElementById('drawer-results-grid');
  if (!dest) return;
  dest.querySelectorAll('.compact-item').forEach(item => {
    const dot  = item.querySelector('.compact-dot');
    const show = type === 'all' || (dot && dot.classList.contains(type));
    item.style.display = show ? '' : 'none';
  });
}

function updateMobileStatusBtn() {
  const isMobile   = window.innerWidth < 768;
  const btn        = document.getElementById('mobile-status-btn-wrap');
  const rightPanel = document.querySelector('.factory-right-fixed');
  if (btn)        btn.style.display        = isMobile ? '' : 'none';
  if (rightPanel) rightPanel.style.display = isMobile ? 'none' : '';
  if (!isMobile) return;

  // DOM 읽기 대신 직접 계산
  const oId          = activeOutpostId;
  const authTotal    = calcOutpostAuthTotal(oId);
  const factoryRates = getAuthProductRatesFromFactory(oId);
  let   factoryConsume = 0;
  Object.entries(currentAuthValue()).forEach(([name, val]) => {
    factoryConsume += val * (factoryRates[name] || 0);
  });
  const balance  = authTotal - factoryConsume;
  const isNeg    = balance < 0;
  const balColor = isNeg ? 'var(--danger)' : 'var(--success)';
  const balText  = (balance >= 0 ? '+' : '') + fmt(balance);

  const summary = document.getElementById('mobile-auth-summary');
  if (summary) {
    summary.innerHTML = `관리권 잔여 <span style="color:${balColor};font-weight:700;font-family:'Share Tech Mono',monospace;">${balText}/분</span>`;
  }

  // 재료 부족 수는 결과 계산에서 직접 집계
  const totals = calcTotals(oId);
  const deficitCount = Object.values(totals).filter(v => v.balance < -0.001).length;
  const badge = document.getElementById('mobile-deficit-badge');
  if (badge) {
    badge.style.display = deficitCount > 0 ? '' : 'none';
    badge.textContent   = `⚠ ${deficitCount}개 부족`;
  }

  // 드로어가 열려있으면 데이터 동기화
  const overlay = document.getElementById('status-drawer-overlay');
  if (overlay?.style.display !== 'none') syncDrawerData();
}

// 화면 크기 변경 시 재렌더
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const productPanel = document.getElementById(`auth-inner-product-${activeAuthOutpostId}`);
    const isProductTabOpen = productPanel && productPanel.style.display !== 'none';
    if (!isProductTabOpen) renderOutpostProducts(activeAuthOutpostId);
    updateMobileStatusBtn();
    renderOperatorList();
    renderOperatorTotal();
    if (document.getElementById('tab-overview')?.classList.contains('active')) {
      renderOverviewTab();
    }
  }, 200);
});

// ========== 온보딩 투어 ==========
const TOUR_KEY = 'endfield_tour_v1';

const TOUR_STEPS = [
  {
    title: '👋 처음 오셨군요!',
    body: 'Endfield Companion Tool에 오신 걸 환영해요!\n짧은 투어로 주요 기능을 안내해드릴게요.',
    target: null, position: 'center',
  },
  {
    title: '📊 전체 현황',
    body: '모든 거점의 관리권 생산·소모·잉여를\n한눈에 볼 수 있어요.\n부족한 자원이 있으면 여기서 바로 확인돼요.',
    target: () => document.querySelector('.tab-bar .tab:nth-child(1)'), position: 'bottom',
  },
  {
    title: '🏭 거점 운영',
    body: '4가지 서브탭으로 구성돼요.\n① 관리권 생산량 — 거점별 오퍼레이터 배치 및 보너스 계산\n② 천연자원 생산량 — 채굴·채취 자원 관리\n③ 관리권 소모 계산 — 교환 및 소모 계획\n④ 공장 생산 계획 — 설비 추가 후 재료 수지 계산',
    target: () => document.querySelector('.tab-bar .tab:nth-child(2)'), position: 'bottom',
  },
  {
    title: '⚙ 공장 생산 계획',
    body: '거점 운영 탭의 ④번 서브탭이에요.\n그룹 추가 → 설비 추가 → 수량 입력 순서로\n필요한 재료와 소모 수지를 실시간으로 계산해줘요.\n프리셋으로 자주 쓰는 설비 조합을 저장할 수도 있어요.',
    target: () => document.getElementById('otab-factory'), position: 'bottom',
  },
  {
    title: '🏗 공장 배치',
    body: '계획한 설비를 실제 그리드에 배치해보는 시뮬레이터예요.\n설비를 드래그해서 놓고, 벨트와 파이프로 연결할 수 있어요.\nR키로 설비를 회전하고, 자동연결로 경로를 자동으로 이어줘요.',
    target: () => document.querySelector('.tab-bar .tab:nth-child(3)'), position: 'bottom',
  },
  {
    title: '👤 오퍼레이터 육성',
    body: '현재→목표 레벨·정예화·스킬을 설정하면\n필요한 재료와 파밍 이성을 자동 계산해줘요.\n파밍 가이드 탭에서 어디서 뭘 파밍할지 확인하세요.',
    target: () => document.querySelector('.tab-bar .tab:nth-child(4)'), position: 'bottom',
  },
  {
    title: '⚔ 무기 및 기질',
    body: '두 가지 기능이 있어요.\n🔍 기질 체커 — 원하는 특성 조합으로 맞는 무기를 찾아요\n⚔ 기질 파밍처 — 무기를 선택하면 파밍해야 할\n고위 에너지 응집점과 같이 파밍하면 좋은 무기를 알려줘요.',
    target: () => document.querySelector('.tab-bar .tab:nth-child(5)'), position: 'bottom',
  },
  {
    title: '💾 데이터는 자동 저장돼요',
    body: '모든 입력 데이터는 브라우저에 자동 저장돼요.\n혹시 몰라 백업이 필요하다면:\n내보내기(exportData)로 파일로 저장하고\n가져오기(importData)로 다른 기기에서 불러올 수 있어요.\n(추후 메뉴에서 지원 예정)',
    target: () => document.getElementById('theme-btn'), position: 'bottom-left',
  },
  {
    title: '🎉 준비 완료!',
    body: '이제 직접 사용해보세요!\n헤더의 ❓ 버튼으로 언제든 이 가이드를 다시 볼 수 있어요.\n피드백이 있으면 우측 하단 피드백 버튼을 눌러주세요!',
    target: null, position: 'center',
  },
];

let tourStep = 0;
let tourActive = false;

function startTour(force = false) {
  if (!force && localStorage.getItem(TOUR_KEY)) return;
  tourStep = 0;
  tourActive = true;
  renderTourStep();
}

function renderTourStep() {
  cleanTour();
  if (!tourActive || tourStep >= TOUR_STEPS.length) { endTour(); return; }

  const step     = TOUR_STEPS[tourStep];
  const targetEl = step.target ? step.target() : null;

  // 백드롭
  const bd = document.createElement('div');
  bd.className = 'tour-backdrop'; bd.id = 'tour-backdrop';
  bd.onclick = () => nextTourStep();
  document.body.appendChild(bd);

  // 하이라이트
  if (targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const hl = document.createElement('div');
    hl.className = 'tour-highlight'; hl.id = 'tour-highlight';
    hl.style.cssText = `top:${rect.top-4}px;left:${rect.left-4}px;width:${rect.width+8}px;height:${rect.height+8}px;`;
    document.body.appendChild(hl);
  }

  // 카드
  const card = document.createElement('div');
  card.className = 'tour-card'; card.id = 'tour-card';
  card.innerHTML = `
    <div class="tour-card-title">${step.title}</div>
    <div class="tour-card-body">${step.body.replace(/\n/g,'<br>')}</div>
    <div class="tour-card-footer">
      <span class="tour-step-indicator">${tourStep+1} / ${TOUR_STEPS.length}</span>
      <div class="tour-btn-group">
        <button class="tour-btn" onclick="endTour()">건너뛰기</button>
        ${tourStep > 0 ? `<button class="tour-btn" onclick="prevTourStep()">◀</button>` : ''}
        <button class="tour-btn primary" onclick="nextTourStep()">
          ${tourStep === TOUR_STEPS.length-1 ? '완료 ✓' : '다음 ▶'}
        </button>
      </div>
    </div>`;
  document.body.appendChild(card);
  positionTourCard(card, targetEl, step.position);
}

function positionTourCard(card, targetEl, position) {
  const cw=320, ch=220, vw=window.innerWidth, vh=window.innerHeight;
  let top, left;
  if (!targetEl || position === 'center') {
    top=(vh-ch)/2; left=(vw-cw)/2;
  } else {
    const r = targetEl.getBoundingClientRect();
    if (position === 'bottom-left') { top=r.bottom+12; left=r.right-cw; }
    else { top=r.bottom+12; left=r.left+r.width/2-cw/2; }
    left = Math.max(12, Math.min(left, vw-cw-12));
    top  = Math.max(12, Math.min(top,  vh-ch-12));
    if (top+ch > vh-12) top = r.top-ch-12;
  }
  card.style.top=top+'px'; card.style.left=left+'px';
}

function nextTourStep() { tourStep++; renderTourStep(); }
function prevTourStep() { tourStep--; renderTourStep(); }

function endTour() {
  cleanTour(); tourActive = false;
  localStorage.setItem(TOUR_KEY, '1');
}

function cleanTour() {
  ['tour-backdrop','tour-highlight','tour-card'].forEach(id => document.getElementById(id)?.remove());
}

function resetTour() {
  localStorage.removeItem(TOUR_KEY);
  startTour(true);
}

// ========== 커스텀 다이얼로그 (confirm/alert/prompt 대체) ==========
function showDialog({ title = '', message = '', input = null, buttons }) {
  return new Promise(resolve => {
    const modal   = document.getElementById('modal-dialog');
    const titleEl = document.getElementById('dialog-title');
    const msgEl   = document.getElementById('dialog-message');
    const inputEl = document.getElementById('dialog-input');
    const btnsEl  = document.getElementById('dialog-buttons');

    titleEl.textContent   = title;
    msgEl.innerHTML       = message;

    if (input !== null) {
      inputEl.style.display = '';
      inputEl.value         = input;
      setTimeout(() => { inputEl.focus(); inputEl.select(); }, 50);
    } else {
      inputEl.style.display = 'none';
    }

    btnsEl.innerHTML = '';
    buttons.forEach(btn => {
      const el = document.createElement('button');
      el.textContent = btn.label;
      el.className   = btn.primary ? 'btn btn-primary' : 'btn';
      el.style.cssText = 'font-size:12px;padding:6px 16px;';
      el.onclick = () => {
        modal.style.display = 'none';
        resolve(btn.value !== undefined ? btn.value : (input !== null ? inputEl.value : undefined));
      };
      btnsEl.appendChild(el);
    });

    modal.style.display = 'flex';
  });
}

function dialogConfirm(message) {
  return showDialog({
    title: '확인',
    message,
    buttons: [
      { label: '취소',  value: false },
      { label: '삭제',  value: true, primary: true },
    ]
  });
}

function dialogAlert(message) {
  return showDialog({
    title: '알림',
    message,
    buttons: [{ label: '확인', value: true, primary: true }]
  });
}

function dialogPrompt(message, defaultValue = '') {
  return showDialog({
    title: '입력',
    message,
    input: defaultValue,
    buttons: [
      { label: '취소', value: null },
      { label: '확인', primary: true },
    ]
  });
}

loadTheme();
loadData();
loadFromURL();
loadCustomIcons();
renderOutpostBadges();
renderOperatorList();
renderOperatorConfig();
renderOperatorTotal();
initEssenceTab();
// 거점 운영 탭 초기화 (관리권 생산량이 기본)
switchOutpostTab('auth-produce');
// 첫 방문 시 투어 시작
setTimeout(() => startTour(), 600);
