'use client';

import { useState } from 'react';
import Link from 'next/link';
import { claims, claimTypeIcons, ClaimType } from '@/data/claims';

const allTypes: ClaimType[] = [
  '파손/불량',
  '부품/구성품 누락',
  '교환 요청',
  '환불 요청',
  '작동 불량',
  '랜덤 상품 관련',
  '기타 문의',
];

export default function ClaimsPage() {
  const [selectedType, setSelectedType] = useState<ClaimType | '전체'>('전체');
  const [search, setSearch] = useState('');

  const filtered = claims.filter((c) => {
    const matchType = selectedType === '전체' || c.type === selectedType;
    const matchSearch =
      !search ||
      c.product.includes(search) ||
      c.symptom.includes(search) ||
      c.response.includes(search);
    return matchType && matchSearch;
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← 홈으로
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">🛡️ 클레임 대응 가이드</h1>
      <p className="text-gray-600 mb-6">
        과거 클레임 케이스를 검색해서 대처법을 확인하세요.
      </p>

      {/* 검색 */}
      <input
        type="text"
        placeholder="상품명, 증상으로 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300"
      />

      {/* 유형 필터 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedType('전체')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
            selectedType === '전체'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          전체 ({claims.length})
        </button>
        {allTypes.map((type) => {
          const count = claims.filter((c) => c.type === type).length;
          if (count === 0) return null;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                selectedType === type
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {claimTypeIcons[type]} {type} ({count})
            </button>
          );
        })}
      </div>

      {/* 클레임 목록 */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            해당 조건의 클레임 케이스가 없습니다.
          </p>
        )}
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{claimTypeIcons[c.type]}</span>
                <span className="text-xs font-medium px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full">
                  {c.type}
                </span>
                <span className="text-xs text-gray-400">{c.id}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400">
                  {c.count}건 · 최근 {c.lastDate}
                </span>
              </div>
            </div>

            <h3 className="font-bold text-sm mb-1">
              {c.product}{' '}
              <span className="font-normal text-gray-400 text-xs">
                ({c.productGroup})
              </span>
            </h3>

            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium text-gray-500">증상:</span>{' '}
              {c.symptom}
            </p>

            <div className="bg-green-50 rounded-lg p-3 mb-2">
              <p className="text-sm text-green-800">
                <span className="font-bold">✅ 대처:</span> {c.response}
              </p>
              <p className="text-xs text-green-600 mt-1">
                결과: {c.result}
              </p>
            </div>

            {c.note && (
              <p className="text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
                💡 {c.note}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 작성 양식 안내 */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold mb-3">📝 클레임 접수 양식</h2>
        <p className="text-sm text-gray-600 mb-4">
          새로운 클레임이 발생하면 아래 양식으로 매니저에게 전달해주세요.
        </p>
        <div className="bg-white rounded-lg p-4 border border-gray-100 font-mono text-sm text-gray-700 whitespace-pre-line leading-relaxed">
{`[클레임 접수]
일시: 0000.00.00
매장: 
스텝: 

상품명: 
클레임 유형: 파손/누락/교환/환불/작동불량/랜덤/기타
증상: 

처리 내용: 
처리 결과: 교환 / 환불 / A/S안내 / 안내 후 종결

비고: `}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          * 이 양식을 단톡방 또는 슬랙으로 보내주시면 클레임 가이드에 반영됩니다.
        </p>
      </div>
    </main>
  );
}
