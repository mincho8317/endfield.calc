// ========== 설비 목록 ==========
const EQUIPMENT_LIST = [
  // 합성과 제작
  { id: 'e01', name: '반응기',       category: '합성과 제작' },
  { id: 'e02', name: '성형기',       category: '합성과 제작' },
  { id: 'e03', name: '연마기',       category: '합성과 제작' },
  { id: 'e04', name: '정련로',       category: '합성과 제작' },
  { id: 'e05', name: '정제기',       category: '합성과 제작' },
  { id: 'e06', name: '포장기',       category: '합성과 제작' },
  { id: 'e07', name: '충진기',       category: '합성과 제작' },
  { id: 'e08', name: '확장 반응기',  category: '합성과 제작' },
  { id: 'e09', name: '분쇄기',       category: '합성과 제작' },
  { id: 'e10', name: '장비 부품 합성기', category: '합성과 제작' },
  { id: 'e11', name: '분해기',       category: '합성과 제작' },

  // 기초 생산
  { id: 'e12', name: '천화로',       category: '기초 생산' },
  { id: 'e13', name: '부품가공기',   category: '기초 생산' },
  { id: 'e14', name: '씨앗 추출기', category: '기초 생산' },
  { id: 'e15', name: '재배기',       category: '기초 생산' },
  { id: 'e16', name: '오염수 처리기', category: '기초 생산' },

  // 자원 채집
  { id: 'e17', name: '채굴기',       category: '자원 채집' },

  // 전력
  { id: 'e18', name: '석탄 발전기',  category: '전력' },
  { id: 'e19', name: '오리지늄 발전기', category: '전력' },
  { id: 'e20', name: '풍력 발전기',  category: '전력' },
  { id: 'e21', name: '태양광 패널',  category: '전력' },
  { id: 'e22', name: '지열 발전기',  category: '전력' },
  { id: 'e23', name: '수력 발전기',  category: '전력' },
  { id: 'e24', name: '핵융합 발전기', category: '전력' },

  // 저장고 입출력
  { id: 'e25', name: '소형 창고',    category: '저장고 입출력' },
  { id: 'e26', name: '중형 창고',    category: '저장고 입출력' },
  { id: 'e27', name: '대형 창고',    category: '저장고 입출력' },
  { id: 'e28', name: '액체 저장고',  category: '저장고 입출력' },
  { id: 'e29', name: '기체 저장고',  category: '저장고 입출력' },
  { id: 'e30', name: '입력 포트',    category: '저장고 입출력' },
  { id: 'e31', name: '출력 포트',    category: '저장고 입출력' },

  // 물류
  { id: 'e32', name: '컨베이어 벨트', category: '물류' },
  { id: 'e33', name: '분배기',       category: '물류' },
  { id: 'e34', name: '합류기',       category: '물류' },
  { id: 'e35', name: '승강기',       category: '물류' },
  { id: 'e36', name: '드론 포트',    category: '물류' },
];

