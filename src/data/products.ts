export interface Product {
  id: string;
  name: string;
  barcode?: string;
  group: string;
  brand?: string;
  notes: string[];
  tags?: string[];
  images?: { src: string; alt: string }[];
}

export interface ProductGroup {
  id: string;
  name: string;
  emoji: string;
  description: string;
  notices?: string[];
}

export const productGroups: ProductGroup[] = [
  {
    id: 'figure', name: '피규어/토이', emoji: '🧸',
    description: '피규어, 인형, 블라인드박스 등 토이 상품',
    notices: [
      '랜덤상품은 교환/환불 불가 — 안내 멘트: "랜덤 상품은 교환/환불이 불가하고, 안에 거치하는 부품이 매우 작으니 분실 위험이 있어 조심히 개봉해 주세요"',
      '교환 가능 케이스: 카드 누락, 다른 카드 혼입, 개봉 직후 파손',
      '교환 시 동일 캐릭터 나오지 않을 수 있음 안내 필수',
      '풀박스 구매 시 전 종 포함(시크릿 제외), 낮은 확률로 랜덤 중복 가능 → 사전 고지',
      '피규어 샘플은 글루건으로 고정, 수시 확인 필요',
      '샘플 상품은 절대 판매 금지',
    ],
  },
  {
    id: 'stationery', name: '문구/스티커', emoji: '✏️',
    description: '노트, 펜, 스티커, 마스킹테이프 등',
    notices: [
      '대부분 방수 아님 — 고객 문의 시 안내',
      '스티커류 직사광선 장시간 노출 시 변색 가능',
      '비닐 포장 약한 상품 — 진열 시 소량만, 뜯어진 건 OPP 재포장 후 판매',
    ],
  },
  {
    id: 'accessory', name: '액세서리/키링', emoji: '🔑',
    description: '키링, 키캡, 뱃지, 밴드 등 액세서리',
    notices: [
      '키캡은 원래 분리 가능하게 제작됨 — 구매 후 파츠 분실은 교환 불가',
      '개봉 직후 파츠가 없었던 경우에만 교환 가능',
      '금속 소재 상품은 수분/땀 접촉 시 변색 가능 안내',
      '워치 스트랩은 갤럭시/애플 구분 및 바코드 확인 필수',
      '2way 탈부착형 상품은 구조상 캐릭터 파츠가 분리될 수 있음 — 분리만으로는 환불 불가 안내',
    ],
  },
  {
    id: 'living', name: '리빙/잡화', emoji: '🏠',
    description: '머그컵, 쿠션, 파우치, 담요 등 생활용품',
    notices: [
      '컵류 — 교환/환불 어려움, 현장 확인 필수. 안내 멘트: "컵은 교환/환불이 어려우니 현장에서 확인 부탁드립니다"',
      '금박/은박 인쇄 컵 — 전자레인지 사용 불가',
      '컵/텀블러 — 식기세척기·전자레인지 가능 여부 상품별 확인 후 안내',
      '쿠션/담요 — 세탁 방법 안내 (손세탁 권장)',
    ],
  },
  {
    id: 'bag', name: '가방/파우치', emoji: '👜',
    description: '파우치, 크로스백, 에코백 등',
    notices: [
      '색상 차이 가능 — 모니터와 실물 색상 차이 안내',
      '원단 특성상 미세한 실밥 있을 수 있음 — 실밥 제거 후 OPP 재포장 판매 가능',
    ],
  },
  {
    id: 'camera', name: '카메라/전자', emoji: '📷',
    description: '토이카메라, 전자제품 등',
    notices: [
      '토이카메라 — 메모리카드(SD카드) 별도 구매 필요, A/S는 스모어몰 온라인 사이트 문의',
      '토이카메라 — 16gb ~ 32gb 메모리카드만 장착 가능하며, 그 이상 용량은 인식되지 않을 수 있어요.',
      '토이카메라 — 완충 후 연속 사용은 약 3시간 정도 가능하고, 자동 전원 꺼짐 기능이 있어 실제 사용 시간은 6시간 이상으로 안내할 수 있어요.',
      '전자제품 특성상 개봉 후 단순 변심 환불 불가',
      '배터리 상태 수시 확인 필수',
    ],
  },
];

