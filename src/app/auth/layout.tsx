/**
 * auth 配下を動的レンダリングに固定（useSearchParams のプリレンダエラー回避）
 */
export const dynamic = 'force-dynamic';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
