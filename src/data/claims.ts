export type ClaimType =
  | '파손/불량'
  | '부품/구성품 누락'
  | '교환 요청'
  | '환불 요청'
  | '작동 불량'
  | '랜덤 상품 관련'
  | '기타 문의';

export const claimTypeIcons: Record<ClaimType, string> = {
  '파손/불량': '🔨',
  '부품/구성품 누락': '📦',
  '교환 요청': '🔄',
  '환불 요청': '💰',
  '작동 불량': '⚠️',
  '랜덤 상품 관련': '🎲',
  '기타 문의': '💬',
};

export interface ClaimCase {
  id: string;
  type: ClaimType;
  product: string;
  productGroup: string;
  symptom: string;
  response: string;
  result: string;
  count: number;
  lastDate: string;
  store?: string;
  note?: string;
}

export const claims: ClaimCase[] = [
  // === 파손/불량 ===
  {
    id: 'C001',
    type: '파손/불량',
    product: '한복 피규어',
    productGroup: '피규어/토이',
    symptom: '개봉 직후 팔/다리 부분 파손 발견',
    response: '불량 양식 작성 → 사진 촬영 → 동일 상품 교환',
    result: '교환 처리',
    count: 3,
    lastDate: '2026-03-28',
    note: '랜덤 상품이므로 동일 캐릭터 보장 불가 안내',
  },
  {
    id: 'C002',
    type: '파손/불량',
    product: '마쉬멜로우 피규어',
    productGroup: '피규어/토이',
    symptom: '거치 부품 파손 (매우 작은 부품)',
    response: '불량 양식 작성 → 교환 또는 환불 처리',
    result: '교환/환불',
    count: 5,
    lastDate: '2026-04-01',
    note: '개봉 시 부품 분실 위험 있으므로 고객에게 조심히 개봉 안내 필수',
  },
  {
    id: 'C003',
    type: '파손/불량',
    product: '퍼즐',
    productGroup: '피규어/토이',
    symptom: '아크릴 케이스 파손',
    response: '파손 상태 확인 → 불량 양식 → 교환',
    result: '교환 처리',
    count: 2,
    lastDate: '2026-03-15',
    note: '퍼즐/큐브 취급 시 파손 주의',
  },

  // === 부품/구성품 누락 ===
  {
    id: 'C004',
    type: '부품/구성품 누락',
    product: '랜덤 피규어',
    productGroup: '피규어/토이',
    symptom: '카드 누락 또는 다른 카드 혼입',
    response: '교환 가능 → 동일 상품 교환 처리',
    result: '교환 처리',
    count: 4,
    lastDate: '2026-03-30',
  },
  {
    id: 'C005',
    type: '부품/구성품 누락',
    product: '퍼즐',
    productGroup: '피규어/토이',
    symptom: '퍼즐 피스 분실',
    response: '상품 내 동봉 엽서로 문의 안내',
    result: '안내 후 종결',
    count: 2,
    lastDate: '2026-03-20',
    note: '엽서 분실 시 보상 불가',
  },

  // === 작동 불량 ===
  {
    id: 'C006',
    type: '작동 불량',
    product: '토이카메라',
    productGroup: '카메라/전자',
    symptom: '전원이 안 켜짐 / 촬영 안 됨',
    response: '배터리 확인 → 스모어몰 온라인 A/S 문의 안내',
    result: 'A/S 안내',
    count: 3,
    lastDate: '2026-04-02',
    note: 'SD카드 별도 구매 필요 (5,000원) 안내',
  },
  {
    id: 'C007',
    type: '작동 불량',
    product: 'DIY 패딩시계',
    productGroup: '액세서리/키링',
    symptom: '시계바늘 장착 안 됨 / 구부러짐',
    response: '시계바늘 뒤집어 기둥에 1~2번 눌러 구멍 확대 후 재장착 안내',
    result: '안내 후 종결',
    count: 2,
    lastDate: '2026-03-25',
    note: '과도한 힘 사용 시 구부러짐 발생 — 고객에게 힘 조절 안내',
  },

  // === 교환 요청 ===
  {
    id: 'C008',
    type: '교환 요청',
    product: '컵 종류',
    productGroup: '리빙/잡화',
    symptom: '구매 후 교환 요청',
    response: '컵은 교환/환불 어려움 안내 → 현장 확인 요청',
    result: '안내 후 종결',
    count: 6,
    lastDate: '2026-04-03',
    note: '판매 시 "컵은 교환/환불이 어려우니 현장에서 확인 부탁드립니다" 멘트 필수',
  },

  // === 랜덤 상품 관련 ===
  {
    id: 'C009',
    type: '랜덤 상품 관련',
    product: '랜덤 피규어',
    productGroup: '피규어/토이',
    symptom: '원하는 캐릭터 안 나왔다며 교환 요청',
    response: '랜덤 상품 교환/환불 불가 안내',
    result: '안내 후 종결',
    count: 8,
    lastDate: '2026-04-04',
    note: '판매 시 필수 멘트: "랜덤 상품은 교환/환불이 불가합니다"',
  },
  {
    id: 'C010',
    type: '랜덤 상품 관련',
    product: '랜덤 피규어 (풀박스)',
    productGroup: '피규어/토이',
    symptom: '풀박스 구매했는데 중복 캐릭터 나옴',
    response: '사전 고지 확인 → 낮은 확률로 중복 가능성 재안내',
    result: '안내 후 종결',
    count: 3,
    lastDate: '2026-03-22',
    note: '풀박스 판매 시 "시크릿 제외, 낮은 확률로 중복 가능" 필수 고지',
  },
];
