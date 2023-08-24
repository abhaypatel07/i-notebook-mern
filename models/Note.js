const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  title: { type: String, required: true },
  discription: { type: String, required: true },
  tag: { type: String, default: "General" },
  date: { type: Date, default: Date.now },
});

const Notes = new mongoose.model("Note", NotesSchema);
module.exports = Notes;
