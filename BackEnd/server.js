const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/keeperDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Schema
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: ""
    },
    content: {
      type: String,
      trim: true,
      required: true
    }
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

// Routes

// GET all notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// CREATE note
app.post("/notes", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content cannot be empty" });
    }

    const newNote = new Note({ title, content });
    const savedNote = await newNote.save();

    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// DELETE note
app.delete("/notes/:id", async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
