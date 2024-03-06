const { Schema } = require("mongoose");
const { counterSchema, Counter } = require("./counterSchema");

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    post_id: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps: { currentTime: () => new Date(new Date().getTime() + 1000 * 60 * 60 * 9) },
  }
);

PostSchema.pre("save", function (next) {
  const doc = this;
  Counter.findByIdAndUpdate({ _id: "post_id" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
    .then(function (counter) {
      doc.post_id = counter.seq;
      next();
    })
    .catch(function (error) {
      return next(error);
    });
});

module.exports = PostSchema;
