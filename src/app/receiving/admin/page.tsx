import type { Metadata } from 'next';
import AdminClient from '../admin-client';

export const metadata: Metadata = {
  title: '입고 관리자 조회 | SMORE 매뉴얼',
  description: '매장 입고 내역을 조회하고 CSV로 다운로드하는 테스트 도구',
};

export default function ReceivingAdminPage() {
  return <AdminClient />;
}
