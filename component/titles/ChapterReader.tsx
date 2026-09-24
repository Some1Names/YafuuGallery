"use client";

import dynamic from "next/dynamic";

// The reader is client-only. react-pdf pulls in pdfjs-dist, whose canvas
// module runs `new DOMMatrix()` the moment it's evaluated — and DOMMatrix
// doesn't exist in Node. Importing ChapterReaderClient normally made every
// /viewer visit's server render crash ("DOMMatrix is not defined") and fall
// back to client rendering, logging an error each time. ssr: false has to
// live in a Client Component (it isn't allowed in the Server Component
// page), hence this thin wrapper. A PDF can't render on the server anyway,
// so nothing useful is lost.
const ChapterReaderClient = dynamic(() => import("./ChapterReaderClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0a0a0a] text-[#b6b0a2] flex items-center justify-center text-sm">
      Loading chapter…
    </div>
  ),
});

export default ChapterReaderClient;
