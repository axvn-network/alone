/**
 * src/utils/pagination.ts
 *
 * Shared pagination helpers used across all services.
 * Centralises the "Math.max / Math.min" page+limit+skip pattern.
 */

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Normalise raw page/limit values into safe, bounded integers.
 *
 * @param opts  - raw user-supplied page / limit (may be undefined / 0 / negative)
 * @param defaults.limit  - default per-page count (default: 50)
 * @param defaults.maxLimit - hard ceiling on limit (default: 200)
 */
export function paginate(
  opts: PaginationOptions = {},
  defaults: { limit?: number; maxLimit?: number } = {}
): PaginationResult {
  const defaultLimit = defaults.limit ?? 50;
  const maxLimit = defaults.maxLimit ?? 200;

  const page = Math.max(1, opts.page || 1);
  const limit = Math.min(maxLimit, Math.max(1, opts.limit || defaultLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
