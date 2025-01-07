import express from 'express';
import { getBorrowingHistory } from '../controllers/borrowHistoryControllers.js';
import authUser from '../middleware/authmiddleware.js';


const historyRouter = express.Router();

historyRouter.get('/:id', authUser, getBorrowingHistory);

export default historyRouter;
