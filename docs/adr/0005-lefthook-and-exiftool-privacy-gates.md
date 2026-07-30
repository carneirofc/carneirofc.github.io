# 5. Lefthook pre-commit hooks, with exiftool stripping media metadata

- **Status:** Accepted
- **Date:** 2026-07-12

## Context

Two separate needs. First, ordinary quality gates (format, lint, typecheck,
secret scan) should run before a commit rather than only in CI. Second — and
the reason this is an ADR rather than a config detail — photos and videos
posted on a personal site carry EXIF: GPS coordinates, device model, capture
timestamps. Publishing those is a privacy leak that is easy to do by accident
and impossible to undo once the repo is public.

## Decision

**Lefthook** as the hook manager. Pre-commit runs Prettier, ESLint, `tsc`, a
gitleaks scan, and an exiftool pass over staged media.

The media job is `exiftool -all= -overwrite_original` over the staged
image/video globs, with Lefthook's `stage_fixed: true`, so the hook
**auto-fixes**: it strips in place and re-stages, and the clean file is what
gets committed.

Defense in depth: `scripts/check-media-metadata.mjs` runs in CI and fails the
build if any _tracked_ media still carries GPS, device, timestamp, or authorship
tags. That is what catches `git commit --no-verify`.

gitleaks is treated as optional locally — the hook warns and skips when the
binary is missing, because CI enforces it against full history anyway. exiftool
is not optional; media without it would commit unstripped.

## Alternatives rejected

- **Husky.** Just a hook installer; needs `lint-staged` bolted on for staged-file
  filtering. Lefthook is a single fast binary with globbing, parallel jobs, and
  `stage_fixed` built in.
- **pre-commit (Python).** Pulls a Python runtime into a pure-JS repo.
- **exiftool + `ffmpeg -map_metadata -1` for video.** More thorough — it drops
  per-stream metadata too — but adds a second binary and can alter the
  container. exiftool alone kills the privacy-relevant data losslessly, with no
  re-encode.

## Consequences

- `exiftool` is a required local dependency (install instructions in
  `README.md`); the hook fails loudly without it.
- Committing media rewrites the staged file. That is intentional, and worth
  knowing before wondering why the working tree changed.
- The typecheck job has to run `velite build` first — see
  [ADR 0004](./0004-velite-content-layer.md).
