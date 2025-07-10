//"register/login/logout"
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      status: 400, // Fixed typo here
      message: "Please provide all required fields: name, email, and password.",
    });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 400, // Fixed typo here
        message: "User with this email already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign(
      {
        userid: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Added expiration
    );

    return res.status(201).json({
      status: 201,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      message: "User registered successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// Login an existing user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Please provide both email and password.",
      });
    }

    const checkedUser = await User.findOne({ email });
    if (!checkedUser) {
      return res.status(400).json({
        status: 400,
        message: "User with this email does not exist.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      checkedUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        status: 400,
        message: "Invalid password.",
      });
    }

    const token = jwt.sign(
      {
        userid: checkedUser._id,
        email: checkedUser.email,
        name: checkedUser.name,
        role: checkedUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Added expiration
    );

    return res.status(200).json({
      status: 200,
      token,
      user: {
        id: checkedUser._id,
        name: checkedUser.name,
        email: checkedUser.email,
        role: checkedUser.role,
      },
      message: "Login successful.",
    });
  } catch (error) {
    next(error);
  }
};
