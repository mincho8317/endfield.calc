// ========== 공장 배치 — 설비 크기·포트 데이터 (1단계 샘플 8종) ==========
// 좌표계: (row, col) — 설비 본체 좌상단을 (0,0)으로 하는 상대좌표, row는 위→아래, col은 왼→오른쪽
// rotation 0(기본 방향) 기준. 회전 시 좌표는 런타임에서 90도 단위로 회전 변환
// portType: 'logistics'(물류·컨베이어) | 'liquid'(액체·파이프)
// portDir: 'in'(입력) | 'out'(출력)
// size: { w: 가로칸수, h: 세로칸수 }

const EQUIPMENT_LAYOUT = {
  '천화로': {
    category: '합성 및 제작',
    size: { w: 5, h: 5 },
    ports: [
      { type: 'liquid',     dir: 'in',  row: 0, col: 2 },
      { type: 'logistics',  dir: 'in',  row: 1, col: 0 },
      { type: 'logistics',  dir: 'out', row: 1, col: 4 },
      { type: 'logistics',  dir: 'in',  row: 3, col: 0 },
      { type: 'logistics',  dir: 'out', row: 3, col: 4 },
    ],
  },
  '정련로': {
    category: '기초 생산',
    size: { w: 3, h: 3 },
    ports: [
      { type: 'logistics', dir: 'in',  row: 0, col: 0 },
      { type: 'logistics', dir: 'in',  row: 1, col: 0 },
      { type: 'logistics', dir: 'in',  row: 2, col: 0 },
      { type: 'logistics', dir: 'out', row: 0, col: 2 },
      { type: 'logistics', dir: 'out', row: 1, col: 2 },
      { type: 'logistics', dir: 'out', row: 2, col: 2 },
    ],
    note: '청정수 사용 모드(액체 포트 추가)와 미사용 모드 2가지 존재 — 액체 포트 데이터는 추후 업데이트 예정',
  },
  '분쇄기': {
    category: '기초 생산',
    size: { w: 3, h: 3 },
    ports: [
      { type: 'logistics', dir: 'in',  row: 0, col: 0 },
      { type: 'logistics', dir: 'in',  row: 1, col: 0 },
      { type: 'logistics', dir: 'in',  row: 2, col: 0 },
      { type: 'logistics', dir: 'out', row: 0, col: 2 },
      { type: 'logistics', dir: 'out', row: 1, col: 2 },
      { type: 'logistics', dir: 'out', row: 2, col: 2 },
    ],
  },
  '부품 가공기': {
    category: '기초 생산',
    size: { w: 3, h: 3 },
    ports: [
      { type: 'logistics', dir: 'in',  row: 0, col: 0 },
      { type: 'logistics', dir: 'in',  row: 1, col: 0 },
      { type: 'logistics', dir: 'in',  row: 2, col: 0 },
      { type: 'logistics', dir: 'out', row: 0, col: 2 },
      { type: 'logistics', dir: 'out', row: 1, col: 2 },
      { type: 'logistics', dir: 'out', row: 2, col: 2 },
    ],
  },
  '성형기': {
    category: '기초 생산',
    size: { w: 3, h: 6 },
    ports: [
      { type: 'logistics', dir: 'in',  row: 0, col: 0 },
      { type: 'logistics', dir: 'in',  row: 1, col: 0 },
      { type: 'logistics', dir: 'in',  row: 2, col: 0 },
      { type: 'logistics', dir: 'in',  row: 3, col: 0 },
      { type: 'logistics', dir: 'in',  row: 4, col: 0 },
      { type: 'logistics', dir: 'in',  row: 5, col: 0 },
      { type: 'logistics', dir: 'out', row: 0, col: 2 },
      { type: 'logistics', dir: 'out', row: 1, col: 2 },
      { type: 'logistics', dir: 'out', row: 2, col: 2 },
      { type: 'logistics', dir: 'out', row: 3, col: 2 },
      { type: 'logistics', dir: 'out', row: 4, col: 2 },
      { type: 'logistics', dir: 'out', row: 5, col: 2 },
    ],
  },
  '재배기': {
    category: '기초 생산',
    size: { w: 5, h: 5 },
    ports: [
      { type: 'logistics', dir: 'in',  row: 0, col: 0 },
      { type: 'logistics', dir: 'in',  row: 1, col: 0 },
      { type: 'logistics', dir: 'in',  row: 2, col: 0 },
      { type: 'logistics', dir: 'in',  row: 3, col: 0 },
      { type: 'logistics', dir: 'in',  row: 4, col: 0 },
      { type: 'logistics', dir: 'out', row: 0, col: 4 },
      { type: 'logistics', dir: 'out', row: 1, col: 4 },
      { type: 'logistics', dir: 'out', row: 2, col: 4 },
      { type: 'logistics', dir: 'out', row: 3, col: 4 },
      { type: 'logistics', dir: 'out', row: 4, col: 4 },
    ],
  },
  '씨앗 추출기': {
    category: '기초 생산',
    size: { w: 5, h: 5 },
    ports: [
      { type: 'logistics', dir: 'in',  row: 0, col: 0 },
      { type: 'logistics', dir: 'in',  row: 1, col: 0 },
      { type: 'logistics', dir: 'in',  row: 2, col: 0 },
      { type: 'logistics', dir: 'in',  row: 3, col: 0 },
      { type: 'logistics', dir: 'in',  row: 4, col: 0 },
      { type: 'logistics', dir: 'out', row: 0, col: 4 },
      { type: 'logistics', dir: 'out', row: 1, col: 4 },
      { type: 'logistics', dir: 'out', row: 2, col: 4 },
      { type: 'logistics', dir: 'out', row: 3, col: 4 },
      { type: 'logistics', dir: 'out', row: 4, col: 4 },
    ],
  },
  '오염수 처리기': {
    category: '기초 생산',
    size: { w: 3, h: 3 },
    ports: [
      { type: 'liquid', dir: 'in', row: 1, col: 0 },
    ],
  },
};

window.EQUIPMENT_LAYOUT = EQUIPMENT_LAYOUT;
