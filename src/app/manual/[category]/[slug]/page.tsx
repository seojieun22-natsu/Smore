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
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-orange-500 transition-colors">홈</Link>
          <span className="text-gray-200">›</span>
          <Link href={`/manual/${category}`} className="hover:text-orange-500 transition-colors">{cat.name}</Link>
          <span className="text-gray-200">›</span>
          <span className="text-gray-600">{page.title}</span>
        </div>

        <article className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
          {/* Title bar */}
          <div className="px-8 py-6 border-b border-orange-50 bg-gradient-to-r from-orange-50/50 to-transparent">
            <h1 className="text-xl font-bold text-gray-800">{page.title}</h1>
            {page.updatedAt && (
              <p className="text-xs text-gray-400 mt-1">최종 수정: {page.updatedAt}</p>
            )}
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div
              className="prose prose-sm max-w-none
                prose-headings:text-gray-800
                prose-h1:text-xl prose-h1:font-bold prose-h1:mb-4 prose-h1:hidden
                prose-h2:text-lg prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-orange-100
                prose-h3:text-base prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-2
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-li:text-gray-600
                prose-strong:text-gray-700
                prose-a:text-orange-500 prose-a:hover:text-orange-700 prose-a:no-underline prose-a:hover:underline
                prose-blockquote:border-orange-200 prose-blockquote:text-gray-500 prose-blockquote:bg-orange-50/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1
                prose-table:text-sm
                prose-th:bg-orange-50 prose-th:text-gray-700 prose-th:font-medium
                prose-td:border-orange-100
                prose-hr:border-orange-100
                prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs"
              dangerouslySetInnerHTML={{ __html: page.htmlContent || '' }}
            />
          </div>
        </article>

        <div className="mt-6">
          <Link href={`/manual/${category}`} className="text-orange-400 hover:text-orange-600 text-sm inline-flex items-center gap-1 transition-colors">
            <span>←</span> <span>{cat.name} 목록</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
