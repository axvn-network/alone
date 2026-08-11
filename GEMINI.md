@AGENTS.md

Read `.ai/manifest.yaml`, `.ai/work-queue.yaml`, and `.ai/locks.yaml` before
claiming work. Use the UTF-8 source/retrieval contract in `KNOWLEDGE_BASE.md`.

# Absolute Perfection Mandate

This project operates under a zero-tolerance policy for technical debt, warnings, or linting imperfections.
- **1 warning = 1 failure.** 
- Codebase must achieve 100% compliance with type safety and linting rules at all times.
- If a warning is triggered, it MUST be resolved before any new task is initiated.
- No `eslint-disable` or `any` types are permitted without explicit architectural justification.
- **Mongoose 9 Convention**: `pre("save")` middleware must use `async function()` and return `Promise<void>`, NO `next` callback.
- **ESLint Convention**: Unused variables prefixed with `_` are explicitly allowed (`varsIgnorePattern: "^_"`).
- **SEO/Metadata**: Metadata must be exported in Server Component layout/page files; Client Components are exclusively for interactivity.
