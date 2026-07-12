#!/usr/bin/env node
/**
 * CI safety-net: fail the build if any *tracked* image/video still carries
 * privacy-relevant metadata (GPS, device, timestamps, author). The pre-commit
 * hook strips these, but `git commit --no-verify` can bypass it — this cannot.
 */
import { execFileSync } from "node:child_process";

const MEDIA_RE = /\.(jpe?g|png|webp|heic|heif|tiff?|gif|mp4|mov|m4v|mkv|avi|webm)$/i;

// Tags that must not be present on committed media.
const TAG_ARGS = [
  "-GPS*",
  "-Make",
  "-Model",
  "-Software",
  "-CreateDate",
  "-DateTimeOriginal",
  "-ModifyDate",
  "-SerialNumber",
  "-OwnerName",
  "-Artist",
  "-Creator",
  "-Author",
];

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter((file) => file && MEDIA_RE.test(file));

if (files.length === 0) {
  console.log("check-media-metadata: no tracked media files, nothing to check.");
  process.exit(0);
}

let output;
try {
  output = execFileSync("exiftool", ["-json", "-q", ...TAG_ARGS, ...files], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
} catch (error) {
  if (error.code === "ENOENT") {
    console.error("check-media-metadata: exiftool is not installed.");
    process.exit(1);
  }
  // exiftool exits non-zero when a file is unreadable/corrupt — treat as failure
  // but still show whatever it printed.
  console.error(error.stdout?.toString() ?? "");
  console.error(error.stderr?.toString() ?? "");
  process.exit(1);
}

const entries = output.trim() ? JSON.parse(output) : [];
const offenders = entries
  .map((entry) => {
    const { SourceFile, ...tags } = entry;
    return { file: SourceFile, tags: Object.keys(tags) };
  })
  .filter((entry) => entry.tags.length > 0);

if (offenders.length > 0) {
  console.error("check-media-metadata: privacy-relevant metadata found in committed media:\n");
  for (const { file, tags } of offenders) {
    console.error(`  ${file}: ${tags.join(", ")}`);
  }
  console.error("\nStrip it with: exiftool -all= -overwrite_original <file>");
  process.exit(1);
}

console.log(`check-media-metadata: ${files.length} media file(s) clean.`);
