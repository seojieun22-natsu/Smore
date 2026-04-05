'use client';

import { useState, useMemo } from 'react';

// 체크리스트 데이터: 각 항목에 D-day 기준 마감일
interface CheckItem {
  id: string;
  task: string;
  dDay: number; // 오픈일 기준 며칠 전 (양수 = 전)
  note?: string;
  special?: 'signage'; // 특수 규칙
}

interface CheckSection {
  title: string;
  emoji: string;
  color: string;
  period: string;
  items: CheckItem[];
}

const checklistData: CheckSection[] = [
  {
    title: '기획 & 계약',
    emoji: '🔴',
    color: '#EF4444',
    period: 'D-45 ~ D-30',
    items: [
      { id: 'a1', task: '팝업 장소 확정 & 계약서 체결', dDay: 45 },
      { id: 'a2', task: '라이선스 확인 (IP 사용 승인)', dDay: 45 },
      { id: 'a3', task: '팝업 컨셉 & 테마 기획', dDay: 40 },
      { id: 'a4', task: '일정표(타임라인) 작성', dDay: 40 },
      { id: 'a5', task: '공간팀 실측 & 공간 구성 기획', dDay: 30 },
      { id: 'a6', task: '매장 출입 동선 & 창고 동선 파악', dDay: 30, note: '백화점 등은 시설컨펌 필요' },
    ],
  },
  {
    title: '상품 & 인력',
    emoji: '🟠',
    color: '#F97316',
    period: 'D-30 ~ D-14',
    items: [
      { id: 'b1', task: '자체 제작 상품 발주', dDay: 30, note: '리드타임 고려!' },
      { id: 'b2', task: '사입 상품 발주', dDay: 28 },
      { id: 'b3', task: '위탁 상품 협의 & 계약', dDay: 28 },
      { id: 'b4', task: '이카운트 품목 등록 & 창고 생성', dDay: 21 },
      { id: 'b5', task: '스태프 채용 공고 게시', dDay: 28 },
      { id: 'b6', task: '스태프 면접 & 선발', dDay: 21 },
      { id: 'b7', task: '인원배치 확정 → 근무계획 & 급여예상액 작성', dDay: 14 },
      { id: 'b8', task: 'SNS 홍보 일정 & 오픈 이벤트 기획', dDay: 21, note: 'SNS 담당자·디자인팀·이사님 공유 & 일정 조율' },
    ],
  },
  {
    title: '확정 & 제작',
    emoji: '🟡',
    color: '#EAB308',
    period: 'D-14 ~ D-7',
    items: [
      { id: 'c1', task: '판매 상품 리스트 최종 마감', dDay: 14 },
      { id: 'c2', task: '근무 스케줄 확정', dDay: 10 },
      { id: 'c3', task: '운영 매뉴얼 업데이트 (해당 팝업 특성만 추가)', dDay: 7 },
      { id: 'c4', task: '스태프 교육 일정 확정', dDay: 10 },
      { id: 'c5', task: 'POS 필요 대수 확정 & 대여 신청', dDay: 7, note: '오픈 전날 화물에 반드시 포함!' },
      { id: 'c6', task: '사이니지 최종안 → 디자인팀 전달', dDay: 0, special: 'signage', note: '오픈 주 월요일까지 (수요일 이전 오픈 시 전주 금요일)' },
    ],
  },
  {
    title: '입고 · 세팅 준비',
    emoji: '🔵',
    color: '#3B82F6',
    period: 'D-7 ~ D-3',
    items: [
      { id: 'd1', task: '상품 입고 확인 & 수량 체크', dDay: 7 },
      { id: 'd2', task: '이카운트 입고 전표 처리', dDay: 7 },
      { id: 'd3', task: '상품 검수 (불량 확인)', dDay: 5 },
      { id: 'd4', task: '가격표(POP) 작성', dDay: 7, note: '최종 발주 마무리 후' },
      { id: 'd5', task: '가격 태깅 & 바코드 부착', dDay: 5 },
      { id: 'd6', task: 'VMD 레이아웃 확정 & 연출물 구매', dDay: 3 },
      { id: 'd7', task: '현수막/배너 제작 완료 확인', dDay: 3 },
      { id: 'd8', task: 'BGM 선곡 리스트', dDay: 3 },
      { id: 'd9', task: '창고 이동 리스트 확정 → 화물기사님 전달', dDay: 3, note: '운영물품·연출물·집기' },
    ],
  },
  {
    title: '최종 점검',
    emoji: '🟣',
    color: '#8B5CF6',
    period: 'D-1',
    items: [
      { id: 'e1', task: 'POS 수령 & 정상작동 테스트', dDay: 1 },
      { id: 'e2', task: '본사 → 팝업 화물 상차 (POS 포함!)', dDay: 1 },
      { id: 'e3', task: '현장 시공 & 집기 설치', dDay: 1 },
      { id: 'e4', task: '사이니지 설치', dDay: 1 },
      { id: 'e5', task: 'VMD 디스플레이 세팅', dDay: 1 },
      { id: 'e6', task: '스태프 현장 교육 (실습)', dDay: 1 },
      { id: 'e7', task: '오픈/마감 동선 리허설', dDay: 1 },
      { id: 'e8', task: '전체 상품 재고 최종 확인', dDay: 1 },
      { id: 'e9', task: '비품 체크 (영수증 용지, 카드 단말기, 거스름돈 등)', dDay: 1 },
      { id: 'e10', task: '소방/안전 점검', dDay: 1 },
      { id: 'e11', task: '비상 연락망 공유', dDay: 1 },
    ],
  },
  {
    title: '오픈! 🎉',
    emoji: '⚫',
    color: '#111827',
    period: 'D-Day',
    items: [
      { id: 'f1', task: '오픈 전 최종 VMD 점검', dDay: 0 },
      { id: 'f2', task: 'POS & 카드 단말기 최종 확인', dDay: 0 },
      { id: 'f3', task: '스태프 브리핑 (주의사항, 역할 배분)', dDay: 0 },
      { id: 'f4', task: 'SNS 오픈 공지 게시', dDay: 0 },
    ],
  },
  {
    title: '운영 중 (매일)',
    emoji: '📌',
    color: '#059669',
    period: '운영 기간',
    items: [
      { id: 'g1', task: '일일 매출 보고', dDay: 0 },
      { id: 'g2', task: '재고 소진 체크 & 추가 발주', dDay: 0 },
      { id: 'g3', task: '클레임/CS 대응 기록', dDay: 0 },
      { id: 'g4', task: '스태프 근태 관리', dDay: 0 },
    ],
  },
  {
    title: '철수',
    emoji: '🔚',
    color: '#6B7280',
    period: '마지막 날',
    items: [
      { id: 'h1', task: '잔여 재고 박스 포장 & 반품 처리', dDay: 0 },
      { id: 'h2', task: '집기 철수', dDay: 0 },
      { id: 'h3', task: '정산서 작성', dDay: 0 },
      { id: 'h4', task: '운영보고서 작성', dDay: 0 },
    ],
  },
];

