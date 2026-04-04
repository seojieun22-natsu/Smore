import Link from 'next/link';
import { categories, getPagesByCategory } from '@/lib/content';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return categories.map(cat => ({ category: cat.id }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = categories.find(c => c.id === category);
  if (!cat) notFound();

  const pages = getPagesByCategory(category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-[#FFF1E6]">
      <header className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/" className="text-2xl hover:scale-110 transition-transform">🔥</Link>
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
            {cat.emoji}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{cat.name}</h2>
            <p className="text-sm text-gray-500">{cat.description}</p>
          </div>
        </div>

        {pages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-orange-100 p-10 text-center">
            <p className="text-gray-400">아직 등록된 문서가 없어요 📝</p>
            <p className="text-xs text-gray-300 mt-2">content/{category}/ 폴더에 .md 파일을 추가해주세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pages.map(page => (
              <Link
                key={page.slug}
                href={`/manual/${category}/${page.slug}`}
                className="block bg-white rounded-xl border border-orange-50 p-6 hover:shadow-md hover:border-orange-200 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors mb-1">{page.title}</h3>
                <p className="text-sm text-gray-500">{page.description}</p>
                {page.updatedAt && (
                  <p className="text-xs text-gray-300 mt-3">최종 수정: {page.updatedAt}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
