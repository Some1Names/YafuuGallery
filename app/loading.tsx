// Next.js shows this automatically while a page you're navigating to is
// still fetching its data — no manual wiring per link/button needed. Sits at
// the root so it's the fallback for every route; a page can add its own
// loading.tsx later if it wants something more specific than this spinner.
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-10 h-10 rounded-full border-2 border-[#1b1a1c] border-t-[#ece6d8] animate-spin" />
    </div>
  );
}
