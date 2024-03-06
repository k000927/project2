const { Schema } = require("mongoose");

const userTopostSchema = new Schema(
  {
    user_id: {
      type: Number,
      required: true,
    },
    post_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = userTopostSchema;
