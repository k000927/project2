const { Schema } = require("mongoose");

const tagsSchema = new Schema(
  {
    group_id: {
      type: Number,
      required: true,
    },
    tag: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

module.exports = tagsSchema;
