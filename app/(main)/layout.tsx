import { Suspense } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import SmoothScroll from "@/component/SmoothScroll";
import { auth } from "@/auth";
import { getNewChapterTotal } from "@/lib/favorite-updates";

// auth() reads cookies(), which makes it "uncached/runtime" data — per
// Next's loading.js docs, uncached data read directly in a layout (rather
// than a page) blocks the whole navigation instead of letting the route's
// loading.tsx show a fallback while it resolves, since loading.tsx only
// wraps page.js, not the layout it sits in. Isolating the auth() call in
// its own child component wrapped in Suspense here keeps the rest of the
// layout (and therefore page-level loading.tsx) non-blocking, so phone
// users on a slower connection actually see the spinner instead of the
// browser just sitting on the old page until the session lookup finishes.
async function NavbarWithSession() {
  const session = await auth();

  // session.user.name/image can be `undefined` per NextAuth's default type,
  // but Navbar expects `string | null` — normalize here so Navbar's prop
  // type can stay strict instead of loosening it to match NextAuth's shape
  const user = session?.user
    ? { name: session.user.name ?? null, tag: session.user.tag ?? null, image: session.user.image ?? null }
    : null;

  // The Favorites link's "new chapters" dot. Cheap: one small bookmarks
  // read + one COUNT. Re-read whenever this layout re-renders — on hard
  // loads, on coming back from the (fullscreen) viewer, and router.refresh().
  const newChapterCount = session?.user?.id ? await getNewChapterTotal(session.user.id) : 0;

  return <Navbar user={user} newChapterCount={newChapterCount} />;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SmoothScroll />
      <Suspense fallback={<Navbar user={null} />}>
        <NavbarWithSession />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}