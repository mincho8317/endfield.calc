const ESSENCE_PRIMARY = ['민첩 강화','힘 강화','의지 강화','지성 강화','주속성 강화'];
const ESSENCE_SECONDARY = ['공격 강화','HP 강화','물리피해 강화','열 피해 강화','전기 피해 강화',
  '냉기 피해 강화','자연 피해 강화','치명타율 강화','기예강도 강화','궁극기 획득 강화','기예피해 강화','치료효율 강화'];
const ESSENCE_SKILLS = ['강습','억압','추격','분쇄','고무','전투','잔혹','주입','치료','파열','기폭','황혼','흐름','효능'];

// 파밍처 (강화 에너지 충적지) — 스킬만 장소마다 고정, 주속성·보조속성은 전체 공통
const ALLUVIUMS = [
  { id:'science_park', region:'4번 협곡', name:'오리지늄 사이언스 파크',
    skills:['강습','억압','추격','분쇄','전투','기폭','흐름','효능'] },
  { id:'lodespring',   region:'4번 협곡', name:'오리진 로드스프링',
    skills:['억압','추격','고무','전투','주입','치료','파열','효능'] },
  { id:'power_plateau',region:'4번 협곡', name:'파워 플래토',
    skills:['강습','억압','전투','잔혹','주입','기폭','황혼','효능'] },
  { id:'the_hub',      region:'4번 협곡', name:'더 허브',
    skills:['추격','분쇄','고무','잔혹','주입','치료','파열','흐름'] },
  { id:'wuling_city',  region:'무릉',     name:'우링 시티',
    skills:['강습','분쇄','잔혹','치료','파열','기폭','황혼','흐름'] },
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

// 파밍처에서 특정 스킬을 드롭하는 장소 찾기
function getAlluviumsBySkill(skill) {
  return ALLUVIUMS.filter(a => a.skills.includes(skill));
}

// 무기와 매칭되는 파밍처 찾기
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
  createCustomSelect('cs-ec-primary',
    ESSENCE_PRIMARY.map(p => ({ value: p, label: p })),
    '', () => renderEssenceCheck(), '— 주속성 선택 —');
  createCustomSelect('cs-ec-secondary',
    ESSENCE_SECONDARY.map(s => ({ value: s, label: s })),
    '', () => renderEssenceCheck(), '— 보조속성 선택 —');
  createCustomSelect('cs-ec-skill',
    ESSENCE_SKILLS.map(s => ({ value: s, label: s })),
    '', () => renderEssenceCheck(), '— 스킬 선택 —');
  createCustomSelect('cs-ew-select',
    WEAPON_DATA.map((w, i) => ({
      value: String(i),
      label: `★${w.rarity} ${w.operator}${w.name !== '(미확인)' ? ' · ' + w.name : ''} (${w.type})`
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

  const matched = WEAPON_DATA.filter(w => {
    const pMatch = !pri || w.primary === pri;
    const sMatch = !sec || w.secondary === sec;
    const kMatch = !sk  || w.skill === sk;
    return pMatch && sMatch && kMatch;
  });

  if (matched.length === 0) {
    el.innerHTML = `<div class="empty-state" style="padding:24px;"><div class="icon">🔍</div>매칭되는 무기가 없어요<br><span style="font-size:11px;color:var(--text-label);">특성 조합을 바꿔보세요</span></div>`;
    return;
  }

  const matchCount = [pri,sec,sk].filter(Boolean).length;
  el.innerHTML = `
    <div style="font-size:11px;color:var(--text-label);margin-bottom:8px;">
      ${matchCount}개 특성 선택 →
      <b style="color:var(--accent);">${matched.length}개</b> 무기 매칭
      ${matchCount===3 ? '<span style="color:var(--success);margin-left:4px;">✓ 완벽 매칭!</span>' : ''}
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;">
      ${matched.map(w => weaponCard(w, pri, sec, sk)).join('')}
    </div>`;
}

// ========== ② 무기별 파밍처 + 한번에 파밍 통합 ==========
function renderWeaponFarming() {
  const idx = document.getElementById('cs-ew-select')?._csSelected;
  const el  = document.getElementById('ew-result');
  if (!el || idx === '') return;
  const w = WEAPON_DATA[parseInt(idx)];
  if (!w) return;

  if (!w.primary && !w.secondary && !w.skill) {
    el.innerHTML = `<div class="empty-state" style="padding:24px;"><div class="icon">⚠</div>이 무기의 기질 데이터가 아직 미확인이에요<br><span style="font-size:11px;color:var(--text-label);">엑셀 DB에 입력 후 반영해주세요</span></div>`;
    return;
  }

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

  // 2. 파밍처 리스트 (스킬 기준, 모든 파밍처 표시 + 추천 표시)
  const alluviums = w.skill ? getBestAlluviumsForWeapon(w) : ALLUVIUMS;
  const notFoundSkill = w.skill && alluviums.length === 0;

  const alluviumsHtml = (notFoundSkill
    ? `<div style="font-size:11px;color:var(--danger);padding:8px 0;">⚠ 이 스킬을 드롭하는 파밍처가 없어요 — 데이터를 확인해주세요</div>`
    : alluviums.map(a => {
        // 한번에 파밍 가능한 무기: 같은 파밍처에서 스킬이 드롭되는 다른 무기
        const bundleWeapons = WEAPON_DATA.filter(bw =>
          bw !== w &&
          bw.skill &&
          a.skills.includes(bw.skill)
        );

        const bundleHtml = bundleWeapons.length > 0
          ? `<div style="margin-top:10px;padding-top:10px;border-top:1px dashed rgba(255,255,255,0.09);">
              <div style="font-size:10px;font-weight:700;color:var(--accent2);margin-bottom:6px;">
                📦 한번에 파밍 가능한 무기 (${bundleWeapons.length}개)
              </div>
              <div style="display:flex;flex-direction:column;gap:4px;">
                ${bundleWeapons.map(bw => weaponCard(bw, null, null, bw.skill)).join('')}
              </div>
            </div>`
          : `<div style="margin-top:8px;font-size:10px;color:var(--text-muted);">이 장소에서 함께 파밍 가능한 다른 무기 없음</div>`;

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
      <span style="font-size:18px;font-weight:700;color:${rarityColor(w.rarity)};">★${w.rarity}</span>
      <div>
        <div style="font-size:14px;font-weight:700;color:var(--text);">${w.operator}</div>
        <div style="font-size:11px;color:var(--text-label);">${w.type}${w.name !== '(미확인)' ? ' · '+w.name : ''}</div>
      </div>
    </div>

    ${statsHtml}

    <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:8px;">
      파밍처 목록
      ${w.skill ? `<span style="color:var(--text-muted);font-weight:400;margin-left:4px;">— 스킬 <b style="color:#80FF80;">${w.skill}</b> 기준</span>` : ''}
    </div>
    ${alluviumsHtml}
    <div style="font-size:10px;color:var(--text-muted);margin-top:8px;">
      ※ 주속성·보조속성은 모든 파밍처에서 랜덤 드롭돼요. 스킬 특성이 나오는 장소를 선택해야 해요.
    </div>`;
}

// ========== 공통 헬퍼 ==========
function rarityColor(r) {
  return r===6 ? '#ffd740' : r===5 ? '#b39ddb' : '#4fc3f7';
}

function alluviumTag(a) {
  return `<div style="border:1px solid rgba(240,200,22,0.18);border-radius:4px;padding:8px 12px;background:rgba(240,200,22,0.05);">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div>
        <span style="font-size:12px;font-weight:700;color:var(--accent);">${a.name}</span>
        <span style="font-size:10px;color:var(--text-muted);margin-left:6px;">${a.region}</span>
      </div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:6px;">
      ${a.skills.map(s => `<span style="font-size:10px;padding:1px 6px;border-radius:4px;background:rgba(128,255,128,0.1);color:#80FF80;border:1px solid rgba(128,255,128,0.25);">${s}</span>`).join('')}
    </div>
  </div>`;
}

function weaponCard(w, hiPri, hiSec, hiSk) {
  const rc = rarityColor(w.rarity);
  const priMatch = hiPri && w.primary === hiPri;
  const secMatch = hiSec && w.secondary === hiSec;
  const skMatch  = hiSk  && w.skill === hiSk;
  const allMatch = (!hiPri || priMatch) && (!hiSec || secMatch) && (!hiSk || skMatch);
  const isUnknown = !w.primary && !w.secondary && !w.skill;

  return `<div style="border:1px solid rgba(30,58,95,${allMatch?'0.8':'0.4'});border-radius:4px;padding:8px 12px;
    background:${allMatch?'rgba(240,200,22,0.05)':'rgba(255,255,255,0.04)'};">
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
      <span style="font-size:11px;font-weight:700;color:${rc};">★${w.rarity}</span>
      <span style="font-size:12px;font-weight:600;color:var(--text);">${w.operator}</span>
      <span style="font-size:10px;color:var(--text-muted);">${w.type}</span>
      ${w.name !== '(미확인)' ? `<span style="font-size:10px;color:var(--accent2);">${w.name}</span>` : ''}
      ${isUnknown ? `<span style="font-size:9px;padding:1px 6px;border-radius:4px;background:rgba(255,170,0,0.15);color:var(--warning);">데이터 미확인</span>` : ''}
    </div>
    ${!isUnknown ? `<div style="display:flex;gap:6px;margin-top:5px;flex-wrap:wrap;">
      <span style="font-size:10px;padding:1px 7px;border-radius:4px;background:rgba(79,195,247,${priMatch?'0.2':'0.06'});color:#4FC3F7;border:1px solid rgba(79,195,247,${priMatch?'0.5':'0.2'});">${w.primary||'—'}</span>
      <span style="font-size:10px;padding:1px 7px;border-radius:4px;background:rgba(255,213,128,${secMatch?'0.2':'0.06'});color:#FFD580;border:1px solid rgba(255,213,128,${secMatch?'0.5':'0.2'});">${w.secondary||'—'}</span>
      <span style="font-size:10px;padding:1px 7px;border-radius:4px;background:rgba(128,255,128,${skMatch?'0.2':'0.06'});color:#80FF80;border:1px solid rgba(128,255,128,${skMatch?'0.5':'0.2'});">${w.skill||'—'}</span>
    </div>` : ''}
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
      '<div style="display:flex;gap:6px;" id="feedback-type-btns">' +
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
              footer: { text: 'Endfield Factory Calc • ' + now }
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

// ── 업데이트 이력 ──────────────────────────────────────────
