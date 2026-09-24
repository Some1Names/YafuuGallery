import type { pdfjs as PdfjsNamespace } from "react-pdf";

// pdf.js does its parsing in a Web Worker, and GlobalWorkerOptions.workerSrc
// says where to load it from. It used to point at unpkg.com — a third-party
// CDN the site had no control over: if unpkg was slow, down, or blocked on
// a reader's network, no chapter could load at all. `new URL(..., import.
// meta.url)` makes the bundler ship the worker file from node_modules as one
// of the site's own assets instead, and always the exact pdfjs-dist version
// react-pdf was built against (it's react-pdf's own dependency).
//
// Shared by the reader and the admin PDF-thumbnail helper, which load in
// different bundles — each has to set GlobalWorkerOptions itself.
export function configurePdfWorker(pdfjs: typeof PdfjsNamespace): void {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
}
