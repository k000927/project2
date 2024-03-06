const { model } = require("mongoose");
const { groupTouserSchema } = require("../schemas");
const AppError = require("../../misc/AppError");

const GroupToUser = model("groupTousers", groupTouserSchema);

class groupTouserModel {
  async joinGroup({ user_id, group_id }) {
    return await GroupToUser.create({ user_id: user_id, group_id: group_id });
  }

  async getGroup(user_id) {
    const groups = await GroupToUser.find({ user_id: user_id });
    const group_ids = groups.map((item) => {
      return item.group_id;
    });
    return group_ids;
  }

  async findUserAndGroupById({ user_id, group_id }) {
    return await GroupToUser.findOne({ user_id: user_id, group_id, group_id });
  }

  async deleteUser({ user_id, group_id }) {
    return await GroupToUser.deleteOne({ user_id: user_id, group_id: group_id });
  }

  async getGroupMember(group_id) {
    return await GroupToUser.find({ group_id: group_id });
  }

  async leaveAllGroup(user_id) {
    return await GroupToUser.deleteMany({ user_id: user_id });
  }

  async deleteGroupToUser(group_id) {
    return await GroupToUser.deleteMany({ group_id: group_id });
  }
}

module.exports = new groupTouserModel();
