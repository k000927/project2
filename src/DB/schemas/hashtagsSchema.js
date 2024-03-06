const { Schema } = require("mongoose");

const hashtagsSchema = new Schema(
  {
    post_id: {
      type: Number,
      required: true,
    },
    hashtag: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = hashtagsSchema;
