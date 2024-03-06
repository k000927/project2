const { model } = require("mongoose");
const { PostSchema } = require("../schemas");

const Post = model("posts", PostSchema);

class PostModel {
  async create({ title, content, images }) {
    return await Post.create({ title: title, content: content, images: images });
  }
  async update({ post_id, title, content, images }) {
    return await Post.findOneAndUpdate({ post_id: post_id }, { $set: { title: title, content: content, images: images } }, { new: true });
  }
  async delete(post_id) {
    return await Post.deleteOne({ post_id: post_id });
  }
  async findPostByPostId(post_id) {
    return await Post.findOne({ post_id });
  }
  async getAllPosts() {
    return await Post.find();
  }
}

module.exports = new PostModel();
