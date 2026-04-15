'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { getSupabaseClient } from '@/lib/supabase';
import type { ReceiptItem } from '@/lib/receiving-types';

const STORE_OPTIONS = ['전체', '삼청점', '행궁점', '팝업'];

type ProductUploadRow = {
  barcode: string;
  name: string;
  sku: string | null;
};

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

function normalizeCell(value: unknown) {
  if (value == null) return '';
  return String(value).trim();
}

function parseProductRows(sheetRows: Record<string, unknown>[]) {
  const parsed: ProductUploadRow[] = [];

  for (const row of sheetRows) {
    const barcode = normalizeCell(row.barcode ?? row.Barcode ?? row.BARCODE ?? row['바코드']);
    const name = normalizeCell(row.name ?? row.Name ?? row.NAME ?? row['상품명'] ?? row['품목명']);
    const sku = normalizeCell(row.sku ?? row.SKU ?? row['품목코드'] ?? row['상품코드']);

    if (!barcode || !name) {
      continue;
    }

    parsed.push({
      barcode,
      name,
      sku: sku || null,
    });
  }

  return parsed;
}

export default function AdminClient() {
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [store, setStore] = useState('전체');
  const [date, setDate] = useState(todayDate());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [editingStore, setEditingStore] = useState('삼청점');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingProducts, setUploadingProducts] = useState(false);
  const [productUploadMessage, setProductUploadMessage] = useState('');

  async function loadItems() {
    const supabase = getSupabaseClient();
    setLoading(true);
    setError('');

    if (!supabase) {
      setLoading(false);
      setError('Supabase 환경 변수가 없습니다. Vercel 환경변수를 먼저 확인해 주세요.');
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

  function startEdit(item: ReceiptItem) {
    setEditingId(item.id);
    setEditingQuantity(item.quantity);
    setEditingStore(item.store);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingQuantity(1);
    setEditingStore('삼청점');
  }

  async function saveEdit(item: ReceiptItem) {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError('Supabase 환경 변수가 없습니다. Vercel 환경변수를 먼저 확인해 주세요.');
      return;
    }

    setSavingId(item.id);
    const { error: updateError } = await supabase
      .from('receipt_items')
      .update({ quantity: editingQuantity, store: editingStore })
      .eq('id', item.id);
    setSavingId(null);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    cancelEdit();
    await loadItems();
  }

  async function deleteItem(itemId: string) {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError('Supabase 환경 변수가 없습니다. Vercel 환경변수를 먼저 확인해 주세요.');
      return;
    }

    const confirmed = window.confirm('이 입고 항목을 삭제하시겠습니까?');
    if (!confirmed) return;

    setDeletingId(itemId);
    const { error: deleteError } = await supabase.from('receipt_items').delete().eq('id', itemId);
    setDeletingId(null);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (editingId === itemId) {
      cancelEdit();
    }

    await loadItems();
  }

  async function handleProductUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    setProductUploadMessage('');
    setError('');

    if (!file) {
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError('Supabase 환경 변수가 없습니다. Vercel 환경변수를 먼저 확인해 주세요.');
      return;
    }

    try {
      setUploadingProducts(true);
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        setProductUploadMessage('업로드할 시트를 찾지 못했습니다. 파일을 다시 확인해 주세요.');
        return;
      }

      const sheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
      const products = parseProductRows(rows);

      if (!products.length) {
        setProductUploadMessage('업로드 가능한 상품 데이터가 없습니다. 컬럼명은 barcode, name, sku 또는 바코드, 상품명 형식을 사용해 주세요.');
        return;
      }

      const { error: uploadError } = await supabase.from('products').upsert(products, { onConflict: 'barcode' });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      setProductUploadMessage(`${products.length}개 상품을 업로드했습니다. 같은 바코드는 최신 값으로 업데이트했습니다.`);
    } catch (uploadError) {
      console.error(uploadError);
      setError('파일을 읽는 중 오류가 발생했습니다. 엑셀 또는 CSV 형식을 다시 확인해 주세요.');
    } finally {
      setUploadingProducts(false);
    }
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
          <p className="mt-2 text-sm text-gray-500">매장별, 날짜별 입고 내역을 조회하고 CSV로 내려받을 수 있습니다.</p>
        </div>
        <a href="/receiving" className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50">
          입고 등록으로 돌아가기
        </a>
      </div>

      <section className="mb-6 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">상품 리스트 업로드</h2>
            <p className="mt-2 text-sm text-gray-500">엑셀 또는 CSV 파일로 상품 마스터를 한 번에 등록할 수 있습니다. 중복 바코드는 최신 값으로 업데이트됩니다.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100">
            <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleProductUpload} disabled={uploadingProducts} />
            {uploadingProducts ? '업로드 중...' : '엑셀/CSV 파일 업로드'}
          </label>
        </div>
        <div className="mt-4 rounded-2xl border border-dashed border-orange-200 bg-orange-50/30 p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-800">권장 컬럼명</p>
          <p className="mt-2">- `barcode` 또는 `바코드`</p>
          <p>- `name` 또는 `상품명`</p>
          <p>- `sku` 또는 `품목코드` (선택)</p>
        </div>
        {productUploadMessage ? <p className="mt-4 text-sm font-medium text-emerald-600">{productUploadMessage}</p> : null}
        {error ? <p className="mt-4 text-sm font-medium text-red-500">{error}</p> : null}
      </section>

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
                  <th className="px-4 py-3 font-semibold">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50 bg-white">
                {items.length ? (
                  items.map((item) => {
                    const isEditing = editingId === item.id;
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-3">{new Date(item.created_at).toLocaleString('ko-KR')}</td>
                        <td className="px-4 py-3">{item.received_date}</td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <select value={editingStore} onChange={(event) => setEditingStore(event.target.value)} className="min-h-10 rounded-xl border border-orange-100 bg-orange-50/40 px-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white">
                              {STORE_OPTIONS.filter((option) => option !== '전체').map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            item.store
                          )}
                        </td>
                        <td className="px-4 py-3">{item.barcode}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{item.product_name}</td>
                        <td className="px-4 py-3 font-semibold text-gray-700">
                          {isEditing ? (
                            <input type="number" min={1} value={editingQuantity} onChange={(event) => setEditingQuantity(Number(event.target.value) || 1)} className="min-h-10 w-24 rounded-xl border border-orange-100 bg-orange-50/40 px-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white" />
                          ) : (
                            item.quantity
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {isEditing ? (
                              <>
                                <button className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => saveEdit(item)} disabled={savingId === item.id}>
                                  {savingId === item.id ? '저장 중...' : '저장'}
                                </button>
                                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50" type="button" onClick={cancelEdit}>
                                  취소
                                </button>
                              </>
                            ) : (
                              <button className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-50" type="button" onClick={() => startEdit(item)}>
                                수정
                              </button>
                            )}
                            <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => deleteItem(item.id)} disabled={deletingId === item.id}>
                              {deletingId === item.id ? '삭제 중...' : '삭제'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-gray-400" colSpan={7}>조건에 맞는 내역이 없습니다.</td>
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
