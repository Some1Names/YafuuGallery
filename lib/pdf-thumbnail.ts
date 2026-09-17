// Client-only (canvas, pdfjs's worker) — lets AdminPdfUploadButton backfill
// a chapter's cover from the first page of its PDF when no cover was
// uploaded, instead of leaving the row on the generic placeholder.
//
// "react-pdf" is imported dynamically, inside the function, rather than at
// module scope — pdfjs-dist's canvas module runs `new DOMMatrix()` at
// module-evaluation time, which crashes Next.js's SSR pass (no DOMMatrix
// in Node) the moment anything in this file's static import chain gets
// pulled into a server-rendered tree, which the admin panel's chapter
// forms are. A dynamic import defers loading the module until this
// function actually runs, which only happens from a browser event
// handler — never during SSR.

// Rendered at a decent resolution — processImageForUpload downscales/crops
// this afterward to the site's actual cover conventions, so this only
// needs to be "big enough," not final-quality.
const RENDER_SCALE = 2;

export async function renderPdfFirstPageToFile(pdfFile: File): Promise<File> {
  const { pdfjs } = await import("react-pdf");
  // Same CDN worker + version-matching approach as ChapterReaderClient —
  // kept separate rather than shared, since this file loads into a
  // different bundle (the admin panel never imports the reader) and each
  // needs its own GlobalWorkerOptions assignment to take effect there.
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await pdfFile.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: RENDER_SCALE });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  if (!canvas.getContext("2d")) throw new Error("Canvas not supported");
  // Kept off-screen rather than fully detached — some pdf.js render
  // internals didn't reliably progress a canvas that was never attached
  // to the document. Removed once rendering finishes.
  canvas.style.position = "fixed";
  canvas.style.left = "-99999px";
  document.body.appendChild(canvas);

  try {
    // `canvas`, not `canvasContext` — passing both is documented as
    // undefined behavior in pdfjs-dist's own RenderParameters type ("if
    // the context must absolutely be used, canvas must be null").
    await page.render({ canvas, viewport }).promise;

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Couldn't render PDF page");

    return new File([blob], "pdf-page-1.png", { type: "image/png" });
  } finally {
    canvas.remove();
  }
}
