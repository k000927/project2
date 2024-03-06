const { Schema } = require("mongoose");
const { groupSearchSchema } = require("./counterSchema");

const GroupSearchSchema = new Schema({
  group_id: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
  },
  day: {
    type: String,
  },
  genre: {
    type: String,
  },
  age: {
    type: String,
  },
});

module.exports = GroupSearchSchema;
