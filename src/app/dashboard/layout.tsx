/**
 * ダッシュボード用レイアウト
 * このファイルにより /dashboard ルートが確実に認識される
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
