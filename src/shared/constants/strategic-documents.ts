/**
 * src/lib/strategic-documents.ts
 *
 * Returns strategic document summaries.
 * The corpus pipeline (_standardized/) has been removed.
 * Documents are now maintained directly here or served from the DB.
 */

export interface StrategicDocumentSummary {
  title: string;
  slug: string;
  date: string;
  group: "STRATEGY" | "LEGAL";
  documentType: string;
  classification: string;
  summary: string;
}

export function getStrategicDocumentSummaries(): readonly StrategicDocumentSummary[] {
  return [];
}
