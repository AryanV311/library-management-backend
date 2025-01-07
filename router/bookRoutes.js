import express from 'express';
import Book from '../models/bookModel.js';
import {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
  borrowBook,
  searchBooks,
  returnBook,
} from '../controllers/bookController.js';
import authUser from '../middleware/authmiddleware.js';
const bookRouter = express.Router();

bookRouter.post('/create', createBook);
bookRouter.get('/list', authUser, getBooks);
bookRouter.put('/update/:id', authUser, updateBook);
bookRouter.delete('/delete/:id', authUser, deleteBook);
bookRouter.get("/returned-book",authUser,returnBook)

bookRouter.post('/borrow', authUser, borrowBook);

bookRouter.get('/search', searchBooks);
export default bookRouter;



