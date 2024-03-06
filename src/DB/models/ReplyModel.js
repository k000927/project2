const { model } = require("mongoose");
const { ReplySchema } = require("../schemas");

const Reply = model("replies", ReplySchema);

class ReplyModel {
  async create({ comment_id, parentComment_id, user_id }) {
    return await Reply.create({ comment_id, parentComment_id, user_id });
  }
  async getRepliesByCommentId(comment_id) {
    return await Reply.find({ parentComment_id: comment_id });
  }
  async findReplyByReplyId(reply_id) {
    return await Reply.findOne({ comment_id: reply_id });
  }
}

module.exports = new ReplyModel();
