'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { adminPassword, getSupabaseClient } from '@/lib/supabase';
import type { ProductUploadLog, ReceiptItem } from '@/lib/receiving-types';

const STORE_OPTIONS = ['전체', '삼청점', '행궁점', '팝업'];
const PRODUCT_TEMPLATE_HEADERS = ['barcode', 'name', 'sku'];

type ProductUploadRow = {
  barcode: string;
  name: string;
  sku: string | null;
};

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function downloadCsv(rows: ReceiptItem[]) {
  const header = ['created_at', 'received_date', 'store', 'manager_name', 'barcode', 'product_name', 'quantity'];
  const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = [header.join(',')]
    .concat(
      rows.map((row) =>
        [row.created_at, row.received_date, row.store, row.manager_name ?? '', row.barcode, row.product_name, row.quantity]
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

function downloadProductTemplate() {
  const worksheet = XLSX.utils.aoa_to_sheet([
    PRODUCT_TEMPLATE_HEADERS,
    ['8800323770060', '주토피아 토이카메라_투게더', 'SKU-001'],
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'products');
  XLSX.writeFile(workbook, 'smore-product-upload-template.xlsx');
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
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [uploadLogs, setUploadLogs] = useState<ProductUploadLog[]>([]);
  const [store, setStore] = useState('전체');
  const [date, setDate] = useState(todayDate());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [editingStore, setEditingStore] = useState('삼청점');
  const [editingManagerName, setEditingManagerName] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingProducts, setUploadingProducts] = useState(false);
  const [productUploadMessage, setProductUploadMessage] = useState('');
  const [deletingItems, setDeletingItems] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordError, setPasswordError] = useState('');

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
    setSelectedItemIds([]);
  }

  async function loadUploadLogs() {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return;
    }

    const { data, error: logError } = await supabase
      .from('product_upload_logs')
      .select('id, file_name, uploaded_count, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (logError) {
      console.error(logError);
      return;
    }

    setUploadLogs((data ?? []) as ProductUploadLog[]);
  }

  function startEdit(item: ReceiptItem) {
    setEditingId(item.id);
    setEditingQuantity(item.quantity);
    setEditingStore(item.store);
    setEditingManagerName(item.manager_name ?? '');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingQuantity(1);
    setEditingStore('삼청점');
    setEditingManagerName('');
  }

  function toggleItemSelection(itemId: string) {
    setSelectedItemIds((current) =>
      current.includes(itemId) ? current.filter((value) => value !== itemId) : [...current, itemId],
    );
  }

  function toggleAllItems() {
    setSelectedItemIds((current) => (current.length === items.length ? [] : items.map((item) => item.id)));
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
      .update({ quantity: editingQuantity, store: editingStore, manager_name: editingManagerName.trim() })
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

  async function deleteSelectedItems() {
    if (!selectedItemIds.length) {
      setProductUploadMessage('삭제할 입고 내역을 먼저 선택해 주세요.');
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError('Supabase 환경 변수가 없습니다. Vercel 환경변수를 먼저 확인해 주세요.');
      return;
    }

    const confirmed = window.confirm(`선택한 입고 내역 ${selectedItemIds.length}건을 삭제하시겠습니까?`);
    if (!confirmed) return;

    setDeletingItems(true);
    setProductUploadMessage('');
    setError('');

    const { error: deleteError } = await supabase.from('receipt_items').delete().in('id', selectedItemIds);
    setDeletingItems(false);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setProductUploadMessage(`${selectedItemIds.length}건의 입고 내역을 삭제했습니다.`);
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
      const productsToUpload = parseProductRows(rows);

      if (!productsToUpload.length) {
        setProductUploadMessage('업로드 가능한 상품 데이터가 없습니다. 컬럼명은 barcode, name, sku 또는 바코드, 상품명 형식을 사용해 주세요.');
        return;
      }

      const { error: uploadError } = await supabase.from('products').upsert(productsToUpload, { onConflict: 'barcode' });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const { error: logInsertError } = await supabase.from('product_upload_logs').insert({
        file_name: file.name,
        uploaded_count: productsToUpload.length,
      });

      if (logInsertError) {
        console.error(logInsertError);
      }

      await loadUploadLogs();
      setProductUploadMessage(`${productsToUpload.length}개 상품을 업로드했습니다. 같은 바코드는 최신 값으로 업데이트했습니다.`);
    } catch (uploadError) {
      console.error(uploadError);
      setError('파일을 읽는 중 오류가 발생했습니다. 엑셀 또는 CSV 형식을 다시 확인해 주세요.');
    } finally {
      setUploadingProducts(false);
    }
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminPassword) {
      setPasswordError('관리자 비밀번호 환경변수가 아직 설정되지 않았습니다.');
      return;
    }

    if (passwordInput === adminPassword) {
      setIsAuthorized(true);
      setPasswordError('');
      return;
    }

    setPasswordError('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
  }

  useEffect(() => {
    if (!isAuthorized) return;

    loadItems();
    loadUploadLogs();
  }, [isAuthorized]);

  const totalQuantity = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const allItemsSelected = items.length > 0 && selectedItemIds.length === items.length;

  if (!isAuthorized) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-10">
        <section className="w-full rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-orange-500">SMORE 관리자 모드</p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">비밀번호 입력</h1>
          <p className="mt-2 text-sm text-gray-500">관리자 화면은 비밀번호를 입력해야 확인할 수 있습니다.</p>

          <form className="mt-6 space-y-4" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-gray-700">비밀번호</label>
              <input
                id="admin-password"
                type="password"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
                className="min-h-14 w-full rounded-2xl border border-orange-100 bg-orange-50/40 px-4 text-base outline-none transition focus:border-orange-300 focus:bg-white"
                placeholder="관리자 비밀번호를 입력해 주세요"
              />
            </div>
            {passwordError ? <p className="text-sm font-medium text-red-500">{passwordError}</p> : null}
            <button type="submit" className="min-h-14 w-full rounded-2xl bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600">
              관리자 모드 열기
            </button>
          </form>
        </section>
      </div>
    );
  }

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
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={downloadProductTemplate} className="inline-flex items-center rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50">
              샘플 양식 다운로드
            </button>
            <label className="inline-flex cursor-pointer items-center rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100">
              <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleProductUpload} disabled={uploadingProducts} />
              {uploadingProducts ? '업로드 중...' : '엑셀/CSV 파일 업로드'}
            </label>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-dashed border-orange-200 bg-orange-50/30 p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-800">권장 컬럼명</p>
          <p className="mt-2">- `barcode` 또는 `바코드`</p>
          <p>- `name` 또는 `상품명`</p>
          <p>- `sku` 또는 `품목코드` (선택)</p>
        </div>
        {productUploadMessage ? <p className="mt-4 text-sm font-medium text-emerald-600">{productUploadMessage}</p> : null}
        {error ? <p className="mt-4 text-sm font-medium text-red-500">{error}</p> : null}

        <div className="mt-5 rounded-2xl border border-orange-100 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-800">최근 업로드 기록</p>
            <span className="text-xs text-gray-400">최대 10건</span>
          </div>
          <div className="mt-3 space-y-2">
            {uploadLogs.length ? (
              uploadLogs.map((log) => (
                <div key={log.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-orange-50/50 px-3 py-2 text-sm text-gray-700">
                  <span className="font-medium text-gray-900">{log.file_name}</span>
                  <span>{log.uploaded_count}개 업로드</span>
                  <span className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString('ko-KR')}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">아직 업로드 기록이 없습니다.</p>
            )}
          </div>
        </div>
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
            <button className="min-h-14 rounded-2xl border border-red-200 bg-red-50 px-6 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={deleteSelectedItems} disabled={!selectedItemIds.length || deletingItems}>
              {deletingItems ? '삭제 중...' : `선택 내역 삭제${selectedItemIds.length ? ` (${selectedItemIds.length})` : ''}`}
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
                  <th className="px-4 py-3 font-semibold">
                    <input type="checkbox" checked={allItemsSelected} onChange={toggleAllItems} aria-label="전체 선택" />
                  </th>
                  <th className="px-4 py-3 font-semibold">등록시각</th>
                  <th className="px-4 py-3 font-semibold">입고일</th>
                  <th className="px-4 py-3 font-semibold">매장</th>
                  <th className="px-4 py-3 font-semibold">담당자</th>
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
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={selectedItemIds.includes(item.id)} onChange={() => toggleItemSelection(item.id)} aria-label={`${item.product_name} 선택`} />
                        </td>
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
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input value={editingManagerName} onChange={(event) => setEditingManagerName(event.target.value)} className="min-h-10 w-28 rounded-xl border border-orange-100 bg-orange-50/40 px-3 text-sm outline-none transition focus:border-orange-300 focus:bg-white" />
                          ) : (
                            item.manager_name ?? '-'
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
                    <td className="px-4 py-10 text-center text-sm text-gray-400" colSpan={9}>조건에 맞는 내역이 없습니다.</td>
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
