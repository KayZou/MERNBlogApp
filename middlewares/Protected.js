const AppError = require("../utils/AppError");
const Protected = (req, res, next) => {
  if (req.session.userAuth) {
    next();
  } else {
    // return next(AppError("You are not logged in!", 400));
    res.render("users/notAuthorize");
  }
};
module.exports = Protected;
