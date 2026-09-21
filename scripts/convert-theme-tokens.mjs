import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGET_DIRS = ["app", "component"];

// Files that must never be touched — the reader stays hardcoded dark
// regardless of the site theme (see the design spec).
const EXCLUDE_FILES = new Set([
  path.join("component", "titles", "ChapterReaderClient.tsx"),
]);

// Every hex value currently used as chrome/text/accent color, mapped to
// its token name. A few dark-mode-only near-duplicate variants
// (#2a292c, #f2f0f2, #f2f0f0) are folded into an existing token rather
// than kept as separate one-off colors.
const HEX_TO_TOKEN = {
  "0a0a0a": "bg",
  "1b1a1c": "surface",
  "232224": "surface-hover",
  "2a292c": "surface-hover",
  "212125": "nav",
  "050505": "border",
  "ece6d8": "fg",
  "f6f1f2": "fg-hover",
  "f2f0f2": "fg-hover",
  "f2f0f0": "fg-hover",
  "b6b0a2": "fg-secondary",
  "6b655e": "fg-muted",
  "302e2a": "texture",
  "9c1d25": "danger",
  "4ade80": "success",
  "c9a648": "warning",
};

// Matches an optional chain of variants (hover:, sm:, group-hover:, etc.),
// then a Tailwind color-utility prefix, then the arbitrary hex value in
// brackets — e.g. "hover:bg-[#232224]" or "sm:text-[#ece6d8]".
const CLASS_RE =
  /((?:[\w-]+:)*(?:bg|text|border|from|via|to|ring|divide|outline|decoration|fill|stroke|caret|accent|shadow))-\[#([0-9a-fA-F]{6})\]/g;

function convertFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  let changed = false;
  const updated = original.replace(CLASS_RE, (match, prefixChain, hex) => {
    const token = HEX_TO_TOKEN[hex.toLowerCase()];
    if (!token) return match; // leave one-off colors for manual handling
    changed = true;
    return `${prefixChain}-${token}`;
  });
  if (changed) fs.writeFileSync(filePath, updated, "utf8");
  return changed;
}

function walk(dir, results) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    let isDir = entry.isDirectory();
    let isFile = entry.isFile();
    if (!isDir && !isFile) {
      // Windows OneDrive Files On-Demand placeholders are reparse points;
      // readdirSync's Dirent classifies them as neither a file nor a
      // directory. fs.statSync follows the reparse point correctly.
      const stats = fs.statSync(full);
      isDir = stats.isDirectory();
      isFile = stats.isFile();
    }
    if (isDir) {
      walk(full, results);
    } else if (isFile && (full.endsWith(".tsx") || full.endsWith(".ts"))) {
      results.push(full);
    }
  }
}

const files = [];
for (const dir of TARGET_DIRS) walk(path.join(ROOT, dir), files);

let touchedCount = 0;
for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (EXCLUDE_FILES.has(rel)) continue;
  if (convertFile(file)) {
    touchedCount += 1;
    console.log(`converted: ${rel}`);
  }
}
console.log(`\nDone. ${touchedCount} files changed.`);
