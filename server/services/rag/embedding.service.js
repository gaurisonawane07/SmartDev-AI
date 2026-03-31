import { pipeline } from "@xenova/transformers";

const EMBEDDING_MODEL = process.env.RAG_EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";
const FALLBACK_DIM = 384;

let extractorPromise = null;

function hashWord(word) {
  let hash = 0;
  for (let i = 0; i < word.length; i += 1) {
    hash = (hash << 5) - hash + word.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function normalizeVector(vector) {
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (!norm) return vector;
  return vector.map((value) => value / norm);
}

function fallbackEmbed(text) {
  const vector = new Array(FALLBACK_DIM).fill(0);
  const words = String(text).toLowerCase().match(/[a-z0-9_]+/g) || [];

  for (const word of words) {
    const index = hashWord(word) % FALLBACK_DIM;
    vector[index] += 1;
  }

  return normalizeVector(vector);
}

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", EMBEDDING_MODEL);
  }
  return extractorPromise;
}

async function modelEmbed(text) {
  const extractor = await getExtractor();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

export async function embedText(text) {
  if (!text || !String(text).trim()) {
    return new Array(FALLBACK_DIM).fill(0);
  }

  try {
    return await modelEmbed(text);
  } catch (error) {
    console.warn("Embedding model unavailable, using fallback embeddings:", error.message);
    return fallbackEmbed(text);
  }
}

export async function embedTexts(texts = []) {
  const results = [];
  for (const text of texts) {
    // Sequential calls avoid spikes in memory for local inference.
    const vector = await embedText(text);
    results.push(vector);
  }
  return results;
}
