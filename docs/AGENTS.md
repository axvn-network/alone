<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Langding Agent Contract

Before changing application code, read the relevant Next.js 16 documentation
under `node_modules/next/dist/docs/`.

Read [CONTEXT.md](CONTEXT.md), [KNOWLEDGE_BASE.md](KNOWLEDGE_BASE.md),
and `.ai/manifest.yaml` before work. Then check `.ai/work-queue.yaml` and
`.ai/locks.yaml` before claiming a task.

For strategy, legal, finance, governance, roadmap, infrastructure, KPI, risk,
or corporate claims, locate material with `_standardized/index.json` or
`_standardized/chunks.jsonl`, then verify it in the relevant `_extracted/`
Markdown named by `original_path`. Do not edit `_extracted/`, alter valid
Vietnamese UTF-8, invent source-backed facts, or transmit confidential corpus
content to external services without authorization. Cite source-backed output
as `[slug | original_path]`.

## Multi-Agent Workflow

Use the shared repo-native protocol in `.ai/manifest.yaml`. Work on one small,
unlocked scope at a time; record the file scope in `.ai/locks.yaml` before
editing and leave a UTF-8 handoff in `.ai/handoffs/` when releasing it. Never
overwrite another agent's in-progress changes, generated corpus artifacts, or
CMS data without explicit review.
