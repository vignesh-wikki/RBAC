const { body } = require("express-validator");

function validator() {
  return [
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ];
}

module.exports = validator;
