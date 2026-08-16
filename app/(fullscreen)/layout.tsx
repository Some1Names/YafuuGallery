// No navbar, deliberately. Reader and auth pages get the full viewport.
export default function FullscreenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
