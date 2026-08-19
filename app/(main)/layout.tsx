import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { auth } from "@/auth";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // session.user.name/image can be `undefined` per NextAuth's default type,
  // but Navbar expects `string | null` — normalize here so Navbar's prop
  // type can stay strict instead of loosening it to match NextAuth's shape
  const user = session?.user
    ? { name: session.user.name ?? null, image: session.user.image ?? null }
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}