// ========== 레시피 ==========
const RECIPES = [
  { id:0,  equip:'천화로',     category:'기초 생산',    label:'중식양 제조',           inputs:[{name:'식양',qty:10},{name:'양정폐액',qty:5}],               outputs:[{name:'중식양',qty:1}],                                   speed:10 },
  { id:1,  equip:'천화로',     category:'기초 생산',    label:'식양 제조 (카본)',       inputs:[{name:'카본',qty:2},{name:'청정수',qty:1}],                   outputs:[{name:'식양',qty:1}],                                     speed:2  },
  { id:2,  equip:'반응기',     category:'합성과 제작',  label:'액화식양 제조',          inputs:[{name:'식양',qty:1},{name:'청정수',qty:1}],                   outputs:[{name:'액화식양',qty:1}],                                 speed:2  },
  { id:3,  equip:'반응기',     category:'합성과 제작',  label:'양정폐액+불양정폐액',    inputs:[{name:'액화식양',qty:1},{name:'오염수',qty:1}],               outputs:[{name:'양정폐액',qty:1},{name:'불양정폐액',qty:1}],        speed:2  },
  { id:4,  equip:'반응기',     category:'합성과 제작',  label:'양정 제조',              inputs:[{name:'양정폐액',qty:2},{name:'페리움 광석',qty:1}],          outputs:[{name:'양정',qty:1},{name:'오염수',qty:1}],                speed:2  },
  { id:5,  equip:'반응기',     category:'합성과 제작',  label:'적동용액 제조',          inputs:[{name:'적동',qty:1},{name:'산성침적물',qty:1}],               outputs:[{name:'적동용액',qty:1}],                                 speed:2  },
  { id:6,  equip:'반응기',     category:'합성과 제작',  label:'혁동 제조',              inputs:[{name:'혁동용액',qty:2},{name:'페리움 광석',qty:1}],          outputs:[{name:'혁동',qty:1},{name:'오염수',qty:1}],                speed:2  },
  { id:7,  equip:'연마기',     category:'합성과 제작',  label:'고운오리지늄 제조',      inputs:[{name:'오리지늄 광석',qty:2}],                               outputs:[{name:'고운오리지늄',qty:1}],                             speed:2  },
  { id:8,  equip:'포장기',     category:'합성과 제작',  label:'중용량 배터리',          inputs:[{name:'양정',qty:5},{name:'고운오리지늄',qty:20}],            outputs:[{name:'중용량 배터리',qty:1}],                            speed:10 },
  { id:9,  equip:'포장기',     category:'합성과 제작',  label:'고금청',                 inputs:[{name:'적동',qty:20}],                                       outputs:[{name:'고금청',qty:1}],                                   speed:10 },
  { id:10, equip:'정련로',     category:'합성과 제작',  label:'적동 정련',              inputs:[{name:'적동 광석',qty:1},{name:'청정수',qty:1}],              outputs:[{name:'적동',qty:1},{name:'오염수',qty:1}],                speed:2  },
  { id:11, equip:'정제기',     category:'합성과 제작',  label:'혁동용액+산성침적물',    inputs:[{name:'적동용액',qty:4}],                                    outputs:[{name:'혁동용액',qty:1},{name:'산성침적물',qty:1}],        speed:2  },
  { id:12, equip:'정제기',     category:'합성과 제작',  label:'양정폐액+청정수',        inputs:[{name:'불양정폐액',qty:4}],                                  outputs:[{name:'양정폐액',qty:1},{name:'청정수',qty:1}],            speed:2  },
  { id:13, equip:'채굴기',     category:'자원 채집',    label:'오리지늄 채굴',          inputs:[],                                                           outputs:[{name:'오리지늄 광석',qty:1}],                            speed:1, mineRate:480 },
  { id:14, equip:'채굴기',     category:'자원 채집',    label:'페리움 광석 채굴',       inputs:[],                                                           outputs:[{name:'페리움 광석',qty:1}],                              speed:1, mineRate:90  },
  { id:15, equip:'채굴기',     category:'자원 채집',    label:'적동 광석 채굴',         inputs:[],                                                           outputs:[{name:'적동 광석',qty:1}],                                speed:1, mineRate:180 },
  { id:16, equip:'부품가공기', category:'기초 생산',    label:'혁동부품 가공',          inputs:[{name:'혁동',qty:5}],                                        outputs:[{name:'혁동부품',qty:1}],                                 speed:10 },
  { id:17, equip:'성형기',     category:'합성과 제작',  label:'중식양병 성형',          inputs:[{name:'중식양',qty:1}],                                      outputs:[{name:'중식양병',qty:2}],                                 speed:20 },
  { id:18, equip:'부품가공기', category:'기초 생산',    label:'중식양부품 가공',        inputs:[{name:'중식양',qty:1}],                                      outputs:[{name:'중식양부품',qty:2}],                               speed:20 },
  { id:19, equip:'포장기',     category:'합성과 제작',  label:'옥동발산기',             inputs:[{name:'중식양부품',qty:1},{name:'혁동',qty:1}],               outputs:[{name:'옥동발산기',qty:1}],                               speed:10 },
  { id:20, equip:'포장기',     category:'합성과 제작',  label:'식양옥호리병',           inputs:[{name:'중식양병',qty:1},{name:'옥동발산기',qty:1}],           outputs:[{name:'식양옥호리병',qty:1}],                             speed:10 },
  { id:21, equip:'포장기',     category:'합성과 제작',  label:'식양호리병',             inputs:[{name:'식양',qty:15}],                                       outputs:[{name:'식양호리병',qty:1}],                               speed:10 },
];
window.RECIPES = RECIPES;
window.EQUIPMENT_LIST = EQUIPMENT_LIST;

// ========== 자원 직접입력 ==========
const RESOURCE_ITEMS = [
  { key:'오리지늄 광석', label:'오리지늄 광석' },
  { key:'자수정 광석',   label:'자수정 광석'   },
  { key:'페리움 광석',   label:'페리움 광석'   },
  { key:'적동 광석',     label:'적동 광석'     },
  { key:'청정수',        label:'청정수'        },
  { key:'산성침적물',    label:'산성침적물'    },
];

// ========== 관리권 교환 가치 ==========
const AUTH_VALUE = {
  '중용량 배터리': 54, '고야주': 22, '혁동부품': 48,
  '중식양': 27, '고금청': 22, '식양': 1,
  '적동부품': 1, '야주': 16, '식양호리병': 40, '식양옥호리병': 120
};
