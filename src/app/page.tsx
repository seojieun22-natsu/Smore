import Link from 'next/link';
import { categories, getPagesByCategory } from '@/lib/content';
import { productGroups, products } from '@/data/products';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-[#FFF1E6]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-2xl">🐱</span>
          <div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">SMORE 매뉴얼</h1>
            <p className="text-xs text-orange-400">스모어 운영 가이드북</p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-10 mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            안녕하세요! SMORE 매뉴얼입니다 🧡
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            운영, 상품, 클레임 등 업무에 필요한 모든 매뉴얼을 한 곳에서 확인하세요.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 상품 매뉴얼 (별도 페이지) */}
          <Link
            href="/products"
            className="bg-white rounded-2xl shadow-sm border border-orange-50 p-7 hover:shadow-lg hover:border-orange-200 hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl group-hover:bg-orange-100 transition-colors">
                📦
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                  상품 매뉴얼
                </h3>
                <p className="text-xs text-orange-400 mb-2">{products.length}개 상품 · {productGroups.length}개 상품군</p>
                <p className="text-sm text-gray-500 leading-relaxed">상품군별 특이사항 및 취급 기준 · 바코드/상품명 검색</p>
              </div>
            </div>
          </Link>

          {/* 나머지 카테고리 */}
          {categories.map(category => {
            const pages = getPagesByCategory(category.id);
            return (
              <Link
                key={category.id}
                href={`/manual/${category.id}`}
                className="bg-white rounded-2xl shadow-sm border border-orange-50 p-7 hover:shadow-lg hover:border-orange-200 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl group-hover:bg-orange-100 transition-colors">
                    {category.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-orange-400 mb-2">{pages.length}개 문서</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{category.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-10 text-center">
        <div className="border-t border-orange-100 pt-6">
          <p className="text-xs text-gray-300">SMORE 매뉴얼 · {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
