const OPERATOR_ROSTER = [
  // 6성
  { name:'아델리아',      rarity:6, class:'Supporter', element:'Nature',   faction:'로도스 아일랜드',    hobby:'생활',      hobby2:'자연',      expertise:'자연 상식',      expertise2:'모험',
    weapon:'바다와 별의 꿈',   e4mat1:'스타게이트 버섯', e4mat2:'정합용 유체',
    skillMatA1:'D96강 시제품 4번',      skillMatA2:'바위아겔로스 잎',
    skillMatB1:'타키온 차폐 구조체',    skillMatB2:'바위아겔로스 잎' },
  { name:'엠버',          rarity:6, class:'Defender',  element:'Heat',     faction:'철의 서약군',        hobby:'운동',      hobby2:'과학기술',  expertise:'작전 기술',      expertise2:'체력 단련',
    weapon:'천둥의 흔적',      e4mat1:'스타게이트 버섯', e4mat2:'D96강 시제품 4번',
    skillMatA1:'타키온 차폐 구조체',    skillMatA2:'침식된 옥 잎',
    skillMatB1:'정합용 유체',           skillMatB2:'침식된 옥 잎' },
  { name:'관리자',        rarity:6, class:'Guard',     element:'Physical', faction:'엔드필드 공업',      hobby:'',          hobby2:'',          expertise:'',               expertise2:'',
    weapon:'장대한 염원',      e4mat1:'피버섯',          e4mat2:'초거리 빛 반사 파이프',
    skillMatA1:'타키온 차폐 구조체',    skillMatA2:'바위아겔로스 잎',
    skillMatB1:'D96강 시제품 4번',      skillMatB2:'바위아겔로스 잎' },
  { name:'질베르타',      rarity:6, class:'Supporter', element:'Nature',   faction:'로도스 아일랜드',    hobby:'패션',      hobby2:'문화',      expertise:'모험',           expertise2:'오리지늄 아츠',
    weapon:'사명의 길',        e4mat1:'피버섯',          e4mat2:'타키온 차폐 구조체',
    skillMatA1:'정합용 유체',           skillMatA2:'바위아겔로스 잎',
    skillMatB1:'3상 나노플레이크 칩',   skillMatB2:'바위아겔로스 잎' },
  { name:'레바테인',      rarity:6, class:'Striker',   element:'Heat',     faction:'로도스 아일랜드',    hobby:'창의',      hobby2:'생활',      expertise:'오리지늄 아츠',  expertise2:'전황 분석',
    weapon:'용조의 불꽃',      e4mat1:'스타게이트 버섯', e4mat2:'D96강 시제품 4번',
    skillMatA1:'3상 나노플레이크 칩',   skillMatA2:'침식된 옥 잎',
    skillMatB1:'초거리 빛 반사 파이프', skillMatB2:'침식된 옥 잎' },
  { name:'라스트 라이트', rarity:6, class:'Striker',   element:'Cryo',     faction:'쉐시카',             hobby:'지능 훈련', hobby2:'공익',      expertise:'작전 기술',      expertise2:'체력 단련',
    weapon:'해라펜거',         e4mat1:'피버섯',          e4mat2:'3상 나노플레이크 칩',
    skillMatA1:'타키온 차폐 구조체',    skillMatA2:'침식된 옥 잎',
    skillMatB1:'정합용 유체',           skillMatB2:'침식된 옥 잎' },
  { name:'여풍',          rarity:6, class:'Guard',     element:'Physical', faction:'홍산 과학원',        hobby:'운동',      hobby2:'자연',      expertise:'민첩',           expertise2:'자연 상식',
    weapon:'산의 지배자',      e4mat1:'피버섯',          e4mat2:'초거리 빛 반사 파이프',
    skillMatA1:'정합용 유체',           skillMatA2:'침식된 옥 잎',
    skillMatB1:'3상 나노플레이크 칩',   skillMatB2:'침식된 옥 잎' },
  { name:'포그라니치니크',rarity:6, class:'Vanguard',  element:'Physical', faction:'로도스 아일랜드',    hobby:'문화',      hobby2:'지능 훈련', expertise:'전략 수립',      expertise2:'조직 관리',
    weapon:'끝없는 방랑',      e4mat1:'스타게이트 버섯', e4mat2:'초거리 빛 반사 파이프',
    skillMatA1:'3상 나노플레이크 칩',   skillMatA2:'침식된 옥 잎',
    skillMatB1:'정합용 유체',           skillMatB2:'침식된 옥 잎' },
  { name:'로시',          rarity:6, class:'Guard',     element:'Physical', faction:'엔드필드 공업',      hobby:'자연',      hobby2:'운동',      expertise:'전황 분석',      expertise2:'교섭',
    weapon:'늑대의 혈흔',      e4mat1:'스타게이트 버섯', e4mat2:'정합용 유체',
    skillMatA1:'타키온 차폐 구조체',    skillMatA2:'바위아겔로스 잎',
    skillMatB1:'초거리 빛 반사 파이프', skillMatB2:'바위아겔로스 잎' },
  { name:'탕탕',          rarity:6, class:'Caster',    element:'Cryo',     faction:'엔드필드 공업',      hobby:'자연',      hobby2:'창의',      expertise:'작전 기술',      expertise2:'민첩',
    weapon:'반항',             e4mat1:'피버섯',          e4mat2:'초거리 빛 반사 파이프',
    skillMatA1:'D96강 시제품 4번',      skillMatA2:'침식된 옥 잎',
    skillMatB1:'정합용 유체',           skillMatB2:'침식된 옥 잎' },
  { name:'이본',          rarity:6, class:'Striker',   element:'Cryo',     faction:'엔드필드 공업',      hobby:'패션',      hobby2:'과학기술',  expertise:'창의적인 생각',  expertise2:'조직관리',
    weapon:'예술의 폭군',      e4mat1:'피버섯',          e4mat2:'타키온 차폐 구조체',
    skillMatA1:'초거리 빛 반사 파이프', skillMatA2:'바위아겔로스 잎',
    skillMatB1:'D96강 시제품 4번',      skillMatB2:'바위아겔로스 잎' },
  { name:'장방이',        rarity:6, class:'Striker',   element:'Electric', faction:'홍산 과학원',        hobby:'공익',      hobby2:'문화',      expertise:'박학다식',       expertise2:'조직 관리',
    weapon:'고독한 나룻배',    e4mat1:'스타게이트 버섯', e4mat2:'3상 나노플레이크 칩',
    skillMatA1:'D96강 시제품 4번',      skillMatA2:'침식된 옥 잎',
    skillMatB1:'타키온 차폐 구조체',    skillMatB2:'침식된 옥 잎' },
  // 5성
  { name:'알레쉬',        rarity:5, class:'Vanguard',  element:'Cryo',     faction:'연맹 공단',          hobby:'문화',      hobby2:'운동',      expertise:'야외 생존',      expertise2:'전략 수립',
    weapon:'린수를 찾아서 3.0', e4mat1:'피버섯',         e4mat2:'초거리 빛 반사 파이프',
    skillMatA1:'정합용 유체',           skillMatA2:'바위아겔로스 잎',
    skillMatB1:'3상 나노플레이크 칩',   skillMatB2:'바위아겔로스 잎' },
  { name:'아크라이트',    rarity:5, class:'Vanguard',  element:'Electric', faction:'만물의 대지',        hobby:'자연',      hobby2:'운동',      expertise:'도구 제작',      expertise2:'자연 상식',
    weapon:'십이문',           e4mat1:'스타게이트 버섯', e4mat2:'초거리 빛 반사 파이프',
    skillMatA1:'D96강 시제품 4번',      skillMatA2:'바위아겔로스 잎',
    skillMatB1:'타키온 차폐 구조체',    skillMatB2:'바위아겔로스 잎' },
  { name:'아비웨나',      rarity:5, class:'Striker',   element:'Electric', faction:'탈로스 상인연합회',  hobby:'생활',      hobby2:'패션',      expertise:'교섭',           expertise2:'민첩',
    weapon:'중심력',           e4mat1:'피버섯',          e4mat2:'타키온 차폐 구조체',
    skillMatA1:'정합용 유체',           skillMatA2:'바위아겔로스 잎',
    skillMatB1:'3상 나노플레이크 칩',   skillMatB2:'바위아겔로스 잎' },
  { name:'진천우',        rarity:5, class:'Guard',     element:'Physical', faction:'엔드필드 공업',      hobby:'문화',      hobby2:'공익',      expertise:'박학다식',       expertise2:'창의적인 생각',
    weapon:'숭배의 시선',      e4mat1:'스타게이트 버섯', e4mat2:'정합용 유체',
    skillMatA1:'D96강 시제품 4번',      skillMatA2:'침식된 옥 잎',
    skillMatB1:'타키온 차폐 구조체',    skillMatB2:'침식된 옥 잎' },
  { name:'판',            rarity:5, class:'Striker',   element:'Physical', faction:'홍산 과학원',        hobby:'생활',      hobby2:'공익',      expertise:'요리',           expertise2:'도구 제작',
    weapon:'고대의 강줄기',    e4mat1:'피버섯',          e4mat2:'3상 나노플레이크 칩',
    skillMatA1:'초거리 빛 반사 파이프', skillMatA2:'바위아겔로스 잎',
    skillMatB1:'D96강 시제품 4번',      skillMatB2:'바위아겔로스 잎' },
  { name:'펠리카',        rarity:5, class:'Caster',    element:'Electric', faction:'엔드필드 공업',      hobby:'생활',      hobby2:'창의',      expertise:'조직 관리',      expertise2:'오리지늄 아츠',
    weapon:'망각',             e4mat1:'피버섯',          e4mat2:'타키온 차폐 구조체',
    skillMatA1:'초거리 빛 반사 파이프', skillMatA2:'침식된 옥 잎',
    skillMatB1:'D96강 시제품 4번',      skillMatB2:'침식된 옥 잎' },
  { name:'스노우샤인',    rarity:5, class:'Defender',  element:'Cryo',     faction:'로도스 아일랜드',    hobby:'운동',      hobby2:'공익',      expertise:'야외 생존',      expertise2:'의료 기술',
    weapon:'최후의 메아리',    e4mat1:'피버섯',          e4mat2:'정합용 유체',
    skillMatA1:'3상 나노플레이크 칩',   skillMatA2:'침식된 옥 잎',
    skillMatB1:'초거리 빛 반사 파이프', skillMatB2:'침식된 옥 잎' },
  { name:'울프가드',      rarity:5, class:'Caster',    element:'Heat',     faction:'엔드필드 공업',      hobby:'자연',      hobby2:'창의',      expertise:'작전 기술',      expertise2:'잠복',
    weapon:'이성적인 작별',    e4mat1:'스타게이트 버섯', e4mat2:'3상 나노플레이크 칩',
    skillMatA1:'타키온 차폐 구조체',    skillMatA2:'바위아겔로스 잎',
    skillMatB1:'정합용 유체',           skillMatB2:'바위아겔로스 잎' },
  { name:'자이히',        rarity:5, class:'Supporter', element:'Cryo',     faction:'고요한 수도회',      hobby:'과학기술',  hobby2:'지능 훈련', expertise:'박학다식',       expertise2:'정보 기술',
    weapon:'선교의 자유',      e4mat1:'피버섯',          e4mat2:'D96강 시제품 4번',
    skillMatA1:'타키온 차폐 구조체',    skillMatA2:'침식된 옥 잎',
    skillMatB1:'정합용 유체',           skillMatB2:'침식된 옥 잎' },
  // 4성
  { name:'아케쿠리',      rarity:4, class:'Vanguard',  element:'Heat',     faction:'엔드필드 공업',      hobby:'공익',      hobby2:'운동',      expertise:'조직 관리',      expertise2:'요리',
    weapon:'O.B.J. 엣지 오브 라이트', e4mat1:'스타게이트 버섯', e4mat2:'D96강 시제품 4번',
    skillMatA1:'3상 나노플레이크 칩',   skillMatA2:'침식된 옥 잎',
    skillMatB1:'초거리 빛 반사 파이프', skillMatB2:'침식된 옥 잎' },
  { name:'안탈',          rarity:4, class:'Supporter', element:'Electric', faction:'엔드필드 공업',      hobby:'지능 훈련', hobby2:'창의',      expertise:'도구 제작',      expertise2:'전황 분석',
    weapon:'O.B.J. 아츠 아이덴티티', e4mat1:'스타게이트 버섯', e4mat2:'초거리 빛 반사 파이프',
    skillMatA1:'D96강 시제품 4번',      skillMatA2:'침식된 옥 잎',
    skillMatB1:'타키온 차폐 구조체',    skillMatB2:'침식된 옥 잎' },
  { name:'카치르',        rarity:4, class:'Defender',  element:'Physical', faction:'엔드필드 공업',      hobby:'생활',      hobby2:'운동',      expertise:'도구 제작',      expertise2:'요리',
    weapon:'O.B.J. 헤비 버든', e4mat1:'피버섯',          e4mat2:'타키온 차폐 구조체',
    skillMatA1:'초거리 빛 반사 파이프', skillMatA2:'바위아겔로스 잎',
    skillMatB1:'D96강 시제품 4번',      skillMatB2:'바위아겔로스 잎' },
  { name:'에스텔라',      rarity:4, class:'Guard',     element:'Cryo',     faction:'엔드필드 공업',      hobby:'예술',      hobby2:'지능 훈련', expertise:'전략 수립',      expertise2:'잠복',
    weapon:'O.B.J. 스파이크',  e4mat1:'스타게이트 버섯', e4mat2:'정합용 유체',
    skillMatA1:'D96강 시제품 4번',      skillMatA2:'바위아겔로스 잎',
    skillMatB1:'타키온 차폐 구조체',    skillMatB2:'바위아겔로스 잎' },
  { name:'플루라이트',    rarity:4, class:'Caster',    element:'Nature',   faction:'엔드필드 공업',      hobby:'자연',      hobby2:'창의',      expertise:'야외 생존',      expertise2:'교섭',
    weapon:'O.B.J. 벨로시투스', e4mat1:'스타게이트 버섯', e4mat2:'3상 나노플레이크 칩',
    skillMatA1:'타키온 차폐 구조체',    skillMatA2:'침식된 옥 잎',
    skillMatB1:'정합용 유체',           skillMatB2:'침식된 옥 잎' },
];
const ELEMENT_COLOR = {
  Nature: '#4caf50', Electric: '#ab47bc', Heat: '#ef5350',
  Cryo: '#29b6f6', Physical: '#90a4ae',
};
const RARITY_COLOR = { 6: '#ffd740', 5: '#b39ddb', 4: '#4fc3f7' };
const CLASS_KR = {
  Guard:'가드', Striker:'스트라이커', Defender:'디펜더',
  Caster:'캐스터', Supporter:'서포터', Vanguard:'뱅가드',
};

