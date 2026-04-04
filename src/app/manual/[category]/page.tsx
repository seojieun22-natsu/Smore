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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/" className="text-3xl hover:scale-110 transition-transform">🐿️</Link>
          <div>
            <h1 className="text-xl font-bold text-amber-900">SMORE 매뉴얼</h1>
            <p className="text-sm text-amber-600">스모어 운영 가이드북</p>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-8">
        <Link href="/" className="text-amber-600 hover:text-amber-800 text-sm mb-4 inline-block">
          ← 홈으로
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">{cat.emoji}</span>
          <div>
            <h2 className="text-2xl font-bold text-amber-900">{cat.name}</h2>
            <p className="text-amber-600">{cat.description}</p>
          </div>
        </div>

        {pages.length === 0 ? (
          <div className="bg-white rounded-xl border border-amber-100 p-8 text-center">
            <p className="text-gray-500">아직 등록된 문서가 없어요 📝</p>
            <p className="text-sm text-gray-400 mt-2">content/{category}/ 폴더에 .md 파일을 추가해주세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pages.map(page => (
              <Link
                key={page.slug}
                href={`/manual/${category}/${page.slug}`}
                className="block bg-white rounded-xl border border-amber-100 p-5 hover:shadow-md hover:border-amber-300 transition-all"
              >
                <h3 className="font-semibold text-amber-900 mb-1">{page.title}</h3>
                <p className="text-sm text-gray-600">{page.description}</p>
                {page.updatedAt && (
                  <p className="text-xs text-amber-400 mt-2">최종 수정: {page.updatedAt}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
