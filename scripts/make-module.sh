#!/usr/bin/env bash
# =============================================================================
# scripts/make-module.sh — Scaffold a new Feature-Sliced module
#
# Usage:
#   bash scripts/make-module.sh <module-name>
#   make -f infra/Makefile module name=investor
#
# Creates: src/modules/<name>/
#   ├── types.ts     — TypeScript interfaces
#   ├── model.ts     — Mongoose schema
#   ├── schema.ts    — Zod validation schemas
#   ├── service.ts   — Business logic
#   ├── actions.ts   — Server Actions ('use server')
#   └── index.ts     — Barrel export
# =============================================================================
set -euo pipefail

NAME="${1:-}"
if [[ -z "$NAME" ]]; then
  echo "Usage: bash scripts/make-module.sh <module-name>" >&2
  exit 1
fi

# Convert to kebab-case for directory, PascalCase for types
KEBAB=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')
PASCAL=$(echo "$NAME" | sed 's/[-_]\([a-z]\)/\U\1/g; s/^\([a-z]\)/\U\1/g')

DEST="src/modules/$KEBAB"

if [[ -d "$DEST" ]]; then
  echo "❌  Module '$KEBAB' already exists at $DEST" >&2
  exit 1
fi

mkdir -p "$DEST"

# ── types.ts ──────────────────────────────────────────────────────────────────
cat > "$DEST/types.ts" << TMPL
/**
 * src/modules/$KEBAB/types.ts
 */

export interface I${PASCAL} {
  _id:       string;
  createdAt: string;
  updatedAt: string;
}

export interface ${PASCAL}Query {
  page?:  number;
  limit?: number;
}

export interface ${PASCAL}ListResult {
  docs:  I${PASCAL}[];
  total: number;
  page:  number;
  limit: number;
}
TMPL

# ── model.ts ──────────────────────────────────────────────────────────────────
cat > "$DEST/model.ts" << TMPL
/**
 * src/modules/$KEBAB/model.ts
 * Mongoose schema — ${PASCAL}
 */

import mongoose, { Schema, Document } from "mongoose";

export interface I${PASCAL}Doc extends Document {
  createdAt: Date;
  updatedAt: Date;
}

const ${PASCAL}Schema = new Schema<I${PASCAL}Doc>(
  {
    // TODO: add fields
  },
  { timestamps: true }
);

const ${PASCAL} =
  mongoose.models.${PASCAL} ||
  mongoose.model<I${PASCAL}Doc>("${PASCAL}", ${PASCAL}Schema);

export default ${PASCAL};
TMPL

# ── schema.ts ─────────────────────────────────────────────────────────────────
cat > "$DEST/schema.ts" << TMPL
/**
 * src/modules/$KEBAB/schema.ts
 * Zod validation schemas — messages tiếng Việt
 */

import { z } from "zod";

export const create${PASCAL}Schema = z.object({
  // TODO: add fields
});

export const update${PASCAL}Schema = create${PASCAL}Schema.partial();

export type Create${PASCAL}Input = z.infer<typeof create${PASCAL}Schema>;
export type Update${PASCAL}Input = z.infer<typeof update${PASCAL}Schema>;
TMPL

# ── service.ts ────────────────────────────────────────────────────────────────
cat > "$DEST/service.ts" << TMPL
/**
 * src/modules/$KEBAB/service.ts
 * Business logic — ${PASCAL}
 */

import { connectDB } from "@/lib/db";
import { paginate } from "@/utils/pagination";
import ${PASCAL} from "./model";
import type { ${PASCAL}Query, ${PASCAL}ListResult } from "./types";

export async function list(query: ${PASCAL}Query = {}): Promise<${PASCAL}ListResult> {
  await connectDB();
  const { page, limit, skip } = paginate(query, { limit: 20, maxLimit: 100 });
  const [docs, total] = await Promise.all([
    ${PASCAL}.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ${PASCAL}.countDocuments(),
  ]);
  return { docs: docs as unknown as ${PASCAL}ListResult["docs"], total, page, limit };
}

// TODO: add create, update, delete functions
TMPL

# ── actions.ts ────────────────────────────────────────────────────────────────
cat > "$DEST/actions.ts" << TMPL
"use server";

/**
 * src/modules/$KEBAB/actions.ts
 * Server Actions — ${PASCAL}
 * Luồng: Client Form → actions.ts (RBAC) → service.ts → DB → revalidatePath()
 */

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-utils";
import { handleError } from "@/utils/errors";
import * as service from "./service";
import { create${PASCAL}Schema } from "./schema";
import type { Create${PASCAL}Input } from "./schema";

export async function create${PASCAL}Action(raw: Create${PASCAL}Input) {
  await requireAuth();

  const parsed = create${PASCAL}Schema.safeParse(raw);
  if (!parsed.success) {
    return { success: false as const, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    // TODO: implement
    void service; // placeholder
    revalidatePath("/admin/$KEBAB");
    return { success: true as const };
  } catch (e) {
    return { success: false as const, message: handleError(e).message };
  }
}
TMPL

# ── index.ts ──────────────────────────────────────────────────────────────────
cat > "$DEST/index.ts" << TMPL
/**
 * src/modules/$KEBAB/index.ts
 * Barrel export
 */

export * from "./types";
export * from "./schema";
export * as service from "./service";
export * as actions from "./actions";
export { default as ${PASCAL}Model } from "./model";
TMPL

echo ""
echo "✓  Module scaffolded: $DEST"
echo ""
echo "  Files created:"
for f in types.ts model.ts schema.ts service.ts actions.ts index.ts; do
  echo "    $DEST/$f"
done
echo ""
echo "  Next steps:"
echo "    1. Add fields to $DEST/model.ts"
echo "    2. Add Zod fields to $DEST/schema.ts"
echo "    3. Implement service functions in $DEST/service.ts"
echo "    4. Update Server Actions in $DEST/actions.ts"
echo "    5. Create page: src/app/(admin)/admin/$KEBAB/page.tsx"
echo ""
