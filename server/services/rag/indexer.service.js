import NoteChunk from "../../models/NoteChunk.js";
import { chunkText } from "./chunking.service.js";
import { embedTexts } from "./embedding.service.js";

function estimateTokenCount(text = "") {
  return Math.ceil(text.length / 4);
}

export async function indexNoteForRag({ userId, noteId, noteContent }) {
  await NoteChunk.deleteMany({ user: userId, note: noteId });

  const rawChunks = chunkText(noteContent);
  if (!rawChunks.length) return [];

  const embeddings = await embedTexts(rawChunks.map((chunk) => chunk.chunkText));

  const documents = rawChunks.map((chunk, index) => ({
    user: userId,
    note: noteId,
    chunkIndex: chunk.chunkIndex,
    chunkText: chunk.chunkText,
    embedding: embeddings[index],
    tokenCount: estimateTokenCount(chunk.chunkText),
  }));

  await NoteChunk.insertMany(documents);
  return documents;
}

export async function removeNoteFromRag({ userId, noteId }) {
  await NoteChunk.deleteMany({ user: userId, note: noteId });
}
