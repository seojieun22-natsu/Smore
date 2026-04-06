import Link from 'next/link';
import Image from 'next/image';
import { productGroups, getProductsByGroup } from '@/data/products';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return productGroups.map(g => ({ group: g.id }));
}

export default async function GroupPage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  const grp = productGroups.find(g => g.id === group);
  if (!grp) notFound();

  const products = getProductsByGroup(group);

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
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-orange-500 transition-colors">홈</Link>
          <span className="text-gray-200">›</span>
          <Link href="/products" className="hover:text-orange-500 transition-colors">상품 매뉴얼</Link>
          <span className="text-gray-200">›</span>
          <span className="text-gray-600">{grp.name}</span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-orange-100 flex items-center justify-center text-3xl">
            {grp.emoji}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{grp.name}</h2>
            <p className="text-sm text-gray-500">{products.length}개 상품</p>
          </div>
        </div>

        {grp.notices && grp.notices.length > 0 && (
          <div className="bg-orange-50/70 rounded-2xl border border-orange-100 p-6 mb-6">
            <h3 className="text-sm font-semibold text-orange-700 mb-3 flex items-center gap-2">
              <span>⚠️</span> 판매 시 주의사항
            </h3>
            <ul className="space-y-2">
              {grp.notices.map((notice, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5 shrink-0">•</span>
                  <span>{notice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-orange-100 p-10 text-center">
            <p className="text-gray-400">이 상품군에 등록된 상품이 없어요 📝</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl border border-orange-50 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-orange-50 flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{product.name}</h4>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {product.barcode && (
                        <span className="text-xs text-gray-400 font-mono">{product.barcode}</span>
                      )}
                      {product.brand && (
                        <span className="text-xs text-orange-400 bg-orange-50 px-2 py-0.5 rounded-full">{product.brand}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4">
                  {product.images && product.images.length > 0 && (
                    <div className="flex gap-3 mb-4 flex-wrap">
                      {product.images.map((image) => (
                        <div key={image.src} className="rounded-xl border border-orange-100 bg-orange-50/40 p-2">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={110}
                            height={110}
                            className="rounded-lg object-cover w-[110px] h-[110px]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs font-medium text-gray-400 mb-2">⚠️ 유의사항</p>
                  <ul className="space-y-2">
                    {product.notes.map((note, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-orange-300 mt-0.5 shrink-0">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
