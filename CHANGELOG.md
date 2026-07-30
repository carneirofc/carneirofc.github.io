# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Two entries on the projects page (en and pt-br): `devops-utils` (with a link
  to its docs) and Local LLM Translate (with a link to its Firefox add-on
  listing).
- `scripts/check-translations.mjs`, run in the CI checks job: a post published
  in only one language made the header's language switch a hard 404, and
  nothing caught it. Velite validates one document at a time, so locale parity
  needs its own gate. It also covers `content/about*.mdx`.
- `CONTEXT.md` and `docs/adr/`, replacing `PLAN.md` — see Changed/Removed.

### Changed

- Documentation is now split by question. `README.md` stays the how-to,
  `CONTEXT.md` describes what the system is and the invariants it keeps, and
  `docs/adr/` holds one record per decision with its rejected alternatives.
  ADR 0003 supersedes the original "consume `@carneirofc/ui` from GitHub
  Packages" decision with the sibling `file:` checkout that is actually in use.
- The Pages deploy no longer cancels itself: `deploy.yml`'s concurrency group
  uses `cancel-in-progress: false`, so a follow-up push queues behind a running
  deploy instead of aborting one that may already be inside `deploy-pages` and
  leaving Pages half-updated.
- The Lefthook `typecheck` job runs `velite build` first. `#site/content`
  resolves to `.velite/`, which doesn't exist on a fresh clone, so the first
  commit after cloning used to fail the hook.

### Fixed

- The language switch on the home page linked to `/pt-br` without the trailing
  slash the static export emits, costing a redirect hop. `alternatePath()` now
  keeps the slash in both directions.
- `src/app/.next/trace` and `trace-build` were committed: `.gitignore`'s
  `/.next/` is root-anchored and didn't match a nested copy left by a stray
  `next dev`. The rule is now unanchored and the files are untracked.
- `src/components/section-nav.tsx`'s docstring still described the smooth-scroll
  and active-section tracking that was removed with the JS island.
- `robots.ts` hardcoded the site origin instead of importing `SITE_URL`, and
  `globals.css` registered the UI source tree twice.

### Removed

- The cloud/container certification bullets (Docker DCA track, Amazon EKS and
  GKE, Google Cloud fundamentals, Linux Essentials and Ansible) from the
  education section of the about page, in both locales; the heading is now
  just "Education" / "Formação".
- The section-nav rail's custom JS island (rAF smooth-scroll, click
  handling, `IntersectionObserver` active-section tracking, sliding
  indicator bar): the active-item selection wasn't tracking scroll
  position correctly. Links are now plain anchors relying on native
  `scroll-behavior: smooth` and `scroll-margin-top`.

## [0.3.0] - 2026-07-14

### Added

- Documentation links on project cards for the projects that publish GitHub
  Pages (`deedlit.dev` docs, `@carneirofc/ui` Storybook, Qt Task Manager docs),
  rendered as a second accent button beside the source link.
- New "Web & Frameworks" skill group on the about page (Next.js, React, Node.js,
  Express, FastAPI).

### Changed

- Expanded the about-page skill tags: Docker Swarm, Ansible, Terraform, and
  EPICS Control System (platform); GitHub Actions (DevSecOps); Azure Data
  Factory and Confluent Kafka (data & AI).

## [0.2.0] - 2026-07-14

### Added

- Scroll-reveal animation for page sections as they enter the viewport, using
  CSS scroll-driven timelines with an `@supports` fallback and a
  `prefers-reduced-motion` guard.
- Motion for the left section-nav rail: a sliding accent indicator that tracks
  the active section, hover lift on the buttons, and a staggered entrance.

### Fixed

- Defined the previously no-op `.section-anchor` class so native `#hash` /
  `:target` navigation lands clear of the sticky header (`scroll-margin-top`).

[Unreleased]: https://github.com/carneirofc/carneirofc.github.io/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/carneirofc/carneirofc.github.io/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/carneirofc/carneirofc.github.io/releases/tag/v0.2.0
