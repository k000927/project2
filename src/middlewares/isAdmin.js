const jwt = require("jsonwebtoken");
const AppError = require("../misc/AppError");

module.exports = (req, res, next) => {
  try {
    if (req.role !== "admin") {
      throw new AppError("Forbidden", 403, "접근 권한이 없습니다.");
    }
    next();
  } catch (error) {
    next(error);
  }
};
