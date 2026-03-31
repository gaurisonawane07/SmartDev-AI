import NoteChunk from "../../models/NoteChunk.js";
import { embedText } from "./embedding.service.js";

function cosineSimilarity(a = [], b = []) {
  if (!a.length || !b.length || a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function retrieveRelevantChunks({
  userId,
  query,
  topK = Number(process.env.RAG_TOP_K || 4),
  candidateLimit = Number(process.env.RAG_CANDIDATE_LIMIT || 300),
}) {
  const trimmedQuery = String(query || "").trim();
  if (!trimmedQuery) return [];

  const [queryEmbedding, candidates] = await Promise.all([
    embedText(trimmedQuery),
    NoteChunk.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(candidateLimit)
      .lean(),
  ]);

  if (!candidates.length) return [];

  const scored = candidates
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}

export function formatRetrievedContext(chunks = []) {
  if (!chunks.length) return "";

  return chunks
    .map(
      (chunk, index) =>
        `Reference ${index + 1}:\n${chunk.chunkText}`
    )
    .join("\n\n");
}
