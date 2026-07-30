# Architecture decision records

One file per settled decision: the context, what was chosen, what was rejected
and why, and what it costs. Superseded decisions stay — the record of what
changed is the point.

Start from [`CONTEXT.md`](../../CONTEXT.md) for what the system is; come here
for why it is that way.

| #                                                     | Decision                                         | Status                                |
| ----------------------------------------------------- | ------------------------------------------------ | ------------------------------------- |
| [0001](./0001-own-repo-root-url.md)                   | Own `<user>.github.io` repo, served at the root  | Accepted                              |
| [0002](./0002-nextjs-static-export.md)                | Next.js with static export                       | Accepted                              |
| [0003](./0003-ui-via-sibling-file-dependency.md)      | `@carneirofc/ui` from a sibling `file:` checkout | Accepted — supersedes GitHub Packages |
| [0004](./0004-velite-content-layer.md)                | Velite as the MDX content layer                  | Accepted                              |
| [0005](./0005-lefthook-and-exiftool-privacy-gates.md) | Lefthook hooks + exiftool media stripping        | Accepted                              |
| [0006](./0006-single-gated-deploy-workflow.md)        | One `deploy.yml` with gated jobs                 | Accepted                              |
| [0007](./0007-bilingual-en-pt-br-routes.md)           | English at the root, pt-BR under `/pt-br/`       | Accepted                              |
