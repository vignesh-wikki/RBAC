const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const validator = require("./utils/validator");

router.post("/register", validator(), async (req, res) => {
  const errors = validationResult(req);
  const { email, password, confirmpassword } = req.body;
  if (confirmpassword !== password) {
    req.flash("error", "Passwords do not match");
    return res.redirect("/auth/login");
  }
  if (!errors.isEmpty()) {
    req.flash(
      "error",
      errors.array().map((error) => error.msg)
    );
    return res.redirect("/auth/register");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email already exists!");
      return res.redirect("/auth/register");
    }

    const newUser = new User({ email, password });
    await newUser.save();

    req.flash("success", "You are now registered! Please log in.");
    return res.redirect("/auth/login");
  } catch (error) {
    console.error("Error during registration:", error);
    req.flash("error", "Internal server error. Please try again later.");
    return res.redirect("/auth/register");
  }
});

router.post("/login", validator(), async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash(
      "error",
      errors.array().map((error) => error.msg)
    );
    return res.redirect("/auth/login"); // Redirect back to login page to show the flash messages
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid Email");
      return res.redirect("/auth/login"); // Redirect back to login page to show the flash message
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      req.flash("error", "Invalid Password");
      return res.redirect("/auth/login"); // Redirect back to login page to show the flash message
    }

    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true });

    res.redirect("/home");
  } catch (err) {
    console.error(err);
    req.flash("error", "Server error. Please try again.");
    res.redirect("/auth/login"); 
  }
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  req.flash('success','Logged out')
  res.redirect("/auth/login");
});

module.exports = router;
