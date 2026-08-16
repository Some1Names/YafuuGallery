import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
// import { auth } from "@/auth"; // uncomment once auth is wired back up

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  // const session = await auth();
  const user = null; // = session?.user ?? null, once auth resumes

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}