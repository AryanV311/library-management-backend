import mongoose from 'mongoose';

const borrowingHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  borrowedAt: Date,
  returnedAt: Date,
  finePaid: { type: Number, default: 0 },
});

const BorrowingHistory = mongoose.model('BorrowingHistory', borrowingHistorySchema);

export default BorrowingHistory;
