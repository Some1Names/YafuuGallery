import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { auth } from "@/auth";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}