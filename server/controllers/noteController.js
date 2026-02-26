import Note from "../models/note.model.js";

async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    const note = await Note.create({
      title,
      content,
      user: req.user.id
    })
    res.status(201).json(note);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
async function getMyNotes(req, res) {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
async function updateNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    const updatedNote = await note.save();

    res.status(200).json(updatedNote);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await note.deleteOne();

    res.status(200).json({ message: "Note deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { createNote, getMyNotes, updateNote, deleteNote };