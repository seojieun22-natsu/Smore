'use client';

import { useState } from 'react';
import Link from 'next/link';
import { recipes, baseRecipes, categoryIcons, RecipeCategory } from '@/data/recipes';

const allCategories: RecipeCategory[] = ['커피', '음료', '디저트'];

export default function RecipesPage() {
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | '전체'>('전체');
  const [search, setSearch] = useState('');

  const filtered = recipes.filter((r) => {
    const matchCat = selectedCategory === '전체' || r.category === selectedCategory;
    const matchSearch =
      !search ||
      r.name.includes(search) ||
      (r.nameEn && r.nameEn.toLowerCase().includes(search.toLowerCase())) ||
      r.ingredients.some((i) => i.includes(search)) ||
      (r.subcategory && r.subcategory.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-[#FFF1E6]">
      <header className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/" className="text-2xl hover:scale-110 transition-transform">🐱</Link>
          <div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">SMORE 매뉴얼</h1>
            <p className="text-xs text-orange-400">스모어 운영 가이드북</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="text-orange-400 hover:text-orange-600 text-sm mb-6 inline-flex items-center gap-1 transition-colors">
          <span>←</span> <span>홈으로</span>
        </Link>

        <div className="flex items-center gap-4 mb-6 mt-2">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-orange-100 flex items-center justify-center text-3xl">
            🍳
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">F&B 레시피</h2>
            <p className="text-sm text-gray-500">{recipes.length}개 레시피 · 카테고리별 검색</p>
          </div>
        </div>

        {/* 검색 */}
        <input
          type="text"
          placeholder="메뉴명, 재료로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
        />

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('전체')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              selectedCategory === '전체'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체 ({recipes.length})
          </button>
          {allCategories.map((cat) => {
            const count = recipes.filter((r) => r.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {categoryIcons[cat]} {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* 레시피 목록 */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              해당 조건의 레시피가 없습니다.
            </p>
          )}
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryIcons[r.category]}</span>
                  <span className="text-xs font-medium px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full">
                    {r.category}
                  </span>
                  {r.subcategory && (
                    <span className="text-xs text-gray-400">{r.subcategory}</span>
                  )}
                </div>
                {r.temp && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    r.temp === 'HOT' ? 'bg-red-50 text-red-500' :
                    r.temp === 'ICE' ? 'bg-blue-50 text-blue-500' :
                    'bg-purple-50 text-purple-500'
                  }`}>
                    {r.temp}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm mb-1">
                {r.name}
                {r.nameEn && (
                  <span className="font-normal text-gray-400 text-xs ml-1">
                    ({r.nameEn})
                  </span>
                )}
              </h3>

              {/* 재료 */}
              <div className="flex flex-wrap gap-1 mb-2">
                {r.ingredients.map((ing, i) => (
                  <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded">
                    {ing}
                  </span>
                ))}
              </div>

              {/* 만드는 순서 */}
              <div className="bg-orange-50 rounded-lg p-3">
                <ol className="text-sm text-gray-700 space-y-1">
                  {r.steps.map((step, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-orange-400 font-bold text-xs mt-0.5">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {r.note && (
                <p className="text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2 mt-2">
                  💡 {r.note}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* 베이스 레시피 */}
        <div className="mt-10 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold mb-3">📋 베이스 레시피</h2>
          <div className="space-y-2">
            {baseRecipes.map((b, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-gray-100">
                <span className="font-semibold text-sm text-gray-700">{b.name}</span>
                <span className="text-sm text-orange-500">{b.ratio}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
