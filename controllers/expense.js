const { default: mongoose } = require("mongoose");
const Expense = require("../models/expense");

exports.getExpenses = async (req, res, next) => {
  const userId = req.userId;
  const {
    category,
    startDate,
    endDate,
    sortBy = "date",
    order = "desc",
  } = req.query;
  if (!userId) {
    return res.status(500).json({
      message: "Bad Request, misssing userId",
    });
  }

  try {
    const filter = { userId };
    if (category) {
      filter.category = category;
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }
    const sortOrder = order.toLowerCase() == "asc" ? "1" : -1;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    const expenses = await Expense.find(filter).sort(sortOptions);

    res.status(200).json({
      message: "Expenses fetched successfully",
      data: expenses,
      total: expenses.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while trying to fetch expenses",
    });
  }
};

exports.postExpenses = async (req, res, next) => {
  const { title, amount, category, date } = req.body;
  const userId = req.userId;

  const expense = new Expense({ title, amount, category, date, userId });

  try {
    const savedExpense = await expense.save();
    if (!savedExpense) {
      return res.status(400).json({
        message: "Expense creation failed",
      });
    }
    return res.status(201).json({
      message: "Expense created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving the expense",
    });
  }
};

exports.getExpense = async (req, res, next) => {
  const expenseId = req.params.id;

  if (!expenseId) {
    return res.status(404).json({
      message: "Expense not found",
    });
  }
  try {
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }
    return res.status(200).json({
      message: "Expense retrieved successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting the expense",
    });
  }
};

exports.putExpenses = async (req, res, next) => {
  const body = req.body;
  const expenseId = req.params.id;
  if (!expenseId) {
    return res.status(500).json({
      message: "Bad Request",
    });
  }
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(expenseId, body, {
      new: true,
    });
    if (!updatedExpense) {
      return res.status(404).json({
        message: "No data found for the given expense id",
      });
    }
    return res.status(201).json({
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while updating expense",
    });
  }
};

exports.deleteExpenses = async (req, res, next) => {
  const expenseId = req.params.id;
  if (!expenseId) {
    return res.status(500).json({
      message: `Error deleting the expense with id ${expenseId}`,
    });
  }
  try {
    const expense = await Expense.findByIdAndDelete(expenseId);
    if (!expense) {
      return res.status(404).json({
        message: "No expense found with the give id to delete",
      });
    }
    return res.status(200).json({
      message: "Expense deleted successfully",
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting the expense",
    });
  }
};

exports.getExpensesSummary = async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(500).json({
      message: "Bad request",
    });
  }
  try {
    const summary = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);
    const result = {};
    summary.forEach((data) => {
      result[data._id] = data.total;
    });
    res.status(200).json({
      message: "Data retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while retrieving data",
    });
  }
};

exports.getExpensesTrends = async (req, res, next) => {
  const userId = req.userId;
  const currentDate = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  currentDate.setHours(23, 59, 59, 999);
  sevenDaysAgo.setHours(0, 0, 0, 0);
  try {
    const trends = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: sevenDaysAgo,
            $lte: currentDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          total: 1,
        },
      },
    ]);
    const trendsResult = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];

      const entry = trends.find((t) => t.date === formattedDate);
      trendsResult.push({
        date: formattedDate,
        total: entry ? entry.total : 0,
      });
    }
    res.status(200).json({
      message: "Data retrieved successfully",
      data: trendsResult,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while retrieving data",
    });
  }
};
