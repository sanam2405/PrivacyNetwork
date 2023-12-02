const mongoose = require("mongoose"); 
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String, 
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Photo: {
    type: String,
  },
  friends: [{ type: ObjectId, ref: "user" }]
});

const User = new mongoose.model("user", userSchema);
module.exports = User;