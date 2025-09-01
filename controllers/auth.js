const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(401).json({
        message: "Email does not exist",
      });
    }
    const passwordEqual = await bcrypt.compare(password, existingUser.password);
    if (passwordEqual) {
      const { password: _, ...userWithoutPassword } = existingUser.toObject();
      const jwToken = jwt.sign(
        { email: email, id: existingUser._id },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        message: "Successfully Logged in",
        token: jwToken,
        data: {
          user: userWithoutPassword,
        },
      });
    }
    return res.status(401).json({
      message: "Invalid credentials",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.postRegister = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send({
        message: "Email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const result = await user.save();
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
