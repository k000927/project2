const { model } = require("mongoose");
const { CommentSchema } = require("../schemas");

const Comment = model("comments", CommentSchema);

class CommentModel {
  async create(text) {
    return await Comment.create({ text });
  }
  async delete(comment_id) {
    return await Comment.findOneAndUpdate({ comment_id }, { $set: { isDeleted: true } }, { new: true });
  }
  async findById(comment_id) {
    const comment = await Comment.findOne({ comment_id });
    return { text: comment.text, isDeleted: comment.isDeleted, comment_id: comment.comment_id, parentComment_id: comment.parentComment_id, createdAt: comment.createdAt };
  }
}

module.exports = new CommentModel();
