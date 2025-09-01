const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getUser = async (req, res, next) => {
  const id = req.userId;
  if (!id) {
    return res.status(500).json({
      message: "User id is missing",
    });
  }

  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const userData = user.toObject();
    const { password: _, ...userWithoutPassword } = userData;
    return res.status(200).json({
      message: "User data fetched successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching the user data",
    });
  }
};

exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  if (!id) {
    return res.status(500).json({
      message: "User id is missing",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(id, body, { new: true });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating user data",
    });
  }
};

exports.changeUserPassword = async (req, res, next) => {
  const id = req.userId;
  if (!id) {
    return res.status(500).json({
      message: "User id is missing",
    });
  }
  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    return res.status(400).json({
      message: "Both current and new passwords are required",
    });
  }
  try {
    const user = await User.findById(id);
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isPasswordEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordEqual) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }
    if (password === newPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the current password",
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating user data",
    });
  }
};
