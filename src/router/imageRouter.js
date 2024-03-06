const { Router } = require("express");
const path = require("path");
const { asyncHandler } = require("../middlewares");

const router = Router();

router.get("/profile/:src", (req, res, next) => {
  const { src } = req.params;
  res.sendFile(path.join(__dirname, "../../uploads/profiles/", src));
});

router.get("/post/:src", (req, res, next) => {
  const src = req.params.src;
  res.sendFile(path.join(__dirname, "../../uploads/posts/", src));
});

module.exports = router;
