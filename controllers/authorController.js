import Author from "../models/authorModel.js";

//* Create Author
export const createAuthor = async (req, res) => {
  const { name, bio } = req.body;
  try {
    const existingAuthor = await Author.findOne({ name });
    if (existingAuthor) {
      return res
        .status(400)
        .json({ message: "Author with this name already exists" });
    }

    const newAuthor = new Author({ name, bio });
    await newAuthor.save();
    res
      .status(201)
      .json({ message: "Author added successfully", author: newAuthor });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding author", error: err.message });
  }
};

//* Get Author by ID
export const getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await Author.findById(id);
    if (!author) return res.status(404).json({ message: "Author not found" });

    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* Get Author Detail By Id
export const getAuthorDetails = async (req, res) => {
  try {
    const { authorId } = req.params;

    const author = await Author.findById(authorId).populate("books");

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    const booksCount = author.books.length;

    res.status(200).json({
      name: author.name,
      bio: author.bio,
      booksCount: booksCount,
      books: author.books,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching author details", error: err.message });
  }
};
