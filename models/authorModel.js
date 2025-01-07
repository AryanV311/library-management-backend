// authorModel.js
import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
});

const Author = mongoose.model("Author", authorSchema);

export default Author;
