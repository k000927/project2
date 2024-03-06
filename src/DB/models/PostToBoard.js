const { model } = require("mongoose");
const { postToboardSchema, PostSchema } = require("../schemas");
const AppError = require("../../misc/AppError");
const { postService } = require("../../services");

const PostToBoard = model("postToboards", postToboardSchema);
const Post = model("posts", PostSchema);

class PostToBoardModel {
  async create({ post_id, user_id, group_id }) {
    return await PostToBoard.create({ post_id: post_id, group_id: group_id, user_id: user_id });
  }
  async findPostsByGroupId({ group_id, limit, offset }) {
    return await PostToBoard.find({ group_id: group_id }).limit(limit).skip(offset);
  }
  async findPostsByUserId({ user_id, offset, limit }) {
    return await PostToBoard.find({ user_id: user_id }).limit(limit).skip(offset);
  }
  async findPostByPostId(post_id) {
    return await PostToBoard.findOne({ post_id: post_id });
  }
  async delete(post_id) {
    return await PostToBoard.deleteOne({ post_id: post_id });
  }
  async getAllPosts({ limit, offset }) {
    return await PostToBoard.find().limit(limit).skip(offset);
  }
  async deleteAllPosts(user_id) {
    const Posts = await PostToBoard.find({ user_id });
    const deletePosts = Promise.all(
      Posts.map(async (item) => {
        return await Post.deleteOne({ post_id: item.post_id });
      })
    );
    const deletePostsToBoard = await PostToBoard.deleteMany({ user_id });
    return { deletePosts, deletePostsToBoard };
  }
}

module.exports = new PostToBoardModel();