export const products: Product[] = [
  // 피규어/토이
  {
    id: 'hanbok-random-figure',
    name: '디즈니 한복랜덤피규어 미키와친구들',
    barcode: '8809923817021',
    group: 'figure',
    brand: '디즈니',
    notes: [
      '풀박스(6종) 구매 시 히든 포함 중복 없이 구성',
      '색칠 벗겨짐 불량 사례 있음 → 교환 처리',
    ],
    tags: ['디즈니', '한복', '미키', '랜덤', '피규어'],
  },
  {
    id: 'zootopia-marshmallow',
    name: '디즈니 주토피아 마시멜로우 피규어',
    barcode: '6958985051873',
    group: 'figure',
    brand: '디즈니/픽사',
    notes: [
      '부러짐 불량 발생 사례 있음 — 개봉 직후 파손 시 교환',
    ],
    tags: ['주토피아', '마시멜로우', '피규어', '랜덤'],
  },
  {
    id: 'zootopia-best-partner',
    name: '주토피아 베스트 파트너',
    barcode: '6958985018432',
    group: 'figure',
    brand: '디즈니/픽사',
    notes: [
      '팔 부러짐 불량 사례 있음 — 개봉 직후 확인 시 교환',
    ],
    tags: ['주토피아', '베스트파트너', '피규어', '랜덤'],
  },
  {
    id: 'pixar-best-mini-figure',
    name: '픽사 베스트 캐릭터 미니 피규어 ROUND2',
    barcode: '887961851632',
    group: 'figure',
    brand: '픽사',
    notes: [
      '개봉 직후 파손 시 교환 가능',
    ],
    tags: ['픽사', '미니피규어', '랜덤'],
  },
  {
    id: 'toy-story-keyring',
    name: '토이스토리 키링',
    barcode: '8809544694247',
    group: 'figure',
    brand: '디즈니/픽사',
    notes: [
      '도색 미세 번짐은 제조 공정 특성일 수 있음 — 심한 경우만 교환 검토',
    ],
    tags: ['토이스토리', '키링'],
  },
  // 문구/스티커
  {
    id: 'deco-sticker-toystory',
    name: '토이스토리 데코스티커',
    group: 'stationery',
    brand: '디즈니/픽사',
    notes: [
      '색상별(그린/베이지/블루) 바코드 다름 — 포스기 색상명과 실제 상품 혼동 주의',
    ],
    tags: ['토이스토리', '데코스티커', '문구'],
  },
  // 액세서리/키링
  {
    id: 'magsafe-silicone-griptok-nick',
    name: '맥세이프 실리콘 그립톡 닉',
    barcode: '8800307173696',
    group: 'accessory',
    brand: '스토리너스',
    notes: [
      '2way 사용을 위한 탈부착형 상품 — 캐릭터 부분 분리는 정상 구조로 환불 사유 아님',
      '캐릭터 파츠가 분리된 상태라도 재장착 가능 여부 먼저 안내',
    ],
    tags: ['맥세이프', '그립톡', '닉', '스토리너스'],
    images: [
      { src: '/images/products/storynus-griptok/storynus-griptok-detach.png', alt: '2way 탈부착 구조 – 캐릭터 파츠를 그립톡 본체에서 간편하게 분리하는 모습' },
      { src: '/images/products/storynus-griptok/storynus-griptok-attach.png', alt: '2way 탈부착 – 캐릭터 파츠를 스마트폰 그립톡에 간편하게 장착하는 예시' },
    ],
  },
  {
    id: 'magsafe-silicone-griptok-judy',
    name: '맥세이프 실리콘 그립톡 주디',
    barcode: '8800307173689',
    group: 'accessory',
    brand: '스토리너스',
    notes: [
      '2way 사용을 위한 탈부착형 상품 — 캐릭터 부분 분리는 정상 구조로 환불 사유 아님',
      '캐릭터 파츠가 분리된 상태라도 재장착 가능 여부 먼저 안내',
    ],
    tags: ['맥세이프', '그립톡', '주디', '스토리너스'],
    images: [
      { src: '/images/products/storynus-griptok/storynus-griptok-detach.png', alt: '2way 탈부착 구조 – 캐릭터 파츠를 그립톡 본체에서 간편하게 분리하는 모습' },
      { src: '/images/products/storynus-griptok/storynus-griptok-attach.png', alt: '2way 탈부착 – 캐릭터 파츠를 스마트폰 그립톡에 간편하게 장착하는 예시' },
    ],
  },
  {
    id: 'magsafe-silicone-griptok-judy-hat',
    name: '맥세이프 실리콘 그립톡 주디모자',
    barcode: '8800358673619',
    group: 'accessory',
    brand: '스토리너스',
    notes: [
      '2way 사용을 위한 탈부착형 상품 — 캐릭터 부분 분리는 정상 구조로 환불 사유 아님',
      '캐릭터 파츠가 분리된 상태라도 재장착 가능 여부 먼저 안내',
    ],
    tags: ['맥세이프', '그립톡', '주디모자', '스토리너스'],
    images: [
      { src: '/images/products/storynus-griptok/storynus-griptok-detach.png', alt: '2way 탈부착 구조 – 캐릭터 파츠를 그립톡 본체에서 간편하게 분리하는 모습' },
      { src: '/images/products/storynus-griptok/storynus-griptok-attach.png', alt: '2way 탈부착 – 캐릭터 파츠를 스마트폰 그립톡에 간편하게 장착하는 예시' },
    ],
  },
  {
    id: 'magsafe-silicone-griptok-popsicle',
    name: '맥세이프 실리콘 그립톡 팝시클',
    barcode: '8800358673602',
    group: 'accessory',
    brand: '스토리너스',
    notes: [
      '초반에 뻑뻑함 — 사용하면 점차 부드러워짐 안내',
      '2way 사용을 위한 탈부착형 상품 — 캐릭터 부분 분리는 정상 구조로 환불 사유 아님',
    ],
    tags: ['맥세이프', '그립톡', '팝시클', '스토리너스'],
    images: [
      { src: '/images/products/storynus-griptok/storynus-griptok-detach.png', alt: '2way 탈부착 구조 – 캐릭터 파츠를 그립톡 본체에서 간편하게 분리하는 모습' },
      { src: '/images/products/storynus-griptok/storynus-griptok-attach.png', alt: '2way 탈부착 – 캐릭터 파츠를 스마트폰 그립톡에 간편하게 장착하는 예시' },
    ],
  },
  {
    id: 'poptok-plus-nick',
    name: '팝톡플러스 닉',
    barcode: '8809808397761',
    group: 'accessory',
    brand: '스토리너스',
    notes: [
      '2way 사용을 위한 탈부착형 상품 — 캐릭터 부분 분리는 정상 구조로 환불 사유 아님',
      '캐릭터 파츠가 분리된 상태라도 재장착 가능 여부 먼저 안내',
    ],
    tags: ['팝톡플러스', '닉', '스토리너스'],
    images: [
      { src: '/images/products/storynus-griptok/storynus-griptok-detach.png', alt: '2way 탈부착 구조 – 캐릭터 파츠를 그립톡 본체에서 간편하게 분리하는 모습' },
      { src: '/images/products/storynus-griptok/storynus-griptok-attach.png', alt: '2way 탈부착 – 캐릭터 파츠를 스마트폰 그립톡에 간편하게 장착하는 예시' },
    ],
  },
  {
    id: 'poptok-plus-judy',
    name: '팝톡플러스 주디',
    barcode: '8809808397754',
    group: 'accessory',
    brand: '스토리너스',
    notes: [
      '2way 사용을 위한 탈부착형 상품 — 캐릭터 부분 분리는 정상 구조로 환불 사유 아님',
      '캐릭터 파츠가 분리된 상태라도 재장착 가능 여부 먼저 안내',
    ],
    tags: ['팝톡플러스', '주디', '스토리너스'],
    images: [
      { src: '/images/products/storynus-griptok/storynus-griptok-detach.png', alt: '2way 탈부착 구조 – 캐릭터 파츠를 그립톡 본체에서 간편하게 분리하는 모습' },
      { src: '/images/products/storynus-griptok/storynus-griptok-attach.png', alt: '2way 탈부착 – 캐릭터 파츠를 스마트폰 그립톡에 간편하게 장착하는 예시' },
    ],
  },
  // 카메라/전자
  {
    id: 'toy-camera',
    name: '주토피아 토이카메라',
    group: 'camera',
    brand: '스모어 자체제작',
    notes: [
      'SD카드 삽입 불량 사례 — 딸깍 소리 안 나면 불량, 교환 처리',
      '충격 시 화면 멈춤 → 충전하며 자동 꺼질 때까지 대기 후 재시작',
      '배터리 소진 빠름 — 중간중간 충전 확인, 보조배터리 교육 필수',
      '카메라 켜서 디피하면 고객 관심 높아짐',
      'N메모리카드 — 토이카메라 1개당 1개만 판매',
      '품질보증기간 1년',
      '불량/하자는 구매 후 1주일 이내 교환/환불 가능',
    ],
    tags: ['토이카메라', '주토피아', '카메라', '레트로'],
  },
  {
    id: 'carrot-recording-pen',
    name: '주토피아 당근 녹음기 펜',
    barcode: '8800307179414',
    group: 'camera',
    brand: '스토리너스',
    notes: [
      '버튼 클릭 시 딜레이(바로 안 나옴) 발생하면 불량 → 교환 처리',
    ],
    tags: ['주토피아', '당근', '녹음기', '펜'],
  },
  // 리빙/잡화
  {
    id: 'retro-cup-set',
    name: '미키마우스 레트로컵세트',
    barcode: '8809656252236',
    group: 'living',
    brand: '디즈니',
    notes: [
      '식기세척기·전자레인지는 모두 사용 불가능',
    ],
    tags: ['미키', '레트로', '컵'],
  },
  {
    id: 'disney-mug-navy',
    name: '디즈니 머그컵 네이비',
    barcode: '8809923816147',
    group: 'living',
    brand: '디즈니',
    notes: [
      '식기세척기·전자레인지 모두 사용 가능',
    ],
    tags: ['디즈니', '머그컵', '네이비'],
  },
  {
    id: 'disney-mug-black',
    name: '디즈니 머그컵 블랙',
    barcode: '8809923816130',
    group: 'living',
    brand: '디즈니',
    notes: [
      '식기세척기·전자레인지 모두 사용 가능',
    ],
    tags: ['디즈니', '머그컵', '블랙'],
  },
  {
    id: 'insideout2-reusable-cold-cup',
    name: '인사이드아웃2 리유저블 콜드컵',
    barcode: '8809923814792',
    group: 'living',
    brand: '디즈니',
    notes: [
      '온도 변화 제품 — 찬물 넣으면 패턴 나타남',
    ],
    tags: ['리유저블', '콜드컵', '인사이드아웃2', '온도변화'],
  },
  {
    id: 'insideout-reusable-cold-cup',
    name: '인사이드아웃 리유저블 콜드컵',
    barcode: '8809923814785',
    group: 'living',
    brand: '디즈니',
    notes: [
      '온도 변화 제품 — 찬물 넣으면 패턴 나타남',
    ],
    tags: ['리유저블', '콜드컵', '인사이드아웃', '온도변화'],
  },
  {
    id: 'zootopia-tumbler-carrot',
    name: '주토피아 텀블러 당근',
    barcode: '8809923819797',
    group: 'living',
    brand: '디즈니/픽사',
    notes: [
      '뚜껑 파손(분리) 불량 사례 있음 — 고정 안 되면 교환 처리',
    ],
    tags: ['텀블러', '주토피아', '당근'],
  },
  {
    id: 'zootopia-tumbler-cotton-candy',
    name: '주토피아 텀블러 솜사탕',
    barcode: '8809923819803',
    group: 'living',
    brand: '디즈니/픽사',
    notes: [
      '뚜껑 파손(분리) 불량 사례 있음 — 고정 안 되면 교환 처리',
    ],
    tags: ['텀블러', '주토피아', '솜사탕'],
  },
  {
    id: 'zootopia-tumbler-car',
    name: '주토피아 텀블러 자동차',
    barcode: '8809923819810',
    group: 'living',
    brand: '디즈니/픽사',
    notes: [
      '뚜껑 파손(분리) 불량 사례 있음 — 고정 안 되면 교환 처리',
    ],
    tags: ['텀블러', '주토피아', '자동차'],
  },
  {
    id: 'fabric-poster',
    name: '패브릭 포스터',
    group: 'living',
    brand: '스모어 자체제작',
    notes: [
      '찬물에서 손세탁만 가능',
      '세탁기/건조기 사용 불가',
      '표면 오염 시 중성 세제를 묻힌 거즈로 부드럽게 닦아주세요',
      '표백제나 표백성분이 있는 세제는 사용하지 마세요',
    ],
    tags: ['패브릭 포스터', '포스터', '패브릭', '리빙'],
  },
  {
    id: 'pixar-balloon-dug',
    name: '픽사 풍선 더그',
    barcode: '8809923816567',
    group: 'living',
    brand: '디즈니/픽사',
    notes: [
      '공기 주입 빨대 누락은 불량 처리 필요',
    ],
    tags: ['픽사', '풍선', '더그'],
  },
  {
    id: 'pixar-balloon-lotso',
    name: '픽사 풍선 랏소',
    barcode: '8809923816536',
    group: 'living',
    brand: '디즈니/픽사',
    notes: [
      '공기 주입 빨대 누락은 불량 처리 필요',
    ],
    tags: ['픽사', '풍선', '랏소'],
  },
  {
    id: 'pixar-balloon-sulley',
    name: '픽사 풍선 설리반',
    barcode: '8809923816543',
    group: 'living',
    brand: '디즈니/픽사',
    notes: [
      '공기 주입 빨대 누락은 불량 처리 필요',
    ],
    tags: ['픽사', '풍선', '설리반'],
  },
  {
    id: 'pixar-balloon-mike',
    name: '픽사 풍선 마이크',
    barcode: '8809923816550',
    group: 'living',
    brand: '디즈니/픽사',
    notes: [
      '공기 주입 빨대 누락은 불량 처리 필요',
    ],
    tags: ['픽사', '풍선', '마이크'],
  },
  // DIY 제품
  {
    id: 'diy-figure-box',
    name: 'DIY 박스 피규어 (랏소의 방, 알린의 피자플래닛)',
    group: 'figure',
    brand: '디즈니/픽사',
    notes: [
      '박스 자체가 배경이 되는 DIY 제품',
      '박스 옆 절취선 제거 후 조립',
    ],
    tags: ['DIY', '피규어', '토이스토리'],
  },
];

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.barcode?.includes(q) ||
    p.brand?.toLowerCase().includes(q) ||
    p.tags?.some(tag => tag.toLowerCase().includes(q))
  );
}

export function getProductsByGroup(groupId: string): Product[] {
  return products.filter(p => p.group === groupId);
}
