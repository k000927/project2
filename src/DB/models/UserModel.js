const { model } = require("mongoose");
const { UserSchema } = require("../schemas");
const AppError = require("../../misc/AppError");

const User = model("users", UserSchema);

class UserModel {
  async findByEmail(email) {
    return await User.findOne({ email });
  }
  async create(user) {
    return await User.create(user);
  }
  async findByName(name) {
    return await User.findOne({ name: name });
  }
  async withdrawalUser(user_id) {
    return await User.findOneAndUpdate({ user_id: user_id }, { $set: { isActivated: false } }, { new: true });
  }
  async findUser(user_id) {
    const user = await User.findOne({ user_id });
    if (!user) {
      throw new AppError("Bad Request", 400, "해당 유자가 존재하지 않습니다.");
    }
    return user;
  }
  async findByIdAndUpdateInfo({ user_id, name, introduction }) {
    return await User.findOneAndUpdate({ user_id: user_id }, { $set: { name, introduction } }, { new: true });
  }
  async findByIdAndUpdatePassword({ user_id, hashedPW }) {
    return await User.findOneAndUpdate({ user_id: user_id }, { $set: { password: hashedPW } }, { new: true });
  }
  async getAllUsers({ limit, offset }) {
    return await User.find({ role: "user" }).limit(limit).skip(offset);
  }
  async adminPutUser({ user_id, name, email, profilePic, introduction }) {
    return await User.findOneAndUpdate({ user_id: user_id }, { $set: { email, name, profilePic, introduction } }, { new: true });
  }
  async deleteUser(user_id) {
    return await User.deleteOne({ user_id });
  }
  async updateProfile({ user_id, profilePic }) {
    const user = await User.findOneAndUpdate({ user_id }, { $set: { profilePic } }, { new: true });
    return user.profilePic;
  }
  async getUserInfo(user_id) {
    const user = await User.findOne({ user_id: user_id });
    return { name: user.name, profilePic: user.profilePic, introduction: user.introduction };
  }
}

module.exports = new UserModel();
