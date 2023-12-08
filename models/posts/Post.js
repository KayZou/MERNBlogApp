const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["reactJS", "html", "css", "NodeJS", "JS", "other"],
    },
    image: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", PostSchema);
