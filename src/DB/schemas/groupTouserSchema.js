const { Schema } = require("mongoose");

const groupTouserSchema = new Schema(
  {
    group_id: {
      type: Number,
      required: true,
    },
    user_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = groupTouserSchema;
