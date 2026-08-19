import AuthProvider from "@/component/AuthProvider";

export default function FullscreenLayout({ children }: { children: React.ReactNode }) {
  return <body className="bg-[#0a0a0a]">
  <AuthProvider>{children}</AuthProvider>
</body>
}
