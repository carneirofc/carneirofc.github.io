# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Two entries on the projects page (en and pt-br): `devops-utils` (with a link
  to its docs) and Local LLM Translate (with a link to its Firefox add-on
  listing).

### Removed

- The cloud/container certification bullets (Docker DCA track, Amazon EKS and
  GKE, Google Cloud fundamentals, Linux Essentials and Ansible) from the
  "Education & Certifications" section of the about page, in both locales.
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
