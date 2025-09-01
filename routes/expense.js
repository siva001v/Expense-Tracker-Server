const express = require("express");
const {
  getExpenses,
  postExpenses,
  putExpenses,
  deleteExpenses,
  getExpense,
  getExpensesSummary,
  getExpensesTrends,
} = require("../controllers/expense");
const { auth } = require("../util/auth");

const router = express.Router();

router.get("/", auth, getExpenses);

router.post("/", auth, postExpenses);

router.get("/summary", auth, getExpensesSummary);

router.get("/trends", auth, getExpensesTrends);

router.get("/:id", auth, getExpense);

router.put("/:id", auth, putExpenses);

router.delete("/:id", auth, deleteExpenses);

module.exports = router;
