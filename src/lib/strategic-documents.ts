import corpusIndex from "../../_standardized/index.json";

export interface StrategicDocumentSummary {
  title: string;
  slug: string;
  date: string;
  group: "STRATEGY" | "LEGAL";
  documentType: string;
  classification: string;
  summary: string;
}

interface CorpusDocument {
  title: string;
  slug: string;
  date: string;
  group: "STRATEGY" | "LEGAL";
  document_type: string;
  classification: string;
  summary: string;
}

const documents = (corpusIndex.documents as CorpusDocument[]).map((document) => ({
  title: document.title,
  slug: document.slug,
  date: document.date,
  group: document.group,
  documentType: document.document_type,
  classification: document.classification,
  summary: document.summary,
}));

export function getStrategicDocumentSummaries(): readonly StrategicDocumentSummary[] {
  return documents;
}
