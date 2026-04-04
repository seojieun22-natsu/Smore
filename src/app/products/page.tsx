import Link from 'next/link';
import { productGroups, getProductsByGroup } from '@/data/products';
import ProductSearch from './ProductSearch';

export default function ProductsPage() {
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

      <section className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/" className="text-orange-400 hover:text-orange-600 text-sm mb-6 inline-flex items-center gap-1 transition-colors">
          <span>←</span> <span>홈으로</span>
        </Link>

        <div className="flex items-center gap-4 mb-8 mt-2">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-orange-100 flex items-center justify-center text-3xl">
            📦
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">상품 매뉴얼</h2>
            <p className="text-sm text-gray-500">상품별 유의사항 및 취급 가이드</p>
          </div>
        </div>

        {/* Search */}
        <ProductSearch />

        {/* Product Groups */}
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 mt-10">상품군별 보기</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {productGroups.map(group => {
            const count = getProductsByGroup(group.id).length;
            return (
              <Link
                key={group.id}
                href={`/products/${group.id}`}
                className="bg-white rounded-xl border border-orange-50 p-5 hover:shadow-md hover:border-orange-200 hover:-translate-y-0.5 transition-all duration-200 group text-center"
              >
                <div className="text-3xl mb-2">{group.emoji}</div>
                <h4 className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">{group.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{count}개 상품</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
