const { Router } = require("express");
const { groupService } = require("../services");
const { asyncHandler, isAuthenticated } = require("../middlewares");
const { buildResponse } = require("../misc/utils");
const { uploadProfile, uploadPost } = require("../misc/multer");

const router = Router();

router.post(
  "/",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { name, introduction, tag, place, location, age, genre, day } = req.body;
    const postGroup = await groupService.postGroup({ user_id, name, introduction, tag, place, location, age, genre, day });
    res.json(buildResponse(postGroup));
  })
);

router.get(
  "/:group_id",
  asyncHandler(async (req, res, next) => {
    const group_id = req.params.group_id;
    const groupInfo = await groupService.getGroup({ group_id });
    res.json(buildResponse(groupInfo));
  })
);

router.put(
  "/profilePic",
  uploadProfile.single("img"),
  asyncHandler(async (req, res, next) => {
    const file = req.file;
    const filename = file.filename;
    res.json(buildResponse(filename));
  })
);

router.put(
  "/:group_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const group_id = req.params.group_id;
    const user_id = req.user_id;
    const { name, tags, introduction, place, location, day, genre, age } = req.body;
    const putGroup = await groupService.putGroup({ group_id, user_id, name, tags, introduction, place, location, day, genre, age });
    res.json(buildResponse(putGroup));
  })
);

router.delete(
  "/:group_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const group_id = req.params.group_id;
    const user_id = req.user_id;
    const deleteGroup = await groupService.deleteGroup({ group_id, user_id });
    res.json(buildResponse(deleteGroup));
  })
);

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const { orderBy, location, day, genre, age } = req.query;
    const condition = { location, day, genre, age };
    const { limit, offset } = req.query;
    const groupsInfo = await groupService.getGroups({ orderBy, condition, limit, offset });
    res.json(buildResponse(groupsInfo));
  })
);

//사진 업로드
router.post(
  "/images",
  isAuthenticated,
  uploadPost.array("img", 3),
  asyncHandler(async (req, res, next) => {
    const files = req.files;
    const filenames = files.map((item) => item.filename);
    res.json(buildResponse(filenames));
  })
);

router.post(
  "/:group_id/posts",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const group_id = req.params.group_id;
    const { title, content, images } = req.body;
    const postPost = await groupService.postPost({ user_id, group_id, title, content, images });
    res.json(buildResponse(postPost));
  })
);

router.get(
  "/:group_id/posts",
  asyncHandler(async (req, res, next) => {
    const group_id = req.params.group_id;
    const { offset, limit } = req.query;
    const getPosts = await groupService.getPosts({ group_id, limit, offset });
    res.json(buildResponse(getPosts));
  })
);

router.put(
  "/:group_id/profilePic",
  isAuthenticated,
  uploadProfile.single("img"),
  asyncHandler(async (req, res, next) => {
    const { user_id, group_id } = req.params;
    const profilePic = req.file.filename;
    const editProflie = await groupService.putProfile({ group_id, user_id, profilePic });
    res.json(buildResponse(editProflie));
  })
);

router.get(
  "/:group_id/posts/:post_id",
  asyncHandler(async (req, res, next) => {
    const group_id = req.params.group_id;
    const post_id = req.params.post_id;
    const getPost = await groupService.getPost({ group_id, post_id });
    res.json(buildResponse(getPost));
  })
);

router.put(
  "/:group_id/posts/:post_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id, post_id } = req.params;
    const { title, content, images } = req.body;
    const putPost = await groupService.putPost({ user_id, group_id, post_id, title, content, images });
    res.json(buildResponse(putPost));
  })
);

router.delete(
  "/:group_id/posts/:post_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id, post_id } = req.params;
    const deletePost = await groupService.deletePost({ user_id, group_id, post_id });
    res.json(buildResponse(deletePost));
  })
);

router.post(
  "/:group_id/posts/:post_id/comments",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id, post_id } = req.params;
    const { text } = req.body;
    const postComment = await groupService.postComment({ user_id, group_id, post_id, text });
    res.json(buildResponse(postComment));
  })
);

router.get(
  "/:group_id/posts/:post_id/comments",
  asyncHandler(async (req, res, next) => {
    const { group_id, post_id } = req.params;
    const { limit, offset } = req.query;
    const getComments = await groupService.getComments({ post_id, limit, offset });
    res.json(buildResponse(getComments));
  })
);

router.put(
  "/:group_id/posts/:post_id/comments/:comment_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id, comment_id } = req.params;
    const deleteComments = await groupService.deleteComment({ user_id, group_id, comment_id });
    res.json(buildResponse(deleteComments));
  })
);

router.post(
  "/:group_id/posts/:post_id/comments/:comment_id/reply",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id, comment_id } = req.params;
    const { text } = req.body;
    const postReply = await groupService.postReply({ user_id, group_id, parentComment_id: comment_id, text });
    res.json(buildResponse(postReply));
  })
);

router.get(
  "/:group_id/posts/:post_id/comments/:comment_id/reply",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id, comment_id } = req.params;
    const getReplies = await groupService.getReplies({ user_id, group_id, comment_id });
    res.json(buildResponse(getReplies));
  })
);

router.put(
  "/:group_id/posts/:post_id/comments/:comment_id/reply/:reply_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id, reply_id } = req.params;
    const deleteReply = await groupService.deleteReply({ user_id, group_id, reply_id });
    res.json(buildResponse(deleteReply));
  })
);

router.put(
  "/:group_id/posts/:post_id/like",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id, post_id } = req.params;
    const postLike = await groupService.postLike({ user_id, group_id, post_id });
    res.json(buildResponse(postLike));
  })
);

router.get(
  "/:group_id/posts/:post_id/like",
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id, post_id } = req.params;
    const getPostLike = await groupService.getPostLike({ user_id, group_id, post_id });
    res.json(buildResponse({ likeNum: getPostLike }));
  })
);

router.put(
  "/:group_id/like",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id } = req.params;
    const groupLike = await groupService.groupLike({ user_id, group_id });
    res.json(buildResponse(groupLike));
  })
);

router.get(
  "/:group_id/like",
  asyncHandler(async (req, res, next) => {
    const { group_id } = req.params;
    const getGroupLike = await groupService.getGroupLike(group_id);
    res.json(buildResponse({ likesNum: getGroupLike }));
  })
);

router.post(
  "/:group_id/albums",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const group_id = req.params.group_id;
    const { title, content, images } = req.body;
    const postAlbum = await groupService.postAlbum({ user_id, group_id, title, content, images });
    res.json(buildResponse(postAlbum));
  })
);

router.get(
  "/:group_id/albums",
  asyncHandler(async (req, res, next) => {
    const group_id = req.params.group_id;
    const { offset, limit } = req.query;
    const getAlbums = await groupService.getAlbums({ group_id, limit, offset });
    res.json(buildResponse(getAlbums));
  })
);

router.put(
  "/:group_id/albums/:post_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id, post_id } = req.params;
    const { title, content, images } = req.body;
    const putAlbum = await groupService.putAlbum({ user_id, group_id, post_id, title, content, images });
    res.json(buildResponse(putAlbum));
  })
);

router.delete(
  "/:group_id/albums/:post_id",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const user_id = req.user_id;
    const { group_id, post_id } = req.params;
    const deleteAlbum = await groupService.deleteAlbum({ user_id, group_id, post_id });
    res.json(buildResponse(deleteAlbum));
  })
);

module.exports = router;
