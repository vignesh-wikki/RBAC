const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

router.get("/user", async (req, res, next) => {
  const token = req.cookies.token || null;
  if (token === null) {
    return res.redirect("/auth/login");
  }
  const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

  if (verifyToken == null) return res.redirect("/auth/login");
  if (verifyToken.role === "ADMIN") {
    const users = await User.find({}, "id email role");
    res.render("manageuser", { users });
  } else {
    req.flash("error", "Access Denied");
    return res.redirect("/home");
  }
});

const verifyAdmin = (req, res, next) => {
  try {
    const token = req.cookies.token || null;
    if (!token) {
      return res.redirect("/auth/login");
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (verifiedToken.role !== "ADMIN") {
      return res.send("Access Denied");
    }

    next();
  } catch (err) {
    req.flash('error',"Admin verification error")
    res.redirect("/auth/login");
  }
};

router.post("/update-role", verifyAdmin, async (req, res) => {
  const { id, role } = req.body;
  try {
    await User.findByIdAndUpdate(id, { role });
    req.flash('success', "Successfully Role Updated")
    res.redirect("/admin/user");
  } catch (error) {
    req.flash("error", "Error updating role");
  }
});

router.post("/delete-user", verifyAdmin, async (req, res) => {
  const { id } = req.body;
  try {
    await User.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted");
    res.redirect("/admin/user");
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).send("Failed to delete user");
  }
});

module.exports = router;
