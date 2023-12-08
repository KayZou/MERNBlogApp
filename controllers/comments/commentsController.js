const Post = require("../../models/posts/Post");
const User = require("../../models/users/User");
const Comment = require("../../models/comments/Comment");

const AppError = require("../../utils/AppError");

const createComment = async (req, res, next) => {
  const uid = req.session.userAuth;
  const pid = req.params.pid;
  const { message } = req.body;
  try {
    const post = await Post.findById(pid).populate("user").populate("comments");
    const thisUser = await User.findById(uid);
    if (!post) {
      // return next(AppError("Couldn't find the post", 400));
      return res.render("posts/postDetails", {
        error: "Couldn't find the post!",
      });
    }
    const createdComment = await Comment.create({
      message,
      user: uid, //thisUser._id
    });
    post.comments.push(createdComment._id);
    thisUser.comments.push(createdComment._id);
    await thisUser.save({ validateBeforeSave: false });
    await post.save();
    // res.status(201).json({
    //   status: "success",
    //   data: createdComment,
    // });
    res.redirect("/api/v1/posts/" + post?._id);
  } catch (error) {
    // return next(AppError(error));
    return res.render("posts/postDetails", { error });
  }
};

const deleteComment = async (req, res, next) => {
  const cid = req.params.cid;
  const uid = req.session.userAuth;
  try {
    const comment = await Comment.findById(cid);
    const user = await User.findById(uid);
    if (comment.user.toString() !== uid) {
      return next(AppError("The comment is not yours!", 400));
    }
    user.comments.pull(cid);
    await user.save();
    await Comment.findByIdAndDelete(cid);
    // res.status(204).json({
    //   status: "success",
    //   data: "Comment deleted successfully",
    // });
    res.redirect(req.get("referer"));
  } catch (error) {
    return next(AppError(error));
  }
};

const updateComment = async (req, res, next) => {
  const cid = req.params.cid;
  const uid = req.session.userAuth;
  const { message } = req.body;
  if (!message) {
    return next(AppError("Please fill all fields", 400));
  }
  try {
    const comment = await Comment.findById(cid);
    if (!comment) {
      return next(AppError("Comment not found", 404));
    }
    if (comment.user.toString() !== uid.toString()) {
      return next(AppError("Couldn't update this comment!", 400));
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      cid,
      { message },
      { new: true, runValidators: true },
    );
    // res.status(200).json({
    //   status: "success",
    //   data: updatedComment,
    // });
    // res.setHeader("Refresh", "0;url=" + req.get("referer"));
    // res.end();
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return next(AppError(`Error updating comment: ${error.message}`, 500));
  }
};

module.exports = {
  createComment,
  deleteComment,
  updateComment,
};