function getSignageDeadline(openDate: Date): Date {
  const day = openDate.getDay(); // 0=일 ~ 6=토
  // 오픈 주의 월요일 = 오픈일에서 (day-1)일 전 (월=1)
  // 수요일(3) 이전 오픈이면 전주 금요일
  if (day <= 2 || day === 0) {
    // 일(0), 월(1), 화(2) → 전주 금요일
    const daysBack = day === 0 ? 2 : day + 2;
    const d = new Date(openDate);
    d.setDate(d.getDate() - daysBack);
    return d;
  } else {
    // 수(3), 목(4), 금(5), 토(6) → 그 주 월요일
    const daysBack = day - 1;
    const d = new Date(openDate);
    d.setDate(d.getDate() - daysBack);
    return d;
  }
}

function formatDate(date: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const dayName = days[date.getDay()];
  return `${m}/${d}(${dayName})`;
}

function getDaysUntil(target: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const t = new Date(target);
  t.setHours(0, 0, 0, 0);
  return Math.ceil((t.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getDeadlineColor(daysLeft: number): string {
  if (daysLeft < 0) return 'text-red-600 font-bold'; // 지남!
  if (daysLeft === 0) return 'text-red-500 font-bold'; // 오늘!
  if (daysLeft <= 3) return 'text-orange-500 font-semibold'; // 임박
  if (daysLeft <= 7) return 'text-yellow-600'; // 곧
  return 'text-gray-600'; // 여유
}

function getDeadlineBadge(daysLeft: number): string | null {
  if (daysLeft < 0) return '⚠️ 지남!';
  if (daysLeft === 0) return '🔥 오늘!';
  if (daysLeft <= 3) return '⏰ 임박';
  return null;
}

export default function PopupChecklist() {
  const [openDateStr, setOpenDateStr] = useState('');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [popupName, setPopupName] = useState('');

  const openDate = useMemo(() => {
    if (!openDateStr) return null;
    const d = new Date(openDateStr + 'T00:00:00+09:00');
    return isNaN(d.getTime()) ? null : d;
  }, [openDateStr]);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getItemDeadline = (item: CheckItem): Date | null => {
    if (!openDate) return null;
    if (item.special === 'signage') return getSignageDeadline(openDate);
    const d = new Date(openDate);
    d.setDate(d.getDate() - item.dDay);
    return d;
  };

  const totalItems = checklistData.reduce((sum, s) => sum + s.items.length, 0);
  const checkedCount = checkedItems.size;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 mb-3">📋 팝업스토어 오픈 준비 체크리스트</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">팝업명</label>
              <input
                type="text"
                value={popupName}
                onChange={(e) => setPopupName(e.target.value)}
                placeholder="예) 토이스토리5 성수"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">오픈일 📅</label>
              <input
                type="date"
                value={openDateStr}
                onChange={(e) => setOpenDateStr(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {openDate && (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {checkedCount}/{totalItems} ({progress}%)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 체크리스트 */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {!openDate && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-lg">오픈일을 입력하면 마감일이 자동으로 계산돼요!</p>
          </div>
        )}

        {openDate && checklistData.map((section) => {
          const sectionChecked = section.items.filter((i) => checkedItems.has(i.id)).length;
          const sectionTotal = section.items.length;
          const allDone = sectionChecked === sectionTotal;

          return (
            <div key={section.title} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${allDone ? 'opacity-60' : ''}`}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderLeftWidth: 4, borderLeftColor: section.color }}>
                <div>
                  <h2 className="font-bold text-gray-900">
                    {section.emoji} {section.title}
                  </h2>
                  <span className="text-xs text-gray-500">{section.period}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {sectionChecked}/{sectionTotal}
                </span>
              </div>

              <div className="divide-y">
                {section.items.map((item) => {
                  const deadline = getItemDeadline(item);
                  const daysLeft = deadline ? getDaysUntil(deadline) : null;
                  const checked = checkedItems.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition ${checked ? 'bg-gray-50' : ''}`}
                      onClick={() => toggleCheck(item.id)}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCheck(item.id)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm ${checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {item.task}
                        </div>
                        {item.note && (
                          <div className="text-xs text-gray-400 mt-0.5">💡 {item.note}</div>
                        )}
                      </div>
                      {deadline && daysLeft !== null && section.period !== '운영 기간' && section.period !== '마지막 날' && (
                        <div className="text-right shrink-0">
                          <div className={`text-xs ${getDeadlineColor(daysLeft)}`}>
                            {formatDate(deadline)}
                          </div>
                          {!checked && getDeadlineBadge(daysLeft) && (
                            <div className="text-xs mt-0.5">{getDeadlineBadge(daysLeft)}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 푸터 */}
      <div className="max-w-3xl mx-auto px-4 py-8 text-center text-xs text-gray-400">
        SMORE 팝업 준비 체크리스트 — 팀 내부용
      </div>
    </div>
  );
}
