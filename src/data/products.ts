export interface Product {
  id: string;
  name: string;
  barcode?: string;
  group: string;       // 상품군
  brand?: string;      // 브랜드
  notes: string[];     // 유의사항 리스트
  tags?: string[];     // 검색 키워드
}

export interface ProductGroup {
  id: string;
  name: string;
  emoji: string;
  description: string;
  notices?: string[];  // 상품군별 판매 주의사항/안내사항
}

export const productGroups: ProductGroup[] = [
  {
    id: 'figure', name: '피규어/토이', emoji: '🧸',
    description: '피규어, 인형, 블라인드박스 등 토이 상품',
    notices: [
      '랜덤상품 판매 시, 중복 캐릭터가 나올 수 있으며 개봉 시 환불 불가',
      '불량으로 인한 교환 시 동일 캐릭터로 교환 불가 (랜덤 특성상)',
      '소형 부품 포함 — 3세 미만 어린이 사용 금지 안내 필수',
      '도색 벗겨짐 주의 — 전시 시 직접 만지지 않도록 안내',
    ],
  },
  {
    id: 'stationery', name: '문구/스티커', emoji: '✏️',
    description: '노트, 펜, 스티커, 마스킹테이프 등',
    notices: [
      '방수 제품 여부 확인 후 고객 안내 (대부분 방수 아님)',
      '스티커류 직사광선 장시간 노출 시 변색 가능',
    ],
  },
  {
    id: 'accessory', name: '액세서리/키링', emoji: '🔑',
    description: '키링, 키캡, 뱃지, 밴드 등 액세서리',
    notices: [
      '랜덤 구성 상품은 중복 가능성 안내 필수',
      '금속 소재 상품은 수분/땀 접촉 시 변색 가능 안내',
    ],
  },
  {
    id: 'living', name: '리빙/잡화', emoji: '🏠',
    description: '머그컵, 쿠션, 파우치, 담요 등 생활용품',
    notices: [
      '머그컵 — 전자레인지/식기세척기 사용 가능 여부 상품별 확인 필수',
      '쿠션/담요 — 세탁 방법 안내 (손세탁 권장 등)',
    ],
  },
  {
    id: 'bag', name: '가방/파우치', emoji: '👜',
    description: '파우치, 크로스백, 에코백 등',
    notices: [
      '색상 차이 가능 — 모니터와 실물 색상 차이 안내',
      '원단 특성상 불량이 아닌 미세한 실밥 있을 수 있음 안내',
    ],
  },
  {
    id: 'camera', name: '카메라/전자', emoji: '📷',
    description: '토이카메라, 전자제품 등',
    notices: [
      '충격에 약함 — 배송 시 에어캡 2중 포장 필수',
      '배터리 미포함 상품 여부 확인 후 고객 안내',
      '전자제품 특성상 개봉 후 단순 변심 환불 불가',
    ],
  },
];

// 예시 데이터 — 나츠가 실제 데이터로 교체!
export const products: Product[] = [
  {
    id: 'toy-camera-01',
    name: '토이스토리 토이카메라',
    barcode: '8809001234567',
    group: 'camera',
    brand: '자체제작',
    notes: [
      '충격에 약함 — 배송 시 에어캡 2중 포장 필수',
      '배터리 미포함 — 고객 안내 필요 (AAA x2)',
      '습기에 약함 — 매장 진열 시 제습제 배치',
    ],
    tags: ['토이스토리', '카메라', '자체제작'],
  },
  {
    id: 'diy-keycap-01',
    name: 'DIY 키캡 키링 (토이스토리)',
    barcode: '8809001234568',
    group: 'accessory',
    brand: '자체제작',
    notes: [
      '소재 변색 주의 — 직사광선 장시간 노출 금지',
      'DIY 키트 — 조립 설명서 동봉 확인 필수',
      '풀박스 구매 시 중복 캐릭터 나올 수 있음 (랜덤 구성)',
    ],
    tags: ['토이스토리', '키링', '키캡', 'DIY', '자체제작'],
  },
  {
    id: 'multi-sticker-woody',
    name: '토이스토리 멀티스티커 우디',
    barcode: '8809001234569',
    group: 'stationery',
    brand: '디즈니/픽사',
    notes: [
      '방수 아님 — 물에 닿으면 번짐 주의',
      '유아 사용 시 입에 넣지 않도록 안내',
    ],
    tags: ['토이스토리', '우디', '스티커', '문구'],
  },
  {
    id: 'gosty-figure-set',
    name: '고스티 피규어 세트',
    barcode: '8809005678901',
    group: 'figure',
    brand: '스모어_고스티',
    notes: [
      '소형 부품 포함 — 3세 미만 어린이 사용 금지 안내 필수',
      '도색 벗겨짐 주의 — 전시 시 직접 만지지 않도록 안내',
      '풀박스(6종) 구매 시 중복 캐릭터 나올 수 있음',
    ],
    tags: ['고스티', '피규어', '랜덤'],
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
