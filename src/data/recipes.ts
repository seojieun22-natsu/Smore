export type RecipeCategory = '커피' | '음료' | '디저트';

export const categoryIcons: Record<RecipeCategory, string> = {
  '커피': '☕',
  '음료': '🥤',
  '디저트': '🍰',
};

export interface Recipe {
  id: string;
  name: string;
  nameEn?: string;
  category: RecipeCategory;
  subcategory?: string;
  temp?: 'HOT' | 'ICE' | 'HOT/ICE' | '';
  ingredients: string[];
  steps: string[];
  note?: string;
}

export const recipes: Recipe[] = [
  // ========== 커피 ==========
  {
    id: 'R001',
    name: '에스프레소',
    nameEn: 'Espresso',
    category: '커피',
    subcategory: 'COFFEE',
    temp: 'HOT',
    ingredients: ['기본 2샷', '도징 19g'],
    steps: [
      'ice 2샷 내리기 (hot 2샷은 진하게 느껴질 수 있으므로)',
      '티스푼, 물컵에 물 절반, 꿀단지에 설탕 5g 제공',
    ],
    note: 'HOT ONLY 메뉴',
  },
  {
    id: 'R002',
    name: '아메리카노',
    nameEn: 'Americano',
    category: '커피',
    subcategory: 'COFFEE',
    temp: 'HOT/ICE',
    ingredients: ['기본 2샷', '물 230g(HOT) / 190g(ICE)'],
    steps: [
      'HOT: 머그컵에 뜨거운 물 230g → ice 2샷 내려서 붓기',
      'ICE: 아이스잔에 얼음 + 물 190g + 얼음 채우기 → ice 2샷 붓기',
    ],
  },
  {
    id: 'R003',
    name: '카페라떼',
    nameEn: 'Café Latte',
    category: '커피',
    subcategory: 'COFFEE',
    temp: 'HOT/ICE',
    ingredients: ['기본 2샷', '우유 240g(HOT) / 190g(ICE)'],
    steps: [
      'HOT: hot 2샷 → 머그컵에 붓기 → 우유 240g 스팀 쳐서 붓기',
      'ICE: 아이스잔에 얼음 + 우유 190g + 얼음 → ice 2샷 붓기',
    ],
  },
  {
    id: 'R004',
    name: '바닐라라떼',
    nameEn: 'Vanilla Latte',
    category: '커피',
    subcategory: 'COFFEE',
    temp: 'HOT/ICE',
    ingredients: ['기본 2샷', '바닐라 파우더 30g', '우유 240g(HOT) / 190g(ICE)'],
    steps: [
      'HOT: hot 2샷 + 바닐라 파우더 30g 섞기 → 우유 240g 스팀',
      'ICE: 얼음 + 우유 190g → ice 2샷 + 바닐라 파우더 30g',
    ],
  },
  {
    id: 'R005',
    name: '연유라떼',
    nameEn: 'Condensed Milk Latte',
    category: '커피',
    subcategory: 'COFFEE',
    temp: 'HOT/ICE',
    ingredients: ['기본 2샷', '연유 30g', '우유 240g(HOT) / 190g(ICE)'],
    steps: [
      'HOT: hot 2샷 → 연유 30g → 우유 240g 스팀',
      'ICE: 연유 30g + 우유 190g → 얼음 → ice 2샷',
    ],
  },
  {
    id: 'R006',
    name: '더치 아메리카노',
    category: '커피',
    subcategory: 'DUTCH',
    temp: 'ICE',
    ingredients: ['더치 60g', '물 190g'],
    steps: ['얼음 + 물 190g', '더치 60g 붓기'],
  },
  {
    id: 'R007',
    name: '더치 라떼',
    category: '커피',
    subcategory: 'DUTCH',
    temp: 'ICE',
    ingredients: ['더치 60g', '우유 190g'],
    steps: ['얼음 + 우유 190g', '더치 60g 붓기'],
  },
  {
    id: 'R008',
    name: '더치 바닐라라떼',
    category: '커피',
    subcategory: 'DUTCH',
    temp: 'ICE',
    ingredients: ['더치 60g', '바닐라 30g', '우유 190g'],
    steps: ['우유 60g 스팀', '바닐라 30g 섞기', '우유 130g 추가', '더치 60g 붓기'],
  },
  {
    id: 'R009',
    name: '더치 연유라떼',
    category: '커피',
    subcategory: 'DUTCH',
    temp: 'ICE',
    ingredients: ['더치 60g', '연유 30g', '우유 190g'],
    steps: ['연유 30g + 우유 190g', '더치 60g 붓기'],
  },

  // ========== 음료 ==========
  {
    id: 'R010',
    name: '그린티라떼',
    category: '음료',
    subcategory: 'NON COFFEE',
    temp: 'HOT/ICE',
    ingredients: ['그린티 30g', '바닐라 5g', '우유'],
    steps: ['그린티 30g + 바닐라 5g', '우유와 섞기'],
  },
  {
    id: 'R011',
    name: '밀크티',
    category: '음료',
    subcategory: 'NON COFFEE',
    temp: 'HOT/ICE',
    ingredients: ['밀크티 파우더 30g', '우유'],
    steps: ['밀크티 파우더 30g', '우유와 섞기'],
  },
  {
    id: 'R012',
    name: '초코냥',
    category: '음료',
    subcategory: 'NON COFFEE',
    temp: 'HOT/ICE',
    ingredients: ['초코파우더 30g', '바닐라 5g', '우유'],
    steps: ['초코파우더 30g + 바닐라 5g', '우유와 섞기'],
  },
  {
    id: 'R013',
    name: '복숭아 얼그레이',
    category: '음료',
    subcategory: 'TEA',
    temp: 'HOT/ICE',
    ingredients: ['얼그레이 티백', '복숭아청 55g'],
    steps: ['티 3분 우리기', '복숭아청 55g 추가'],
  },
  {
    id: 'R014',
    name: '레몬 캐모마일',
    category: '음료',
    subcategory: 'TEA',
    temp: 'HOT/ICE',
    ingredients: ['캐모마일 티백', '레몬 시럽 55g'],
    steps: ['티 3분 우리기', '레몬 시럽 55g 추가'],
  },
  {
    id: 'R015',
    name: '트로피칼 라바',
    category: '음료',
    subcategory: 'SIGNATURE',
    temp: 'ICE',
    ingredients: ['자두청 60g', '오렌지 주스 100g'],
    steps: ['자두청 60g', '오렌지 주스 100g 섞기'],
  },
  {
    id: 'R016',
    name: '알로하 파인 코코넛',
    category: '음료',
    subcategory: 'SIGNATURE',
    temp: 'ICE',
    ingredients: ['파인애플 180g', '우유 170g', '파파야 시럽 80g'],
    steps: ['파인애플 180g', '우유 170g', '파파야 시럽 80g 섞기'],
  },
  {
    id: 'R017',
    name: '호오 포노포노',
    category: '음료',
    subcategory: 'SIGNATURE',
    temp: 'ICE',
    ingredients: ['레몬 시럽', '라임 시럽', '블루큐라소'],
    steps: ['레몬 시럽 + 라임 시럽 + 블루큐라소 섞기'],
  },
  {
    id: 'R018',
    name: '하와이 헌터',
    category: '음료',
    subcategory: 'SIGNATURE',
    temp: 'ICE',
    ingredients: ['파파야 시럽 40g'],
    steps: ['파파야 시럽 40g으로 제조'],
  },
  {
    id: 'R019',
    name: '메론소다',
    category: '음료',
    subcategory: 'SIGNATURE',
    temp: 'ICE',
    ingredients: ['메론 시럽 50g', '소다'],
    steps: ['메론 시럽 50g + 소다'],
  },
  {
    id: 'R020',
    name: '오미자 에이드',
    category: '음료',
    subcategory: 'SIGNATURE',
    temp: 'ICE',
    ingredients: ['오미자청 60g', '소다'],
    steps: ['오미자청 60g + 소다'],
  },
  {
    id: 'R021',
    name: '자두냥',
    category: '음료',
    subcategory: 'SIGNATURE',
    temp: 'ICE',
    ingredients: ['자두청 50g', '우유', '아이스크림'],
    steps: ['자두청 50g', '우유', '아이스크림 토핑'],
  },

  // ========== 디저트 ==========
  {
    id: 'R022',
    name: '아슬아슬 아포카토',
    category: '디저트',
    temp: '',
    ingredients: ['아이스크림 2개', '가나초콜릿 1개', 'HOT 2샷'],
    steps: [
      '작은 아이스크림 위에 가나초콜릿 1개 비스듬히 꽂기',
      '아포카토 잔에 아이스크림 2개 올리기',
      'HOT 2샷 꿀단지에 담기',
      '티스푼 제공',
    ],
  },
  {
    id: 'R023',
    name: '쨈쨈 행궁',
    category: '디저트',
    temp: '',
    ingredients: ['크로플 생지 2개', '딸기잼', '땅콩휘핑', '아이스크림', '체리', '딸기시럽', '땅콩토핑'],
    steps: [
      '크로플 생지 2개 전자레인지 2분',
      '크로플 기계 5분 굽기',
      '딸기잼 바르기',
      '땅콩휘핑 올리기',
      '아이스크림 + 체리',
      '딸기시럽 뿌리기',
      '땅콩토핑 올리기',
    ],
  },
  {
    id: 'R024',
    name: '찍어츄 원츄',
    category: '디저트',
    temp: '',
    ingredients: ['생지', '시나몬가루', '아이스크림 2개', '초코시럽', '초콜릿'],
    steps: [
      '오븐 200도 5분 예열',
      '생지 7분 굽기',
      '시나몬가루 섞기',
      '아이스크림 2개',
      '초코시럽 + 초콜릿 토핑',
    ],
  },
  {
    id: 'R025',
    name: '브라우니선데이',
    category: '디저트',
    temp: '',
    ingredients: ['브라우니', '아이스크림', '체리', '젤리빈', '스프링클스'],
    steps: [
      '브라우니 전자레인지 1분',
      '아이스크림 + 체리',
      '젤리빈 + 스프링클스 토핑',
    ],
  },
  {
    id: 'R026',
    name: '꼬지절미',
    category: '디저트',
    temp: '',
    ingredients: ['당고 4개', '연유', '인절미가루'],
    steps: [
      '당고 4개 전자레인지 3분',
      '연유 뿌리기',
      '인절미가루 뿌리기',
    ],
  },
  {
    id: 'R027',
    name: '스모어딥',
    category: '디저트',
    temp: '',
    ingredients: ['다크초콜릿', '마시멜로우 4개', '과자'],
    steps: [
      '오븐 예열',
      '다크초콜릿 넣기',
      '마시멜로우 4개 올리기',
      '초콜릿 추가',
      '오븐 굽기',
      '과자와 함께 제공',
    ],
  },
  {
    id: 'R028',
    name: '몽땅 스모어쿠키',
    category: '디저트',
    subcategory: '오리지널',
    temp: '',
    ingredients: ['쿠키 생지'],
    steps: [
      '오븐 180도 5분 예열',
      '쿠키 2분 굽기',
      '접시에 담기',
    ],
  },
];

// 베이스 레시피 (참고용)
export const baseRecipes = [
  { name: '땅콩 휘핑', ratio: '휘핑 10 : 땅콩 3' },
  { name: '스티치 얼음', ratio: '물 90g + 블루큐라소 10g' },
  { name: '초코냥 멜팅크림', ratio: '휘핑 100g + 연유 10g' },
];
