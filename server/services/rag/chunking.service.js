const DEFAULT_CHUNK_SIZE = 700;
const DEFAULT_CHUNK_OVERLAP = 120;

function normalizeText(text = "") {
  return text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function splitByParagraphs(text) {
  return text
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function chunkText(
  text,
  { chunkSize = DEFAULT_CHUNK_SIZE, overlap = DEFAULT_CHUNK_OVERLAP } = {}
) {
  const clean = normalizeText(text);
  if (!clean) return [];

  const paragraphs = splitByParagraphs(clean);
  const chunks = [];

  for (const paragraph of paragraphs) {
    if (paragraph.length <= chunkSize) {
      chunks.push(paragraph);
      continue;
    }

    let start = 0;
    while (start < paragraph.length) {
      const end = Math.min(start + chunkSize, paragraph.length);
      const piece = paragraph.slice(start, end).trim();
      if (piece) chunks.push(piece);

      if (end >= paragraph.length) break;
      start = Math.max(0, end - overlap);
    }
  }

  return chunks.map((chunk, index) => ({ chunkText: chunk, chunkIndex: index }));
}
