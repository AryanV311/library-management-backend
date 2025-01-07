import express from 'express';
import { createAuthor, getAuthorById, getAuthorDetails } from '../controllers/authorController.js';
import authUser from '../middleware/authmiddleware.js';

const authorRouter = express.Router();

authorRouter.post('/add', createAuthor);
authorRouter.get('/:id', authUser, getAuthorById);
authorRouter.get('/authorDetail/:authorId',authUser, getAuthorDetails)

export default authorRouter;

