'use client';

import { useState } from 'react';
import { searchProducts, Product } from '@/data/products';

export default function ProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length > 0) {
      setResults(searchProducts(value));
      setHasSearched(true);
    } else {
      setResults([]);
      setHasSearched(false);
    }
  };

  return (
    <div>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="상품명 또는 바코드로 검색..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-orange-100 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none text-sm text-gray-700 placeholder-gray-300 shadow-sm transition-all"
        />
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="mt-4">
          {results.length === 0 ? (
            <div className="bg-white rounded-xl border border-orange-50 p-6 text-center">
              <p className="text-gray-400 text-sm">검색 결과가 없어요 🔍</p>
              <p className="text-gray-300 text-xs mt-1">다른 키워드로 검색해보세요</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-400">{results.length}개 상품 발견</p>
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl border border-orange-50 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-orange-50 flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-800 text-sm">{product.name}</h4>
          <div className="flex items-center gap-3 mt-1">
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
  );
}
