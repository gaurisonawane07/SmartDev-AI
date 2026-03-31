import Note from "../models/note.model.js";
import { indexNoteForRag, removeNoteFromRag } from "../services/rag/indexer.service.js";

async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const note = await Note.create({
      title,
      content,
      user: req.user._id
    })

    try {
      await indexNoteForRag({
        userId: req.user._id,
        noteId: note._id,
        noteContent: `${title}\n\n${content}`,
      });
    } catch (indexError) {
      console.error("RAG indexing failed after create:", indexError.message);
    }

    const noteObj = note.toObject();
    res.status(201).json({ ...noteObj, id: noteObj._id.toString() });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
async function getMyNotes(req, res) {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
    const notesWithId = notes.map(n => {
        const obj = n.toObject();
        return { ...obj, id: obj._id.toString() };
    });
    res.status(200).json(notesWithId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
async function updateNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: `Note ${req.params.id} not found` });
    }
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    if (req.body.title !== undefined) note.title = req.body.title;
    if (req.body.content !== undefined) note.content = req.body.content;
    const updatedNote = await note.save();

    try {
      await indexNoteForRag({
        userId: req.user._id,
        noteId: updatedNote._id,
        noteContent: `${updatedNote.title}\n\n${updatedNote.content}`,
      });
    } catch (indexError) {
      console.error("RAG indexing failed after update:", indexError.message);
    }

    const noteObj = updatedNote.toObject();
    res.status(200).json({ ...noteObj, id: noteObj._id.toString() });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: `Note ${req.params.id} not found (for deletion)` });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await note.deleteOne();

    try {
      await removeNoteFromRag({
        userId: req.user._id,
        noteId: note._id,
      });
    } catch (indexError) {
      console.error("RAG cleanup failed after delete:", indexError.message);
    }

    res.status(200).json({ message: "Note deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { createNote, getMyNotes, updateNote, deleteNote };