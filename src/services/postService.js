const { userModel, postModel, postToboardModel, albumToboardModel } = require("../DB/models");
const AppError = require("../misc/AppError");

class postService {
  constructor(userModel, postModel, postToboardModel, albumToboardModel) {
    this.postModel = postModel;
    this.postToboardModel = postToboardModel;
    this.albumToboardModel = albumToboardModel;
    this.userModel = userModel;
  }

  async getAllPosts({ limit, offset }) {
    const posts = await this.postToboardModel.getAllPosts({ limit, offset });
    return Promise.all(
      posts.map(async (item) => {
        const user = await this.userModel.getUserInfo(item.user_id);
        return { post: item, user: user };
      })
    );
  }

  async putPost({ post_id, title, content }) {
    const post = await this.postModel.update({ post_id, title, content });
    return { title: post.title, content: post.content, createdAt: post.createdAt, updatedAt: post.updatedAt, post_id: post.post_id };
  }

  async deletePost(post_id) {
    const deletePost = await this.postModel.delete(post_id);
    const deletePostFromGroup = await this.postToboardModel.delete(post_id);
    return { deletePost: deletePost, deletePostFromGroup: deletePostFromGroup };
  }

  async getAllAlbums({ limit, offset }) {
    const albums = await this.albumToboardModel.getAllAlbums({ limit, offset });
    return Promise.all(
      albums.map(async (item) => {
        const user = await this.userModel.getUserInfo(item.user_id);
        return { album: item, user: user };
      })
    );
  }
}

module.exports = new postService(userModel, postModel, postToboardModel, albumToboardModel);
