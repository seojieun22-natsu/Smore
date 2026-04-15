'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserCodeReader, BrowserMultiFormatReader } from '@zxing/browser';
import { getSupabaseClient } from '@/lib/supabase';
import type { Product, ReceiptItem } from '@/lib/receiving-types';

const STORE_OPTIONS = ['삼청점', '행궁점', '팝업'];

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function ReceivingClient() {
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [store, setStore] = useState(STORE_OPTIONS[0]);
  const [product, setProduct] = useState<Product | null>(null);
  const [lookupMessage, setLookupMessage] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'error' | 'success'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [saving, setSaving] = useState(false);
  const [todayItems, setTodayItems] = useState<ReceiptItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [scanError, setScanError] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserCodeReader | null>(null);
  const lastScannedRef = useRef('');
  const scanCooldownRef = useRef<number | null>(null);

  const canSave = useMemo(() => Boolean(barcode.trim() && quantity > 0 && product), [barcode, quantity, product]);

  async function loadTodayItems() {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setStatus({ type: 'error', message: 'Supabase 환경 변수가 없습니다. Vercel 환경변수를 먼저 확인해 주세요.' });
      return;
    }

    const { data, error } = await supabase
      .from('receipt_items')
      .select('*')
      .eq('received_date', todayDate())
      .order('created_at', { ascending: false });

    if (error) {
      setStatus({ type: 'error', message: error.message });
      return;
    }

    setTodayItems((data ?? []) as ReceiptItem[]);
  }

  function resetForm() {
    setBarcode('');
    setQuantity(1);
    setStore(STORE_OPTIONS[0]);
    setProduct(null);
    setLookupMessage('');
    setEditingId(null);
    setStatus({ type: 'idle', message: '' });
  }

  async function lookupProduct(value: string) {
    const trimmed = value.trim();
    const supabase = getSupabaseClient();
    setBarcode(trimmed);
    setStatus({ type: 'idle', message: '' });

    if (!supabase) {
      setProduct(null);
      setLookupMessage('Supabase 환경 변수가 없습니다. Vercel 환경변수를 먼저 확인해 주세요.');
      return;
    }

    if (!trimmed) {
      setProduct(null);
      setLookupMessage('');
      return;
    }

    setLoadingLookup(true);
    const { data, error } = await supabase
      .from('products')
      .select('barcode, name, sku')
      .eq('barcode', trimmed)
      .maybeSingle();
    setLoadingLookup(false);

    if (error) {
      setProduct(null);
      setLookupMessage('');
      setStatus({ type: 'error', message: error.message });
      return;
    }

    if (!data) {
      setProduct(null);
      setLookupMessage('상품을 찾지 못했습니다. 바코드를 다시 확인해 주세요.');
      return;
    }

    setProduct(data as Product);
    setLookupMessage('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSave || !product) {
      setStatus({ type: 'error', message: '상품 조회 후 수량을 확인해 주세요.' });
      return;
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      setStatus({ type: 'error', message: 'Supabase 환경 변수가 없습니다. Vercel 환경변수를 먼저 확인해 주세요.' });
      return;
    }

    setSaving(true);
    const payload = {
      barcode: product.barcode,
      product_name: product.name,
      quantity,
      store,
      received_date: todayDate(),
    };

    const result = editingId
      ? await supabase.from('receipt_items').update(payload).eq('id', editingId)
      : await supabase.from('receipt_items').insert(payload);

    setSaving(false);

    if (result.error) {
      setStatus({ type: 'error', message: result.error.message });
      return;
    }

    setStatus({
      type: 'success',
      message: editingId ? '입고 항목이 수정되었습니다.' : '입고 항목이 저장되었습니다.',
    });
    resetForm();
    await loadTodayItems();
  }

  function handleEdit(item: ReceiptItem) {
    setEditingId(item.id);
    setBarcode(item.barcode);
    setQuantity(item.quantity);
    setStore(item.store);
    setProduct({ barcode: item.barcode, name: item.product_name, sku: null });
    setLookupMessage('');
    setStatus({ type: 'idle', message: '' });
  }

  async function handleDelete(itemId: string) {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setStatus({ type: 'error', message: 'Supabase 환경 변수가 없습니다. Vercel 환경변수를 먼저 확인해 주세요.' });
      return;
    }

    const confirmed = window.confirm('이 입고 항목을 삭제하시겠습니까?');
    if (!confirmed) return;

    setDeletingId(itemId);
    const { error } = await supabase.from('receipt_items').delete().eq('id', itemId);
    setDeletingId(null);

    if (error) {
      setStatus({ type: 'error', message: error.message });
      return;
    }

    if (editingId === itemId) {
      resetForm();
    }

    setStatus({ type: 'success', message: '입고 항목이 삭제되었습니다.' });
    await loadTodayItems();
  }

  function startScanner() {
    setScanError('');
    setScannerOpen(true);
    setScannerReady(false);
  }

  useEffect(() => {
    if (!scannerOpen || !videoRef.current) return;

    let cancelled = false;

    async function bootScanner() {
      try {
        if (!readerRef.current) {
          readerRef.current = new BrowserMultiFormatReader() as BrowserCodeReader;
        }

        const reader = readerRef.current;
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const devices = await BrowserCodeReader.listVideoInputDevices();
        const backCamera = devices.find((device) => /back|rear|environment/gi.test(device.label)) ?? devices[0];

        if (!backCamera) {
          if (!cancelled) {
            setScanError('사용 가능한 카메라를 찾지 못했습니다.');
          }
          return;
        }

        await reader.decodeFromVideoDevice(backCamera.deviceId, videoElement, async (result, error) => {
          if (cancelled) return;

          if (result) {
            const text = result.getText();

            if (lastScannedRef.current === text) {
              return;
            }

            lastScannedRef.current = text;
            if (scanCooldownRef.current) {
              window.clearTimeout(scanCooldownRef.current);
            }
            scanCooldownRef.current = window.setTimeout(() => {
              lastScannedRef.current = '';
            }, 1500);

            await lookupProduct(text);
            setStatus({ type: 'success', message: '바코드를 스캔했습니다. 카메라는 계속 켜져 있습니다.' });
            return;
          }

          if (error && error.name !== 'NotFoundException') {
            setScanError('바코드 스캔 중 오류가 발생했습니다. 다시 시도해 주세요.');
          }
        });

        if (!cancelled) {
          setScannerReady(true);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setScanError('카메라를 열지 못했습니다. 브라우저 권한을 확인해 주세요.');
          setScannerReady(false);
        }
      }
    }

    bootScanner();

    return () => {
      cancelled = true;
    };
  }, [scannerOpen]);

  function stopScanner() {
    if (scanCooldownRef.current) {
      window.clearTimeout(scanCooldownRef.current);
      scanCooldownRef.current = null;
    }
    lastScannedRef.current = '';

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setScannerOpen(false);
    setScannerReady(false);
  }

  useEffect(() => {
    loadTodayItems();

    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-orange-500">SMORE 테스트 도구</p>
          <h1 className="text-3xl font-bold text-gray-900">매장 입고 등록</h1>
          <p className="mt-2 text-sm text-gray-500">바코드 조회, 수량 입력, 오늘 등록 내역 확인까지 한 번에 진행할 수 있습니다.</p>
        </div>
        <a href="/receiving/admin" className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50">
          관리자 조회 보기
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">입고 등록</h2>
              <p className="mt-2 text-sm text-gray-500">태블릿 또는 휴대폰에서 바코드를 스캔한 뒤 수량만 입력하면 바로 저장됩니다.</p>
            </div>
            {editingId ? (
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">수정 모드</span>
            ) : null}
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="barcode" className="mb-2 block text-sm font-medium text-gray-700">Barcode</label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="barcode"
                  inputMode="numeric"
                  autoFocus
                  placeholder="스캔하거나 입력해 주세요"
                  value={barcode}
                  onChange={(event) => {
                    setBarcode(event.target.value);
                    setProduct(null);
                    setLookupMessage('');
                  }}
                  onBlur={(event) => lookupProduct(event.target.value)}
                  className="min-h-14 flex-1 rounded-2xl border border-orange-100 bg-orange-50/40 px-4 text-base outline-none transition focus:border-orange-300 focus:bg-white"
                />
                <button className="min-h-14 rounded-2xl border border-orange-200 bg-orange-50 px-5 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => lookupProduct(barcode)} disabled={loadingLookup}>
                  {loadingLookup ? '조회 중...' : '상품 조회'}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                <button className="rounded-2xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50" type="button" onClick={scannerOpen ? stopScanner : startScanner}>
                  {scannerOpen ? '카메라 스캔 닫기' : '카메라로 바코드 스캔'}
                </button>
                <p className="text-xs text-gray-500">휴대폰에서는 카메라 권한 허용 후 바코드를 화면 중앙에 맞춰 주세요. 한 번 열면 연속으로 스캔할 수 있습니다.</p>
              </div>
            </div>

            {scannerOpen ? (
              <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-800">카메라 스캔</p>
                  <span className="text-xs text-gray-500">{scannerReady ? '연속 스캔 준비 완료' : '카메라 연결 중...'}</span>
                </div>
                <div className="overflow-hidden rounded-2xl border border-orange-100 bg-black">
                  <video ref={videoRef} className="h-[280px] w-full object-cover" muted playsInline />
                </div>
                {scanError ? <p className="mt-3 text-sm font-medium text-red-500">{scanError}</p> : null}
              </div>
            ) : null}

            <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/40 p-4">
              <div className="mb-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-500">상품 정보</div>
              {product ? (
                <div className="space-y-1">
                  <strong className="block text-lg text-gray-900">{product.name}</strong>
                  <p className="text-sm text-gray-500">Barcode: {product.barcode}</p>
                  {product.sku ? <p className="text-sm text-gray-500">SKU: {product.sku}</p> : null}
                </div>
              ) : (
                <p className="text-sm text-gray-400">조회된 상품이 아직 없습니다.</p>
              )}
              {lookupMessage ? <p className="mt-3 text-sm font-medium text-red-500">{lookupMessage}</p> : null}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(Number(event.target.value) || 1)}
                  className="min-h-14 w-full rounded-2xl border border-orange-100 bg-orange-50/40 px-4 text-base outline-none transition focus:border-orange-300 focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="store" className="mb-2 block text-sm font-medium text-gray-700">Store</label>
                <select
                  id="store"
                  value={store}
                  onChange={(event) => setStore(event.target.value)}
                  className="min-h-14 w-full rounded-2xl border border-orange-100 bg-orange-50/40 px-4 text-base outline-none transition focus:border-orange-300 focus:bg-white"
                >
                  {STORE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {status.message ? (
              <p className={`text-sm font-medium ${status.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>
                {status.message}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button className="min-h-14 rounded-2xl bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300" type="submit" disabled={!canSave || saving}>
                {saving ? '저장 중...' : editingId ? '입고 항목 수정' : '입고 수량 저장'}
              </button>
              <button className="min-h-14 rounded-2xl border border-orange-200 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:bg-orange-50" type="button" onClick={resetForm}>
                {editingId ? '수정 취소' : '초기화'}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">오늘 등록된 항목</h2>
          <p className="mt-2 text-sm text-gray-500">{todayDate()} 기준</p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-orange-100">
            <div className="max-h-[560px] overflow-auto">
              <table className="min-w-full divide-y divide-orange-100 text-sm">
                <thead className="bg-orange-50 text-left text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">시간</th>
                    <th className="px-4 py-3 font-semibold">매장</th>
                    <th className="px-4 py-3 font-semibold">상품</th>
                    <th className="px-4 py-3 font-semibold">수량</th>
                    <th className="px-4 py-3 font-semibold">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50 bg-white">
                  {todayItems.length ? (
                    todayItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">{new Date(item.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="px-4 py-3">{item.store}</td>
                        <td className="px-4 py-3">
                          <strong className="block text-gray-900">{item.product_name}</strong>
                          <span className="text-xs text-gray-400">{item.barcode}</span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700">{item.quantity}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-50" type="button" onClick={() => handleEdit(item)}>
                              수정
                            </button>
                            <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => handleDelete(item.id)} disabled={deletingId === item.id}>
                              {deletingId === item.id ? '삭제 중...' : '삭제'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-10 text-center text-sm text-gray-400" colSpan={5}>오늘 등록된 항목이 아직 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
