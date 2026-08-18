/**
 * src/utils/search.ts
 *
 * Shared Mongoose $or search query builder.
 * Builds a case-insensitive regex filter over the given fields.
 */

/**
 * Returns a `{ $or: [...] }` filter when `term` is non-empty, otherwise `{}`.
 *
 * @param term   - user-supplied search string
 * @param fields - list of MongoDB field names to search across
 *
 * @example
 *   const filter = { status: "active", ...buildSearchFilter(search, ["title", "excerpt"]) };
 */
export function buildSearchFilter(
  term: string | undefined,
  fields: string[]
): Record<string, unknown> {
  if (!term) return {};
  return {
    $or: fields.map((field) => ({
      [field]: { $regex: term, $options: "i" },
    })),
  };
}
