import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { generateResponse } from "@/services/llm.service";
import { logger } from "@/lib/logger";
import { successResponse, errorResponse, serverErrorResponse } from "@/utils/api-response";
import { handleError } from "@/utils/errors";

export const dynamic = "force-dynamic";

interface IndexDocument {
  title: string;
  summary: string;
  path: string;
}

interface IndexData {
  documents: IndexDocument[];
}

export async function POST(req: NextRequest) {
  try {
    const { query } = (await req.json()) as { query?: string };

    if (!query?.trim()) {
      return errorResponse("Query is required");
    }

    // Load standardized index (async — avoids blocking event loop)
    const indexPath = path.join(process.cwd(), "_standardized", "index.json");
    const indexRaw = await fs.readFile(indexPath, "utf-8");
    const indexData = JSON.parse(indexRaw) as IndexData;

    // Keyword ranking — words longer than 2 chars to reduce noise
    const keywords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);

    let bestDoc: IndexDocument | null = null;
    let maxScore = 0;

    for (const doc of indexData.documents) {
      const text = `${doc.title} ${doc.summary}`.toLowerCase();
      let score = 0;
      for (const word of keywords) {
        if (text.includes(word)) score++;
      }
      if (score > maxScore) {
        maxScore = score;
        bestDoc = doc;
      }
    }

    const source = bestDoc?.path ?? "N/A";
    const answer = bestDoc
      ? await generateResponse(bestDoc.summary, query)
      : "Xin lỗi, tôi không tìm thấy tài liệu phù hợp với câu hỏi của bạn.";

    return successResponse({ answer, source });
  } catch (error) {
    logger.error("Chat API error", error);
    return serverErrorResponse(handleError(error).message);
  }
}