let opFilterRarity = 'all';
let opFilterSearch = '';

// ========== 오퍼레이터 선택 모달 ==========
function openOperatorSelectModal() {
  opFilterRarity = 'all';
  opFilterSearch = '';
  const searchEl = document.getElementById('operator-search');
  if (searchEl) searchEl.value = '';
  document.querySelectorAll('.op-filter-btn').forEach(b => {
    b.style.background = b.textContent.includes('전체') ? 'var(--accent)' : 'transparent';
    b.style.color      = b.textContent.includes('전체') ? 'var(--bg)'     : b.dataset.color || 'var(--text-muted)';
  });
  renderOperatorSelectGrid();
  document.getElementById('modal-operator-select').style.display = 'block';
}

function closeOperatorSelectModal() {
  document.getElementById('modal-operator-select').style.display = 'none';
}

function filterOpRarity(btn, rarity) {
  opFilterRarity = rarity;
  document.querySelectorAll('.op-filter-btn').forEach(b => {
    const isMe = b === btn;
    b.style.background = isMe ? b.style.borderColor.replace('0.5','1').replace('rgba','rgba') : 'transparent';
    b.style.fontWeight  = isMe ? '700' : '400';
    b.style.opacity     = isMe ? '1' : '0.7';
  });
  renderOperatorSelectGrid();
}

