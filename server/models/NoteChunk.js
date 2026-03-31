import mongoose from "mongoose";

const noteChunkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
      index: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    chunkText: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
    tokenCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

noteChunkSchema.index({ user: 1, note: 1, chunkIndex: 1 }, { unique: true });
noteChunkSchema.index({ user: 1, updatedAt: -1 });

export default mongoose.model("NoteChunk", noteChunkSchema);
