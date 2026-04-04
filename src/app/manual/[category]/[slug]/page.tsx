import Link from 'next/link';
import { categories, getPageContent, getPagesByCategory } from '@/lib/content';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return categories.flatMap(cat =>
    getPagesByCategory(cat.id).map(page => ({
      category: cat.id,
      slug: page.slug,
    }))
  );
}

export default async function ManualPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const cat = categories.find(c => c.id === category);
  if (!cat) notFound();

  const page = await getPageContent(category, slug);
  if (!page) notFound();

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
        <div className="flex items-center gap-2 text-sm text-amber-600 mb-6">
          <Link href="/" className="hover:text-amber-800">홈</Link>
          <span>›</span>
          <Link href={`/manual/${category}`} className="hover:text-amber-800">{cat.emoji} {cat.name}</Link>
          <span>›</span>
          <span className="text-amber-900">{page.title}</span>
        </div>

        <article className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8">
          {page.updatedAt && (
            <p className="text-xs text-amber-400 mb-4">최종 수정: {page.updatedAt}</p>
          )}
          <div
            className="prose prose-amber max-w-none
              prose-headings:text-amber-900
              prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4
              prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-3
              prose-h3:text-lg prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-2
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-li:text-gray-700
              prose-strong:text-amber-800
              prose-a:text-amber-600 prose-a:hover:text-amber-800
              prose-blockquote:border-amber-300 prose-blockquote:text-amber-700
              prose-table:text-sm
              prose-th:bg-amber-50 prose-th:text-amber-900
              prose-td:border-amber-100"
            dangerouslySetInnerHTML={{ __html: page.htmlContent || '' }}
          />
        </article>

        <div className="mt-6 flex justify-between">
          <Link href={`/manual/${category}`} className="text-amber-600 hover:text-amber-800 text-sm">
            ← {cat.name} 목록
          </Link>
        </div>
      </section>
    </div>
  );
}
