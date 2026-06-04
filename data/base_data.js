const BASE_DATA = {
  valley4: [
    { name:'유랑자 임시 거주지', baseAmt:0, hasDefense:true, traits:[
      { type:'authority', value:'로도스 아일랜드' }, // 관리권생산효율 — 소속 매칭
      { type:'exchange',  value:'창의' },             // 관리권교환효율 — 취미 매칭
      { type:'exp',       value:'전황 분석' },        // 경험치효율 — 특기 매칭
    ]},
    { name:'기초 건설 주둔지', baseAmt:0, hasDefense:true, traits:[
      { type:'authority', value:'엔드필드 공업' },    // 관리권생산효율 — 소속 매칭
      { type:'exchange',  value:'과학기술' },          // 관리권교환효율 — 취미 매칭
      { type:'exp',       value:'창의적인 생각' },    // 경험치효율 — 특기 매칭
    ]},
    { name:'재건 지휘부', baseAmt:0, hasDefense:false, traits:[
      { type:'authority', value:'로도스 아일랜드' },  // 관리권생산효율 — 소속 매칭
      { type:'exchange',  value:'문화' },              // 관리권교환효율 — 취미 매칭
      { type:'exp',       value:'오리지늄 아츠' },    // 경험치효율 — 특기 매칭
    ]},
  ],
  wuling: [
    { name:'천왕평지', baseAmt:0, hasDefense:true, traits:[
      { type:'authority', value:'민첩' },             // 관리권생산효율 — 특기 매칭
      { type:'exchange',  value:'자연' },              // 관리권교환효율 — 취미 매칭
      { type:'exp',       value:'작전 기술' },        // 경험치효율 — 특기 매칭
    ]},
    { name:'심장수복실', baseAmt:0, hasDefense:false, traits:[
      { type:'authority', value:'홍산 과학원' },      // 관리권생산효율 — 소속 매칭
      { type:'exchange',  value:'공익' },              // 관리권교환효율 — 취미 매칭
      { type:'exp',       value:'조직 관리' },        // 경험치효율 — 특기 매칭
    ]},
  ],
};

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
  Object.keys(AUTH_VALUE).forEach(k => {
    rates[k] = totals[k] ? Math.max(0, totals[k].balance) : 0;
  });
  return rates;
}

