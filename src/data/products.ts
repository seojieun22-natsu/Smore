export interface Product {
  id: string;
  name: string;
  barcode?: string;
  group: string;
  brand?: string;
  notes: string[];
  tags?: string[];
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
      '랜덤상품 판매 시, 중복 캐릭터가 나올 수 있으며 개봉 시 환불 불가',
      '불량으로 인한 교환 시 동일 캐릭터로 교환 불가 (랜덤 특성상)',
      '교환 시 반드시 "랜덤상품이므로 동일 캐릭터가 나오지 않을 수 있다" 안내 필수',
      '소형 부품 포함 — 3세 미만 어린이 사용 금지 안내',
      '피규어 샘플은 글루건으로 고정하고 수시 확인 필요',
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
    ],
  },
  {
    id: 'living', name: '리빙/잡화', emoji: '🏠',
    description: '머그컵, 쿠션, 파우치, 담요 등 생활용품',
    notices: [
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
      '전자제품 특성상 개봉 후 단순 변심 환불 불가',
      '배터리 미포함 상품 여부 확인 후 고객 안내',
      '충격에 약함 — 배송 시 에어캡 2중 포장 필수',
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
      '투명 플라스틱 박스에 봉투째 1개씩 넣어 판매 — 패키지 손상 방지',
    ],
    tags: ['픽사', '미니피규어', '랜덤'],
  },
  {
    id: 'led-plush',
    name: 'LED 인형 (모자 LED 포함)',
    group: 'figure',
    brand: '디즈니',
    notes: [
      '모자 안 버튼 꾹 눌러야 LED 작동',
      '작동 안 되는 제품 있으므로 판매 전 반드시 확인',
    ],
    tags: ['LED', '인형', '모자'],
  },
  // 문구/스티커
  {
    id: 'figure-3color-pen',
    name: '디즈니 피규어 3색볼펜',
    barcode: '8809544694247',
    group: 'stationery',
    brand: '디즈니',
    notes: [
      '봉투(비닐) 특히 약함 — 손님 구경 중 뜯어짐 빈번',
    ],
    tags: ['디즈니', '3색볼펜', '피규어볼펜', '문구'],
  },
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
    id: 'magsafe-popsicle',
    name: '맥세이프 실리콘 그립톡 팝시클',
    barcode: '8800358673602',
    group: 'accessory',
    brand: '스토리너스',
    notes: [
      '초반에 뻑뻑함 — 사용하면 점차 부드러워짐 안내',
    ],
    tags: ['맥세이프', '그립톡', '팝시클'],
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
    group: 'living',
    brand: '디즈니',
    notes: [
      '식기세척기·전자레인지 모두 사용 가능',
    ],
    tags: ['미키', '레트로', '컵'],
  },
  {
    id: 'reusable-cup',
    name: '리유저블 컵',
    group: 'living',
    brand: '디즈니',
    notes: [
      '온도 변화 제품 — 찬물 넣으면 패턴 나타남',
      '파츠(미키 귀 등) 떨어짐 주의 — 틈새로 빠질 수 있음',
    ],
    tags: ['리유저블', '컵', '온도변화'],
  },
  {
    id: 'tumbler',
    name: '주토피아 텀블러',
    group: 'living',
    brand: '디즈니/픽사',
    notes: [
      '뚜껑 파손(분리) 불량 사례 있음 — 고정 안 되면 교환 처리',
    ],
    tags: ['텀블러', '주토피아'],
  },
];

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.barcode?.includes(q) ||
    p.brand?.toLowerCase().includes(q) ||
    p.tags?.some(t => t.toLowerCase().includes(q))
  );
}

export function getProductsByGroup(groupId: string): Product[] {
  return products.filter(p => p.group === groupId);
}
