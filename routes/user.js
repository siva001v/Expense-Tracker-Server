const express = require("express");
const {
  getUser,
  updateUser,
  changeUserPassword,
} = require("../controllers/user");
const { auth } = require("../util/auth");

const router = express.Router();

router.get("/", auth, getUser);

router.put("/change-password", auth, changeUserPassword);

router.put("/:id", auth, updateUser);

module.exports = router;