function filterOperatorList(val) {
  opFilterSearch = val.toLowerCase();
  renderOperatorSelectGrid();
}

function renderOperatorSelectGrid() {
  const grid = document.getElementById('operator-select-grid');
  if (!grid) return;

  const list = OPERATOR_ROSTER.filter(op => {
    if (opFilterRarity !== 'all' && op.rarity !== parseInt(opFilterRarity)) return false;
    if (opFilterSearch && !op.name.toLowerCase().includes(opFilterSearch)) return false;
    return true;
  });

  if (list.length === 0) {
    grid.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:32px;font-size:12px;">검색 결과 없음</div>`;
    return;
  }

  const addedNames = new Set(operators.map(o => o.name));

  grid.innerHTML = `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
    ${list.map(op => {
      const rc = RARITY_COLOR[op.rarity];
      const ec = ELEMENT_COLOR[op.element];
      const isAdded = addedNames.has(op.name);
      return `<div onclick="${isAdded ? '' : `selectOperatorFromRoster('${op.name}')`}"
        style="border:1px solid ${isAdded ? 'rgba(240,200,22,0.4)' : 'rgba(255,255,255,0.12)'};border-radius:4px;padding:10px 8px;
          background:${isAdded ? 'rgba(240,200,22,0.08)' : 'rgba(255,255,255,0.04)'};
          cursor:${isAdded ? 'default' : 'pointer'};text-align:center;
          opacity:${isAdded ? '0.5' : '1'};
          transition:border-color 0.15s,background 0.15s;"
        ${isAdded ? '' : `onmouseenter="this.style.borderColor='var(--accent)';this.style.background='rgba(240,200,22,0.08)'"
          onmouseleave="this.style.borderColor='rgba(255,255,255,0.12)';this.style.background='rgba(255,255,255,0.04)'"` }>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:10px;font-weight:700;color:${rc};">★${op.rarity}</span>
          ${isAdded
            ? `<span style="font-size:9px;color:var(--accent);">추가됨</span>`
            : `<span style="width:8px;height:8px;border-radius:50%;background:${ec};display:inline-block;box-shadow:0 0 4px ${ec};"></span>`}
        </div>
        <div style="font-size:11px;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:4px;">${op.name}</div>
        <div style="font-size:10px;color:var(--text-muted);">${CLASS_KR[op.class] || op.class}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function selectOperatorFromRoster(name) {
  // 중복 추가 방지
  if (operators.find(o => o.name === name)) {
    showToast(`"${name}"은(는) 이미 목록에 있어요`, 'error');
    return;
  }
  const roster = OPERATOR_ROSTER.find(o => o.name === name);
  const op = getDefaultOperator(nextOperatorId++);
  op.name = name;
  if (roster) op.rarity = roster.rarity;
  operators.push(op);
  activeOperatorId = op.id;
  closeOperatorSelectModal();
  renderOperatorList();
  renderOperatorConfig();
  renderOperatorTotal();
  saveData();
}

// 오퍼레이터 데이터
let operators = [];
let activeOperatorId = null;
let nextOperatorId = 1;

function getDefaultOperator(id) {
  return {
    id, name: `오퍼레이터 ${id}`,
    currentElite: 0, targetElite: 4,
    currentLevel: 1, targetLevel: 90,
    skills: SKILL_TYPES.map(type => ({ type, currentLv: 1, targetLv: 12 })),
    talentNodes: TALENT_NODE_COST.map((n, i) => ({ idx: i, enabled: true })),
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
  (op.talentNodes || []).forEach(tn => {
    if (!tn.enabled) return;
    const node = TALENT_NODE_COST[tn.idx];
    if (!node) return;
    if (node.requireElite > tgtElite) return;
    node.mats.forEach(m => add(m.name, m.qty));
  });

  return result;
}

// 전체 오퍼레이터 합산
function calcTotalMats() {
  const total = {};
  operators.forEach(op => {
    const mats = calcOperatorMats(op);
    Object.entries(mats).forEach(([k, v]) => { total[k] = (total[k] || 0) + v; });
  });
  return total;
}

// ===== 렌더링 =====
function renderOperatorList() {
  const el = document.getElementById('operator-list');
  if (!el) return;
  const isMobile = window.innerWidth < 768;

  if (operators.length === 0) {
    el.innerHTML = isMobile
      ? `<div style="padding:8px 4px;color:var(--text-muted);font-size:11px;white-space:nowrap;">+ 추가로 오퍼레이터를 선택하세요</div>`
      : `<div class="empty-state" style="padding:24px;font-size:12px;">
          <div class="icon">👤</div>
          <div style="line-height:1.8;"><b>+ 추가</b> 버튼을 눌러<br>오퍼레이터를 선택하세요</div>
        </div>`;
    return;
  }

  if (isMobile) {
    // 모바일 — 가로 칩 (flex-wrap)
    el.innerHTML = operators.map(op => {
      const isActive = op.id === activeOperatorId;
      const rc = RARITY_COLOR[op.rarity] || 'var(--text-muted)';
      return `<div onclick="selectOperator(${op.id})"
        style="display:inline-flex;align-items:center;gap:5px;
          padding:5px 8px 5px 10px;cursor:pointer;flex-shrink:0;
          border-radius:4px;border:1px solid ${isActive ? 'var(--accent)' : 'rgba(255,255,255,0.1)'};
          background:${isActive ? 'rgba(240,200,22,0.12)' : 'rgba(255,255,255,0.04)'};
          transition:all 0.15s;">
        ${op.rarity ? `<span style="font-size:10px;font-weight:700;color:${rc};">★${op.rarity}</span>` : ''}
        <span style="font-size:12px;font-weight:600;color:${isActive ? 'var(--accent)' : 'var(--text)'};">${op.name}</span>
        <button onmousedown="deleteOperatorChip(event,${op.id})"
          style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:13px;line-height:1;padding:0 0 0 2px;">×</button>
      </div>`;
    }).join('');
  } else {
    // PC — 세로 목록
    el.innerHTML = operators.map(op => {
      const isActive = op.id === activeOperatorId;
      const mats = calcOperatorMats(op);
      const matCount = Object.keys(mats).length;
      const rc = RARITY_COLOR[op.rarity] || 'var(--text-muted)';
      return `<div onclick="selectOperator(${op.id})"
        style="padding:10px 12px;cursor:pointer;border-bottom:1px solid var(--border);
          background:${isActive ? 'rgba(240,200,22,0.09)' : 'transparent'};
          border-left:3px solid ${isActive ? 'var(--accent)' : 'transparent'};
          transition:background 0.15s;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:6px;">
            ${op.rarity ? `<span style="font-size:10px;font-weight:700;color:${rc};">★${op.rarity}</span>` : ''}
            <span style="font-size:12px;font-weight:600;color:${isActive ? 'var(--accent)' : 'var(--text)'};">${op.name}</span>
          </div>
        <button onmousedown="deleteOperatorChip(event,${op.id})"
            style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:14px;line-height:1;">×</button>
        </div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:3px;">
          E${op.currentElite}→E${op.targetElite} · Lv${op.currentLevel}→${op.targetLevel}
          ${matCount > 0 ? `· <span style="color:var(--accent2);">재료 ${matCount}종</span>` : ''}
        </div>
      </div>`;
    }).join('');
  }
}

function selectOperator(id) {
  activeOperatorId = id;
  renderOperatorList();
  renderOperatorConfig();
}

function addOperator() {
  openOperatorSelectModal();
}

async function deleteOperatorChip(e, id) {
  if (e) { e.stopPropagation(); e.preventDefault(); }
  const op = operators.find(o => o.id === id);
  if (!op) return;
  const ok = await dialogConfirm(`"${op.name}"을(를) 목록에서 제거할까요?`);
  if (!ok) return;
  operators = operators.filter(o => o.id !== id);
  if (activeOperatorId === id) {
    activeOperatorId = operators.length > 0 ? operators[operators.length - 1].id : null;
  }
  renderOperatorList();
  renderOperatorConfig();
  renderOperatorTotal();
  saveData();
}

function deleteOperator(id) {
  deleteOperatorChip(null, id);
}

function getActiveOp() { return operators.find(o => o.id === activeOperatorId); }

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

  // 재능 노드 체크박스
  const talentHtml = TALENT_NODE_COST.map((node, i) => {
    const tn = op.talentNodes?.[i] || { enabled: true };
    const available = node.requireElite <= op.targetElite;
    return `<label style="display:flex;align-items:center;gap:6px;padding:4px 0;cursor:${available ? 'pointer' : 'default'};opacity:${available ? 1 : 0.35};font-size:11px;">
      <input type="checkbox" ${tn.enabled ? 'checked' : ''} ${!available ? 'disabled' : ''}
        onchange="toggleTalentNode(${op.id},${i},this.checked)"
        style="accent-color:var(--accent);width:14px;height:14px;">
      <span style="color:var(--text);">${node.label}</span>
      <span style="color:var(--text-muted);font-size:10px;margin-left:auto;">E${node.requireElite} 필요</span>
    </label>`;
  }).join('');

  panel.innerHTML = `<div class="panel" style="padding:0;overflow:hidden;">
    <div style="padding:10px 14px;border-bottom:1px solid var(--border);background:rgba(240,200,22,0.06);display:flex;align-items:center;gap:10px;">
      <input value="${op.name}" style="background:transparent;border:none;border-bottom:1px solid var(--border);color:var(--text);font-size:14px;font-weight:700;outline:none;flex:1;"
        oninput="updateOpName(${op.id},this.value)">
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;border-bottom:1px solid var(--border);">
      <!-- 돌파 설정 -->
      <div style="padding:12px 14px;border-right:1px solid var(--border);">
        <div style="font-size:10px;font-weight:700;color:var(--accent2);letter-spacing:0.08em;margin-bottom:8px;">돌파 (Elite)</div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          ${[0,1,2,3,4].map(e => `
            <label style="display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;">
              <div style="display:flex;gap:2px;">
                <input type="radio" name="op-cur-elite-${op.id}" value="${e}" ${op.currentElite === e ? 'checked' : ''}
                  onchange="updateOpField(${op.id},'currentElite',${e})"
                  style="accent-color:var(--success);"> <span style="font-size:10px;color:var(--text-muted);">현재</span>
              </div>
              <div style="font-size:12px;font-weight:600;color:${op.currentElite===e||op.targetElite===e?'var(--accent)':'var(--text-muted)'};">E${e}</div>
              <div style="display:flex;gap:2px;">
                <input type="radio" name="op-tgt-elite-${op.id}" value="${e}" ${op.targetElite === e ? 'checked' : ''}
                  onchange="updateOpField(${op.id},'targetElite',${e})"
                  style="accent-color:var(--danger);"> <span style="font-size:10px;color:var(--text-muted);">목표</span>
              </div>
            </label>`).join('')}
        </div>
      </div>
      <!-- 레벨 설정 -->
      <div style="padding:12px 14px;">
        <div style="font-size:10px;font-weight:700;color:var(--accent2);letter-spacing:0.08em;margin-bottom:8px;">레벨</div>
        <div style="display:flex;align-items:center;gap:8px;">
          <div>
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:3px;">현재</div>
            <input type="number" min="1" max="90" value="${op.currentLevel}"
              class="ws-count-input" style="width:60px;"
              onchange="updateOpField(${op.id},'currentLevel',+this.value)">
          </div>
          <span style="color:var(--text-muted);margin-top:16px;">→</span>
          <div>
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:3px;">목표</div>
            <input type="number" min="1" max="90" value="${op.targetLevel}"
              class="ws-count-input" style="width:60px;"
              onchange="updateOpField(${op.id},'targetLevel',+this.value)">
          </div>
        </div>
        <div style="margin-top:8px;font-size:10px;color:var(--text-muted);">
          ${[20,40,60,80,90].map(cap => {
            const lv = op.targetLevel;
            return `<span style="color:${lv>=cap?'var(--accent)':'var(--text-muted)'};">Lv${cap}</span>`;
          }).join(' → ')}
        </div>
      </div>
    </div>

    <!-- 스킬 레벨 -->
    <div style="padding:12px 14px;border-bottom:1px solid var(--border);">
      <div style="font-size:10px;font-weight:700;color:var(--accent2);letter-spacing:0.08em;margin-bottom:8px;">스킬 레벨</div>
      <div style="display:grid;gap:8px;" class="skill-grid" style="grid-template-columns:repeat(4,1fr)">
        ${SKILL_TYPES.map((type, i) => {
          const sk = op.skills?.[i] || { currentLv:1, targetLv:9 };
          return `<div style="text-align:center;">
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">${type}</div>
            <div style="display:flex;align-items:center;gap:4px;justify-content:center;">
              <input type="number" min="1" max="12" value="${sk.currentLv}"
                class="ws-count-input" style="width:40px;font-size:12px;"
                onchange="updateSkillLv(${op.id},${i},'currentLv',+this.value)">
              <span style="color:var(--text-muted);font-size:10px;">→</span>
              <input type="number" min="1" max="12" value="${sk.targetLv}"
                class="ws-count-input" style="width:40px;font-size:12px;"
                onchange="updateSkillLv(${op.id},${i},'targetLv',+this.value)">
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- 재능 노드 -->
    <div style="padding:12px 14px;border-bottom:1px solid var(--border);">
      <div style="font-size:10px;font-weight:700;color:var(--accent2);letter-spacing:0.08em;margin-bottom:6px;">어빌리티 매트릭스 (재능/스킬 노드)</div>
      <div style="display:grid;gap:2px;" class="talent-grid" style="grid-template-columns:1fr 1fr 1fr">
        ${talentHtml}
      </div>
    </div>

    <!-- 필요 재료 -->
    <div style="padding:12px 14px;">
      <div style="font-size:10px;font-weight:700;color:var(--accent);letter-spacing:0.08em;margin-bottom:8px;">📦 필요 재료</div>
      ${matHtml}
    </div>
  </div>`;
}

function renderOperatorTotal() {
  const isMobile = window.innerWidth < 768;
  const mats = calcTotalMats();
  const hasMats = operators.length > 0 && Object.keys(mats).length > 0;
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
  const op = operators.find(o => o.id === id);
  if (op) { op.name = val; renderOperatorList(); renderOperatorTotal(); saveData(); }
}

function updateOpField(id, field, val) {
  const op = operators.find(o => o.id === id);
  if (!op) return;
  op[field] = val;

  // 역전 방지
  if (field === 'currentElite' && op.currentElite > op.targetElite)  op.targetElite  = op.currentElite;
  if (field === 'targetElite'  && op.targetElite  < op.currentElite) op.currentElite = op.targetElite;
  if (field === 'currentLevel' && op.currentLevel > op.targetLevel)  op.targetLevel  = op.currentLevel;
  if (field === 'targetLevel'  && op.targetLevel  < op.currentLevel) op.currentLevel = op.targetLevel;

  // 범위 제한
  op.currentLevel = Math.max(1, Math.min(90, op.currentLevel || 1));
  op.targetLevel  = Math.max(1, Math.min(90, op.targetLevel  || 1));

  renderOperatorList();
  renderOperatorConfig();
  renderOperatorTotal();
  saveData();
}

function updateSkillLv(id, idx, field, val) {
  const op = operators.find(o => o.id === id);
  if (!op || !op.skills[idx]) return;
  op.skills[idx][field] = Math.max(1, Math.min(12, val));

  // 역전 방지
  if (field === 'currentLv' && op.skills[idx].currentLv > op.skills[idx].targetLv)
    op.skills[idx].targetLv = op.skills[idx].currentLv;
  if (field === 'targetLv'  && op.skills[idx].targetLv  < op.skills[idx].currentLv)
    op.skills[idx].currentLv = op.skills[idx].targetLv;

  renderOperatorList();
  renderOperatorConfig();
  renderOperatorTotal();
  saveData();
}

function toggleTalentNode(id, idx, checked) {
  const op = operators.find(o => o.id === id);
  if (!op) return;
  if (!op.talentNodes) op.talentNodes = TALENT_NODE_COST.map((_,i) => ({ idx: i, enabled: true }));
  op.talentNodes[idx].enabled = checked;
  renderOperatorList();
  renderOperatorConfig();
  renderOperatorTotal();
  saveData();
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
    item.textContent = opt.label;
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
    dropdown.style.top = (rect.bottom + 2) + 'px';
    dropdown.style.maxHeight = Math.min(220, spaceBelow - 8) + 'px';
  } else {
    // 위로 펼치기
    dropdown.style.bottom = (window.innerHeight - rect.top + 2) + 'px';
    dropdown.style.top = 'auto';
    dropdown.style.maxHeight = Math.min(220, spaceAbove - 8) + 'px';
  }

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
      labelEl.textContent = isPlaceholder ? container._csPlaceholder : label;
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

// 스크롤 시 드롭다운 닫기
window.addEventListener('scroll', closeAllCustomSelects, true);

function closeAllCustomSelects() {
  document.querySelectorAll('.custom-select-dropdown').forEach(d => d.remove());
  document.querySelectorAll('.custom-select-btn.open').forEach(b => b.classList.remove('open'));
}

// ========== 관리권 교환 계산 → 공장 설비 자동 계산 ==========
async function autoCalcFactory(oId) {
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

