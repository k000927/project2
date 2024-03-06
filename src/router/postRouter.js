const { Router } = require("express");
const { postService } = require("../services");
const { buildResponse } = require("../misc/utils");
const { asyncHandler, isAuthenticated } = require("../middlewares");

const router = Router();

module.exports = router;
