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
