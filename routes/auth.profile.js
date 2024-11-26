const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.get("/profile", (req, res, next) => {
  const token = req.cookies.token || null;
  if (token === null) {
    return res.redirect("/auth/login");
  }

  const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
  if (verifyToken == null) {
    req.flash("warning", "Please Login");
    return res.redirect("/auth/login");
  }

  const user = verifyToken;

  if (verifyToken.role == "MODERATOR" || verifyToken.role == "ADMIN") {
    return res.render("profile", { user });
  }
  req.flash('info',"Only Signed user and Moderator access this Page");
  return res.redirect("/home");
});

module.exports = router;
