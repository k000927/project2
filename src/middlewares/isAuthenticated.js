const jwt = require("jsonwebtoken");
const AppError = require("../misc/AppError");

module.exports = (req, res, next) => {
  try {
    const Token = req.cookies.loginToken;
    if (!Token || Token === "null") {
      throw new AppError("Unauthorized", 401, "로그인 후 사용해주세요.");
    }
    jwt.verify(Token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      req.user_id = decoded.user_id;
      req.role = decoded.role;
    });
    next();
  } catch (error) {
    next(error);
  }
};
