import type { Metadata } from 'next';
import ReceivingClient from './receiving-client';

export const metadata: Metadata = {
  title: '입고 등록 | SMORE 매뉴얼',
  description: '매장 입고 수량을 바코드 기반으로 등록하는 테스트 도구',
};

export default function ReceivingPage() {
  return <ReceivingClient />;
}
