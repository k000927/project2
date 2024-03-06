const { userModel, groupTouserModel, groupModel, postToboardModel, albumToboardModel } = require("../DB/models");
const jwt = require("jsonwebtoken");
const { hashPassword, randomName } = require("../misc/utils");
const bcrypt = require("bcrypt");
const AppError = require("../misc/AppError");

class userService {
  constructor(userModel, groupTouserModel, groupModel, postToboardModel, albumToboardModel) {
    this.userModel = userModel;
    this.groupTouserModel = groupTouserModel;
    this.groupModel = groupModel;
    this.postToboardModel = postToboardModel;
    this.albumToboardModel = albumToboardModel;
  }

  async postUser(userInfo) {
    const { email, password } = userInfo;
    const hashedPW = await hashPassword(password);
    const newUser = await this.userModel.create({ email, password: hashedPW, name: randomName() });
    return newUser;
  }

  async getUserToken(userinfo) {
    const { email, password } = userinfo;
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new AppError("Bad Request", 400, "가입되지 않은 이메일입니다.");
    }
    if (!user.isActivated) {
      throw new AppError("Bad Request", 400, "사용할 수 없는 이메일입니다.");
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError("Bad Request", 400, "비밀번호를 확인해 주세요.");
    }
    const role = user.role;
    const user_id = user.user_id;
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ user_id, role }, secretKey, { expiresIn: "1h" });
    const isAdmin = role === "admin" ? true : false;
    return { token, isAdmin };
  }

  async isDuplicatedEmail(email) {
    const user = await userModel.findByEmail(email);
    if (user) {
      return true;
    }
    return false;
  }

  async withdrawalUser({ user_id, password }) {
    const user = await this.userModel.findUser(user_id);
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError("Bad Request", 400, "비밀번호를 확인해 주세요.");
    }
    const deleteUserFromGroup = await this.groupTouserModel.leaveAllGroup(user_id);
    const withdrawal = await this.userModel.withdrawalUser(user_id);
    return { deleteUserFromGroup: deleteUserFromGroup, withdrawal: withdrawal };
  }

  async getUser(user_id) {
    const getUser = await this.userModel.findUser(user_id);
    const getGroup = await this.groupTouserModel.getGroup(user_id);
    return { getUser, group: getGroup };
  }

  async putUser({ user_id, password, name, introduction }) {
    return userModel.findByIdAndUpdateInfo({ user_id, name, introduction });
  }

  async putPassword({ user_id, password }) {
    const hashedPW = await hashPassword(password);
    return userModel.findByIdAndUpdatePassword({ user_id, hashedPW });
  }

  async joinGroup({ user_id, group_id }) {
    const group = await this.groupModel.findById(group_id);
    if (!group) {
      throw new AppError("Bad Request", 400, "존재하지 않는 그룹입니다.");
    }
    if (!group.isRecruit) {
      throw new AppError("Bad Request", 400, "모집중인 모임이 아닙니다.");
    }
    const groupTouser = await this.groupTouserModel.findUserAndGroupById({ user_id, group_id });
    if (groupTouser) {
      throw new AppError("Bad Request", 400, "이미 가입한 그룹입니다.");
    }
    const groupMem = await this.groupTouserModel.getGroupMember(group_id);
    if (groupMem.length >= group.maxMember) {
      throw new AppError("Bad Request", 400, "가입할 수 없는 그룹입니다.");
    }
    return groupTouserModel.joinGroup({ user_id, group_id });
  }

  async leaveGroup({ user_id, group_id }) {
    const group = await this.groupModel.findById(group_id);
    if (!group) {
      throw new AppError("Bad Request", 400, "존재하지 않는 그룹입니다.");
    }
    const userLeaveGroup = await this.groupTouserModel.deleteUser({ user_id, group_id });
    if (!userLeaveGroup) {
      throw new AppError("Bad Request", 400, "가입하지 않은 그룹입니다.");
    }
    if (user_id === group.leader) {
      throw new AppError("Bad Request", 400, "그룹장은 탈퇴가 불가능합니다.");
    }
    return userLeaveGroup;
  }

  async getMyPosts({ user_id, offset, limit }) {
    const posts = await this.postToboardModel.findPostsByUserId({ user_id, offset, limit });
    const albums = await this.albumToboardModel.findAlbumsByUserId({ user_id, limit, offset });
    return { posts, albums };
  }

  async getUserName(user_id) {
    const user = await this.userModel.findUser(user_id);
    return user.name;
  }

  async getAllUsers({ limit, offset }) {
    const users = await this.userModel.getAllUsers({ limit, offset });
    return users.map((item) => {
      return { name: item.name, email: item.email, user_id: item.user_id };
    });
  }

  async adminPutUser({ user_id, email, name, profilePic, introduction }) {
    const putUser = await this.userModel.adminPutUser({ user_id, email, name, profilePic, introduction });
    return { email: putUser.email, name: putUser.name, profilePic: putUser.profilePic, introduction: putUser.introduction, createdAt: putUser.createdAt, user_id: putUser.user_id };
  }

  async deleteUser(user_id) {
    const deleteUserFromGroup = await this.groupTouserModel.leaveAllGroup(user_id);
    const deleteUser = await this.userModel.withdrawalUser(user_id);
    return { deleteUserFromGroup: deleteUserFromGroup, deleteUser: deleteUser };
  }

  async putProfile({ user_id, profilePic }) {
    return await this.userModel.updateProfile({ user_id, profilePic });
  }

  async getUserInfo(user_id) {
    return await this.userModel.getUserInfo(user_id);
  }
}

module.exports = new userService(userModel, groupTouserModel, groupModel, postToboardModel, albumToboardModel);
