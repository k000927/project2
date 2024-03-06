const { Router } = require("express");
const { userService, groupService, postService } = require("../services");
const { buildResponse } = require("../misc/utils");
const { asyncHandler } = require("../middlewares");

const router = Router();

router.get(
  "/users",
  asyncHandler(async (req, res, next) => {
    const { limit, offset } = req.query;
    const users = await userService.getAllUsers({ limit, offset });
    res.json(buildResponse(users));
  })
);

router.put(
  "/users/:user_id",
  asyncHandler(async (req, res, next) => {
    const { user_id } = req.params;
    const { email, name, profilePic, introduction } = req.body;
    const { withdrawal } = req.query.withdrawal;
    const putUser = await userService.adminPutUser({ user_id, email, name, profilePic, introduction });
    res.json(buildResponse(putUser));
  })
);

router.delete(
  "/users/:user_id",
  asyncHandler(async (req, res, next) => {
    const { user_id } = req.params;
    const deleteUser = await userService.deleteUser(user_id);
    res.json(buildResponse(deleteUser));
  })
);

router.get(
  "/posts",
  asyncHandler(async (req, res, next) => {
    const { limit, offset } = req.query;
    const posts = await postService.getAllPosts({ limit, offset });
    res.json(buildResponse(posts));
  })
);

router.get(
  "/albums",
  asyncHandler(async (req, res, next) => {
    const { limit, offset } = req.query;
    const albums = await postService.getAllAlbums({ limit, offset });
    res.json(buildResponse(albums));
  })
);

router.put(
  "/posts/:post_id",
  asyncHandler(async (req, res, next) => {
    const { post_id } = req.params;
    const { title, content } = req.body;
    const putPost = await postService.putPost({ post_id, title, content });
    res.json(buildResponse(putPost));
  })
);

router.delete(
  "/posts/:post_id",
  asyncHandler(async (req, res, next) => {
    const { post_id } = req.params;
    const deletePost = await postService.deletePost(post_id);
    res.json(buildResponse(deletePost));
  })
);
router.get(
  "/groups",
  asyncHandler(async (req, res, next) => {
    const { limit, offset } = req.query;
    const getAllGroups = await groupService.getAllGroups({ limit, offset });
    res.json(buildResponse(getAllGroups));
  })
);

router.delete(
  "/groups/:group_id",
  asyncHandler(async (req, res, next) => {
    const { group_id } = req.params;
    const deleteGroup = await groupService.deleteGroup({ group_id });
    res.json(buildResponse(deleteGroup));
  })
);

router.put(
  "/groups/:group_id",
  asyncHandler(async (req, res, next) => {
    const { group_id } = req.params;
    const { name, profile, maxMember, tags } = req.body;
    const putGroup = await groupService.putGroup({ isAdmin: true, group_id, name, profile, maxMember, tags });
    res.json(buildResponse(putGroup));
  })
);

router.put(
  "/groups/:group_id",
  asyncHandler(async (req, res, next) => {
    const group_id = req.params.group_id;
    const { name, tags, introduction, place, location, day, genre, age } = req.body;
    const putGroup = await groupService.adminPutGroup({ group_id, name, tags, introduction, place, location, day, genre, age });
    res.json(buildResponse(putGroup));
  })
);

module.exports = router;
