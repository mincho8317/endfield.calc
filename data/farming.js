const FARMING_DATA = {
  '프로토콜 프리즘': {
    icon:'🔷',
    sources:[
      {name:'프로토콜 스페이스: 스킬업', detail:'위협 등급 1~2', sanityPerRun:40, itemPerRun:5},
      {name:'프로토콜 스페이스: 스킬업', detail:'위협 등급 3~4 (권장)', sanityPerRun:60, itemPerRun:9},
    ],
    notes:'스킬업 프로토콜 스페이스 전용. 탐색 상자에서도 소량 획득 가능.',
  },
  '프로토콜 프리즘 세트': {
    icon:'🔶',
    sources:[
      {name:'프로토콜 스페이스: 스킬업', detail:'위협 등급 3~4', sanityPerRun:60, itemPerRun:4},
      {name:'프로토콜 스페이스: 스킬업', detail:'위협 등급 5 (딥다이브)', sanityPerRun:80, itemPerRun:6},
    ],
    notes:'고위협 등급 해금 필요. 프리즘보다 희귀해 우선 소모 자제 권장.',
  },
  '프로토콜 디스크': {
    icon:'💿',
    sources:[
      {name:'프로토콜 스페이스: 승격', detail:'위협 등급 1~2', sanityPerRun:40, itemPerRun:8},
      {name:'프로토콜 스페이스: 승격', detail:'위협 등급 3~4 (권장)', sanityPerRun:60, itemPerRun:14},
    ],
    notes:'정예 1·2 핵심 재료.',
  },
  '프로토콜 디스크 세트': {
    icon:'📀',
    sources:[
      {name:'프로토콜 스페이스: 승격', detail:'위협 등급 3~4', sanityPerRun:60, itemPerRun:5},
      {name:'프로토콜 스페이스: 승격', detail:'위협 등급 5 (딥다이브)', sanityPerRun:80, itemPerRun:8},
    ],
    notes:'정예 3·4 핵심 재료. 탐색 레벨 5 이상 해금 필요.',
  },
  '연한 기둥 버섯': {
    icon:'🍄',
    sources:[
      {name:'탐색: 협곡 패스 일대', detail:'희귀 채집 포인트, 1일 1~2개', sanityPerRun:0, itemPerRun:1},
      {name:'OMV 디지앙: 성장실', detail:'성장실 해금 후 재배', sanityPerRun:0, itemPerRun:0},
    ],
    notes:'이성 불필요. 성장실 재배가 가장 안정적.',
  },
  '보통 기둥 버섯': {
    icon:'🍄',
    sources:[
      {name:'탐색: 협곡 IV 일대', detail:'희귀 채집 포인트, 1일 1~2개', sanityPerRun:0, itemPerRun:1},
      {name:'OMV 디지앙: 성장실', detail:'성장실 해금 후 재배', sanityPerRun:0, itemPerRun:0},
    ],
    notes:'이성 불필요.',
  },
  '진한 기둥 버섯': {
    icon:'🍄',
    sources:[
      {name:'탐색: 트레드웨이 인근', detail:'최초 방문 10개, 이후 1일 1개', sanityPerRun:0, itemPerRun:1},
      {name:'OMV 디지앙: 성장실', detail:'성장실 해금 후 재배', sanityPerRun:0, itemPerRun:0},
    ],
    notes:'이성 불필요. 정예 3 병목 재료.',
  },
  '탈로시안 화폐': {
    icon:'💰',
    sources:[
      {name:'프로토콜 스페이스: 탈로시안 화폐', detail:'전용 프로토콜 스페이스', sanityPerRun:40, itemPerRun:4000},
      {name:'퀘스트·탐색·일일 보상', detail:'자연 획득', sanityPerRun:0, itemPerRun:0},
    ],
    notes:'퀘스트·탐색으로 자연 획득이 충분한 경우가 많음.',
  },
  '고급 전투기록': {
    icon:'📘',
    sources:[
      {name:'프로토콜 스페이스: 오퍼레이터 EXP', detail:'위협 등급 3~5 (권장)', sanityPerRun:60, itemPerRun:3},
    ],
    notes:'10,000 EXP/개.',
  },
  '중급 전투기록': {
    icon:'📗',
    sources:[
      {name:'프로토콜 스페이스: 오퍼레이터 EXP', detail:'위협 등급 1~2', sanityPerRun:40, itemPerRun:5},
    ],
    notes:'3,000 EXP/개.',
  },
  '초급 전투기록': {
    icon:'📕',
    sources:[
      {name:'프로토콜 스페이스: 오퍼레이터 EXP', detail:'위협 등급 1', sanityPerRun:40, itemPerRun:10},
      {name:'탐색·퀘스트', detail:'자연 획득', sanityPerRun:0, itemPerRun:0},
    ],
    notes:'1,000 EXP/개.',
  },
  '존속의 흔적': {
    icon:'✨',
    sources:[
      {name:'프로토콜 스페이스: 스킬업', detail:'위협 등급 5 (딥다이브)', sanityPerRun:80, itemPerRun:1},
    ],
    notes:'마스터리(Lv9~12) 필수 재료. 딥다이브 모드 해금 필요.',
  },
};

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
      ※ 이성 수치는 가장 효율 좋은 파밍처 기준 추정값입니다 (하루 240이성 = 자연회복 200 + 일일퀘스트 이성회복제 40). 볼레테·희귀 재료는 이성 외 탐색 시간도 필요합니다.
    </div>
  </div>`;

  el.innerHTML = summary + `<div style="display:flex;flex-direction:column;gap:8px;">${cards}</div>`;
}

// ========== 기질(Essence) 파밍 데이터 ==========

