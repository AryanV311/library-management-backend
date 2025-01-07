import BorrowingHistory from "../models/borrowHistoryModel.js";

//* Get Borrowing History
export const getBorrowingHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await BorrowingHistory.find({
      $or: [{ book: id }, { user: id }],
    })
      .populate("book")
      .populate("user");

    if (!history.length)
      return res.status(404).json({ message: "No history found for this ID" });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
