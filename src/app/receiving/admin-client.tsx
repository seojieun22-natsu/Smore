'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import type { ReceiptItem } from '@/lib/receiving-types';

const STORE_OPTIONS = ['전체', '삼청점', '행궁점', '팝업'];

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function downloadCsv(rows: ReceiptItem[]) {
  const header = ['created_at', 'received_date', 'store', 'barcode', 'product_name', 'quantity'];
  const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = [header.join(',')]
    .concat(
      rows.map((row) =>
        [row.created_at, row.received_date, row.store, row.barcode, row.product_name, row.quantity]
          .map(escape)
          .join(','),
      ),
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt-items-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminClient() {
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [store, setStore] = useState('전체');
  const [date, setDate] = useState(todayDate());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadItems() {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError('');

    if (!supabase) {
      setLoading(false);
      setError('Supabase 환경 변수가 없어. Vercel 환경변수부터 확인해줘.');
      return;
    }

    let query = supabase.from('receipt_items').select('*').order('created_at', { ascending: false }).eq('received_date', date);

    if (store !== '전체') {
      query = query.eq('store', store);
    }

    const { data, error: queryError } = await query;
    setLoading(false);

    if (queryError) {
      setError(queryError.message);
      return;
    }

    setItems((data ?? []) as ReceiptItem[]);
  }

  useEffect(() => {
    loadItems();
  }, []);

  const totalQuantity = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-orange-500">SMORE 테스트 도구</p>
          <h1 className="text-3xl font-bold text-gray-900">입고 관리자 조회</h1>
          <p className="mt-2 text-sm text-gray-500">매장별, 날짜별 입고 내역을 조회하고 CSV로 내려받아.</p>
        </div>
        <a href="/receiving" className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50">
          입고 등록으로 돌아가기
        </a>
      </div>

      <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-[220px_220px_1fr]">
          <div>
            <label htmlFor="admin-store" className="mb-2 block text-sm font-medium text-gray-700">Store</label>
            <select id="admin-store" value={store} onChange={(event) => setStore(event.target.value)} className="min-h-14 w-full rounded-2xl border border-orange-100 bg-orange-50/40 px-4 text-base outline-none transition focus:border-orange-300 focus:bg-white">
              {STORE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="admin-date" className="mb-2 block text-sm font-medium text-gray-700">Date</label>
            <input id="admin-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="min-h-14 w-full rounded-2xl border border-orange-100 bg-orange-50/40 px-4 text-base outline-none transition focus:border-orange-300 focus:bg-white" />
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <button className="min-h-14 rounded-2xl bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300" type="button" onClick={loadItems} disabled={loading}>
              {loading ? '불러오는 중...' : '필터 적용'}
            </button>
            <button className="min-h-14 rounded-2xl border border-orange-200 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => downloadCsv(items)} disabled={!items.length}>
              CSV 내보내기
            </button>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm font-medium text-red-500">{error}</p> : null}
        <p className="mt-4 text-sm text-gray-500">총 {items.length}건, 수량 합계 {totalQuantity}</p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-orange-100">
          <div className="max-h-[640px] overflow-auto">
            <table className="min-w-full divide-y divide-orange-100 text-sm">
              <thead className="bg-orange-50 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">등록시각</th>
                  <th className="px-4 py-3 font-semibold">입고일</th>
                  <th className="px-4 py-3 font-semibold">매장</th>
                  <th className="px-4 py-3 font-semibold">바코드</th>
                  <th className="px-4 py-3 font-semibold">상품명</th>
                  <th className="px-4 py-3 font-semibold">수량</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50 bg-white">
                {items.length ? (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{new Date(item.created_at).toLocaleString('ko-KR')}</td>
                      <td className="px-4 py-3">{item.received_date}</td>
                      <td className="px-4 py-3">{item.store}</td>
                      <td className="px-4 py-3">{item.barcode}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{item.product_name}</td>
                      <td className="px-4 py-3 font-semibold text-gray-700">{item.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-gray-400" colSpan={6}>조건에 맞는 내역이 없어.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
