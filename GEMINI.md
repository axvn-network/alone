@AGENTS.md

# Project Standards & Workflows

Read `.ai/manifest.yaml`, `.ai/work-queue.yaml`, and `.ai/locks.yaml` before claiming work. Use the UTF-8 source/retrieval contract in `KNOWLEDGE_BASE.md`.

## Absolute Perfection Mandate

This project operates under a zero-tolerance policy for technical debt, warnings, or linting imperfections.
- **1 warning = 1 failure.** 
- Codebase must achieve 100% compliance with type safety and linting rules at all times.
- If a warning is triggered, it MUST be resolved before any new task is initiated.
- No `eslint-disable` or `any` types are permitted without explicit architectural justification.
- **Mongoose 9 Convention**: `pre("save")` middleware must use `async function()` and return `Promise<void>`, NO `next` callback.
- **ESLint Convention**: Unused variables prefixed with `_` are explicitly allowed (`varsIgnorePattern: "^_"`).
- **SEO/Metadata**: Metadata must be exported in Server Component layout/page files; Client Components are exclusively for interactivity.

## Langding Agent Contract

Before changing application code, read the relevant Next.js 16 documentation under `node_modules/next/dist/docs/`.

Read [CONTEXT.md](CONTEXT.md), [KNOWLEDGE_BASE.md](KNOWLEDGE_BASE.md), and `.ai/manifest.yaml` before work. Then check `.ai/work-queue.yaml` and `.ai/locks.yaml` before claiming a task.

For strategy, legal, finance, governance, roadmap, infrastructure, KPI, risk, or corporate claims, locate material with `_standardized/index.json` or `_standardized/chunks.jsonl`, then verify it in the relevant `_extracted/` Markdown named by `original_path`. Do not edit `_extracted/`, alter valid Vietnamese UTF-8, invent source-backed facts, or transmit confidential corpus content to external services without authorization. Cite source-backed output as `[slug | original_path]`.

## Multi-Agent Workflow

Use the shared repo-native protocol in `.ai/manifest.yaml`. Work on one small, unlocked scope at a time; record the file scope in `.ai/locks.yaml` before editing and leave a UTF-8 handoff in `.ai/handoffs/` when releasing it. Never overwrite another agent's in-progress changes, generated corpus artifacts, or CMS data without explicit review.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

## Zero-Garbage Architectural Policy

To maintain long-term codebase health, the following rules are mandatory:

- **Feature-Based Colocation (Mandatory):** All new features, components, hooks, styles, and types MUST be created within their respective route subdirectories (`src/app/(admin)/...` or `src/app/(site)/...`). No new top-level components or utils are permitted.
- **Cleanup Requirement:** After every task, the assigned agent MUST perform a cleanup check:
    - Delete unused files, components, and deprecated assets.
    - Move legacy or non-operational scripts to `archived/`.
    - Do not allow empty directories to persist.
- **Script Organization:**
    - `scripts/`: Only for active, daily operational scripts (deployment, backup, verification).
    - `archived/`: For all legacy, historic, or inactive scripts.
    - Never add new scripts to the project root.

