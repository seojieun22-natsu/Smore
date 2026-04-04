import Link from 'next/link';
import { categories, getPagesByCategory } from '@/lib/content';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-3xl">🐿️</span>
          <div>
            <h1 className="text-xl font-bold text-amber-900">SMORE 매뉴얼</h1>
            <p className="text-sm text-amber-600">스모어 운영 가이드북</p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            안녕하세요! SMORE 매뉴얼입니다 🌰
          </h2>
          <p className="text-amber-700">
            운영, 상품, 클레임 등 업무에 필요한 모든 매뉴얼을 한 곳에서 확인하세요.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(category => {
            const pages = getPagesByCategory(category.id);
            return (
              <Link
                key={category.id}
                href={`/manual/${category.id}`}
                className="bg-white rounded-xl shadow-sm border border-amber-100 p-6 hover:shadow-md hover:border-amber-300 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{category.emoji}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 group-hover:text-amber-700">
                      {category.name}
                    </h3>
                    <p className="text-sm text-amber-500">{pages.length}개 문서</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{category.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-amber-400">
        <p>🐿️ 쩨홉이 관리하는 SMORE 매뉴얼 · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
