const router = require("express").Router();

router.get("/home", (req, res, next) => {
  return res.render("home");
});

module.exports = router;
