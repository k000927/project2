const { model } = require("mongoose");
const { commentTopostSchema } = require("../schemas");

const CommentToPost = model("commentToposts", commentTopostSchema);

class commentTopostModel {
  async create({ comment_id, post_id, user_id }) {
    return await CommentToPost.create({ comment_id, post_id, user_id });
  }
  async findCommentsByPostId({ post_id, limit, offset }) {
    return await CommentToPost.find({ post_id }).limit(limit).skip(offset);
  }
  async findCommentByCommentId(comment_id) {
    return await CommentToPost.find({ comment_id });
  }
}

module.exports = new commentTopostModel();
