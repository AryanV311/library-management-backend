import Book from "../models/bookModel.js";
import BorrowingHistory from "../models/borrowHistoryModel.js";
import User from "../models/userModel.js";
import Author from "../models/authorModel.js";

// Create Book
export const createBook = async (req, res) => {
  try {
    const { title, author, genre, publicationYear, copiesAvailable, ISBN } =
      req.body;

    const existingAuthor = await Author.findById(author);
    if (!existingAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }

    const newBook = new Book({
      title,
      author,
      genre,
      publicationYear,
      copiesAvailable,
      ISBN,
    });
    await newBook.save();

    existingAuthor.books.push(newBook._id);
    await existingAuthor.save();

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (err) {
    res.status(500).json({ message: "Error adding book", error: err.message });
  }
};

//* Get Books with Pagination
export const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const books = await Book.find()
      .populate("author")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* Update Book
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedBook)
      return res.status(404).json({ message: "Book not found" });

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* Delete Book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//* Borrow Book
export const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    console.log("userId", userId);

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized. Please login." });
    }

    const book = await Book.findById(bookId);
    if (!book || book.copiesAvailable <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Book not available" });
    }

    const borrowingHistory = await BorrowingHistory.create({
      user: userId,
      book: bookId,
      borrowedAt: new Date(),
    });

    console.log("object", borrowingHistory);

    book.copiesAvailable -= 1;
    await book.save();

    const user = await User.findById(userId);
    user.borrowedBooks.push(bookId);
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Book borrowed successfully",
        borrowingHistory,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error borrowing book",
        error: error.message,
      });
  }
};

//* Search Books by Title or Author
export const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    const booksByTitle = await Book.find({
      title: { $regex: q, $options: "i" },
    }).populate("author");

    const booksByAuthor = await Book.find()
      .populate({
        path: "author",
        match: { name: { $regex: q, $options: "i" } }, // Match author name
      })
      .then((books) => books.filter((book) => book.author !== null)); // Remove books with unmatched authors

    const combinedBooks = [...booksByTitle, ...booksByAuthor].filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t._id.toString() === value._id.toString())
    );

    res.json(combinedBooks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error searching books", error: err.message });
  }
};

// Controller function to return a book
export const returnBook = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;

  try {
    const borrowingHistory = await BorrowingHistory.findOne({
      user: userId,
      book: bookId,
      returnedAt: null,
    });

    if (!borrowingHistory) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No borrowing record found for this book",
        });
    }

    borrowingHistory.returnedAt = new Date();

    const borrowedDuration = Math.ceil(
      (borrowingHistory.returnedAt - borrowingHistory.borrowedAt) /
        (1000 * 60 * 60 * 24)
    );
    if (borrowedDuration > 14) {
      const fine = (borrowedDuration - 14) * 5;
      borrowingHistory.finePaid = fine;
    }

    await borrowingHistory.save();

    const book = await Book.findById(bookId);
    if (book) {
      book.copiesAvailable += 1;
      await book.save();
    }

    const user = await User.findById(userId);
    if (user) {
      user.borrowedBooks = user.borrowedBooks.filter(
        (borrowedBook) => borrowedBook.toString() !== bookId.toString()
      );
      await user.save();
    }

    res.json({
      success: true,
      message: "Book returned successfully",
      borrowingHistory,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error returning book",
        error: err.message,
      });
  }
};
