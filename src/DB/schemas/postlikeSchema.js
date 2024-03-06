const { Schema } = require("mongoose");

const postlikeSchema = new Schema({
  user_id: {
    type: Number,
    required: true,
  },
  post_id: {
    type: Number,
    required: true,
  },
});

module.exports = postlikeSchema;