// 현재 활성 관리권 탭 거점
let activeAuthOutpostId = OUTPOSTS[0].id;
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
  panel.innerHTML = `
    <!-- 내부 탭: 관리권 생산 계산 / 관리권 교환 계산 -->
    <div style="display:flex;border-bottom:1px solid var(--border);">
      <div class="inner-tab active" id="atab-base-${oId}" onclick="switchOutpostInnerTab('base','${oId}')">◈ 관리권 생산 계산</div>
      <div class="inner-tab" id="atab-product-${oId}" onclick="switchOutpostInnerTab('product','${oId}')">🔄 관리권 교환 계산</div>
    </div>
    <div id="auth-inner-base-${oId}">
      <div id="base-config-${oId}"></div>
    </div>
    <div id="auth-inner-product-${oId}" style="display:none;">
      <div style="padding:10px 14px;border-bottom:1px solid var(--border);background:rgba(0,0,0,0.1);display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
        <span style="font-size:10px;color:var(--text-muted);">목표 분당 생산량을 입력하면 관리권 소모량과 달성 가능 여부를 계산합니다</span>
        <button class="btn btn-primary" style="font-size:11px;padding:5px 12px;flex-shrink:0;" onclick="autoCalcFactory('${oId}')">
          ⚙ 공장 설비 자동 계산
        </button>
      </div>
      <div id="auth-product-body-${oId}" style="padding:8px;display:flex;flex-direction:column;gap:6px;"></div>
    </div>
  `;
  renderOutpostBaseConfig(oId);
  renderOutpostProducts(oId);
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

    return `<div style="border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:12px 14px;background:var(--bg-mid);display:flex;gap:16px;align-items:stretch;" class="zone-card-inner">
      <!-- 왼쪽: 컨트롤 영역 -->
      <div style="flex:1;min-width:0;">
        <!-- 구역명 -->
        <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:8px;">${z.name}</div>
        <!-- 구역 요구 특성 -->
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;">${traitTags}</div>
        <!-- 기본 생산량 -->
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="font-size:11px;color:var(--text-sub);width:80px;flex-shrink:0;font-weight:500;">기본 생산량</span>
          <input class="eff-input" type="number" step="1" min="0"
            value="${e.baseAmt > 0 ? e.baseAmt : ''}" placeholder="0" style="width:90px;"
            onchange="updateZone('${oId}','${z.name}','baseAmt',+this.value)">
        </div>
        <!-- 배치 오퍼레이터 -->
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="font-size:11px;color:var(--text-sub);width:80px;flex-shrink:0;font-weight:500;">배치 오퍼레이터</span>
          <div id="cs-op-${oId}-${zid}" style="flex:1;max-width:220px;"></div>
        </div>
        <!-- 방어 단계 (있는 경우만) -->
        ${defenseSection}
        <!-- 이벤트 -->
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:11px;color:var(--text-sub);width:80px;flex-shrink:0;font-weight:500;">이벤트</span>
          ${evBtn}
        </div>
      </div>
      <!-- 우측: 분당 관리권 -->
      <div class="zone-card-right" style="width:90px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;border-left:1px solid rgba(255,255,255,0.09);padding-left:14px;gap:4px;">
        <div style="font-size:10px;color:var(--text-label);text-align:center;letter-spacing:0.04em;font-weight:500;">분당<br>관리권</div>
        <div style="font-size:22px;font-weight:700;color:var(--accent);font-family:'Share Tech Mono',monospace;text-align:center;line-height:1;" id="rate_${oId}_${zid}">
          ${rate > 0 ? fmt(rate) : '—'}
        </div>
        ${totalPct > 0 ? `<div style="font-size:11px;font-weight:600;color:var(--success);text-align:center;">+${totalPct}%</div>` : `<div style="font-size:11px;color:var(--text-label);text-align:center;">+0%</div>`}
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
  Object.entries(AUTH_VALUE).forEach(([name, val]) => {
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
        Object.entries(AUTH_VALUE).map(([name, val]) => {
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
  el.innerHTML = Object.entries(AUTH_VALUE).map(([name, val]) => {
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
  Object.entries(AUTH_VALUE).forEach(([name, val]) => {
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
    Object.entries(AUTH_VALUE).forEach(([name, val]) => {
      outpostConsume += val * (tr[name] || 0);
    });
    totalAuthProduce += authTotal;
    totalAuthConsume += outpostConsume;
    const authBalance = authTotal - outpostConsume;

    const totals = calcTotals(o.id);
    const authItems    = Object.entries(totals).filter(([k,v]) =>  AUTH_VALUE[k] && v.balance > 0.001).map(([k,v]) => ({ name:k, rate:v.balance, authCost:AUTH_VALUE[k] }));
    const factoryItems = Object.entries(totals).filter(([k,v]) => !AUTH_VALUE[k] && v.produce > 0.001 && v.balance > 0.001).map(([k,v]) => ({ name:k, balance:v.balance }));
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
function switchTab(tab) {
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  // event.target 대신 탭 버튼을 직접 찾아서 active 추가
  document.querySelectorAll('.tab').forEach(t => {
    if (t.getAttribute('onclick') && t.getAttribute('onclick').includes(`'${tab}'`)) {
      t.classList.add('active');
    }
  });
  if (tab === 'overview') renderOverviewTab();
  if (tab === 'changelog') renderChangelog();
  if (tab === 'layout') {
    setTimeout(function() {
      var root = document.getElementById('factory-layout-root');
      if (root && !root._mounted && typeof FactoryLayout !== 'undefined') {
        root._mounted = true;
        ReactDOM.render(React.createElement(FactoryLayout), root);
      }
    }, 50);
  }
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

// ========== 관리권 거점 선택 탭 ==========
function renderAuthOutpostTabs() {
  const tabsEl = document.getElementById('auth-outpost-tabs');
  if (!tabsEl) return;
  tabsEl.innerHTML = OUTPOSTS.map(o => {
    const isActive = activeAuthOutpostId === o.id;
    return `<button onclick="switchAuthView('outpost','${o.id}')"
      style="padding:7px 22px;font-size:12px;font-weight:600;cursor:pointer;
        border-radius:9999px;border:1px solid ${isActive ? 'var(--accent)' : 'rgba(255,255,255,0.1)'};
        background:${isActive ? 'var(--accent)' : 'transparent'};
        color:${isActive ? 'var(--accent-text)' : 'var(--text-label)'};
        font-family:'Noto Sans KR',sans-serif;transition:all 0.15s;">
      ${o.name}
    </button>`;
  }).join('');
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
    const data = { outpostData: savedOutpostData, baseEff, presets, activeOutpostId, operators, nextOperatorId };
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
    if (data.operators) { operators = data.operators; }
    if (data.nextOperatorId) nextOperatorId = data.nextOperatorId;
  } catch(e) { console.warn('불러오기 실패:', e); }
}

// ========== 오퍼레이터 육성 계산기 ==========

// 돌파(승격) 재료 - Elite 1~4
// Elite N: 레벨캡 20→40→60→80→90
