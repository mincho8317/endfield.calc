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
