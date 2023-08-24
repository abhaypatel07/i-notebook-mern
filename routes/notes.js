const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");

// ROUTE 1 : get all notes using GET "api/notes/fetchallnotes"
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "some internal server error accured!" });
  }
});

// ROUTE 2 : put notes using POST "api/notes/addnote"
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter long title").isLength({ min: 2 }),
    body("discription", "Enter appropriate note").isLength({ min: 3 }),
  ],
  async (req, res) => {
    //if validator error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
    }
    try {
      const { title, discription, tag } = req.body;
      const note = new Note({
        title,
        discription,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ error: "some internal server error accured!" });
    }
  }
);

// Route 3 updat a note using PUT "api/notes/updatenote"
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, discription, tag } = req.body;

  // create newNote obj
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (discription) {
    newNote.discription = discription;
  }
  if (tag) {
    newNote.tag = tag;
  }

  //find a note to be update and update it
  let note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Not Found");
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not allowed!");
  }

  note = await Note.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );

  res.json({ note });
});

//Route 4 : delete note using Delete "api/notes/deletenote"
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //find a note by id and send appropriate reply
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found!");
    }

    //allow deletation only if user own this notes
    if (note.user.toString() !== req.user.id) {
      return res.status(404).send("Not allowed!");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "note has been deleted" });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "some internal server error accured!" });
  }
});

module.exports = router;
