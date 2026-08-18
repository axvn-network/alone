<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Langding — Agent Contract

**Read this file first. Then read the file(s) relevant to your task.**

| Need | Go to |
|---|---|
| Architecture, folder structure, import rules, auth, SSE, DB, CI/CD | [`ARCH_BLUEPRINT.md`](ARCH_BLUEPRINT.md) |
| Project context, brand, strategy sources, tech debt, roadmap | [`CONTEXT.md`](CONTEXT.md) |
| Corpus layers, chunk schema, pipeline, citation rules | [`KNOWLEDGE_BASE.md`](KNOWLEDGE_BASE.md) |
| Deploy, rollback, backup, incident runbooks, troubleshooting | [`RUNBOOK.md`](RUNBOOK.md) |
| Admin CMS workflows | [`ADMIN_GUIDE.md`](ADMIN_GUIDE.md) |
| Design tokens, layout, accessibility | [`visual-standards.md`](visual-standards.md) |
| Change history | [`CHANGELOG.md`](CHANGELOG.md) |

## Hard rules
- Do not invent facts about the codebase — read the relevant source file first.
- Before changing application code, read the relevant Next.js 16 documentation under `node_modules/next/dist/docs/`.
- `ARCH_BLUEPRINT.md` is the single source of truth for architecture. Update it before merging any structural change.
