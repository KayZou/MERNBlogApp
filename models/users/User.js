const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    coverImage: { type: String },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    role: { type: String, default: "Blogger" },
    bio: { type: String, default: "My Bio is so great!" },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", UserSchema);
