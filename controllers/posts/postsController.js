const Post = require("../../models/posts/Post");
const User = require("../../models/users/User");
const Comment = require("../../models/comments/Comment");

const AppError = require("../../utils/AppError");

const createPost = async (req, res, next) => {
  const { title, description, category, user } = req.body;
  if (!title || !description || !category) {
    // return next(AppError("Please fill all fields!", 400));
    return res.render("posts/addPost", { error: "Please fill all fields!" });
  }
  try {
    const uid = req.session.userAuth;
    const isUser = await User.findById(uid);
    // console.log(isUser);
    if (!isUser) {
      return next(AppError("Couldn't find the user!", 400));
    }
    const createdPost = await Post.create({
      title,
      description,
      category,
      image: req.file.path,
      user: uid,
    });
    if (!createdPost) {
      // return next(AppError("Couldn't create the post", 400));
      return res.render("posts/addPost", {
        error: "Couldn't create the post!",
      });
    }
    isUser.posts.push(createdPost._id);
    await isUser.save();
    // res.status(201).json({
    //   status: "success",
    //   data: createdPost,
    // });
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return next(AppError(error));
  }
};

const getSinglePost = async (req, res, next) => {
  const pid = req.params.pid;
  try {
    const post = await Post.findById(pid).populate("comments").populate("user");
    if (!post) {
      // return next(AppError("Couldn't find this post", 400));
      res.render("posts/postDetails", { error: "Couldn't find this post!" });
    }
    // res.status(200).json({
    //   status: "success",
    //   data: post,
    // });
    res.render("posts/postDetails", { post, error: "" });
  } catch (error) {
    // return next(AppError(error));
    res.render("posts/postDetails", { error });
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate("comments", "user message");
    if (!posts) {
      return next(AppError("Couldn't find any post", 400));
    }
    res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    return next(AppError(error));
  }
};

const updateUserPost = async (req, res, next) => {
  const pid = req.params.pid;
  const uid = req.session.userAuth;
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return next(AppError("Please fill all fields!", 400));
  }
  try {
    const post = await Post.findById(pid);
    if (post.user.toString() !== uid) {
      return next(AppError("This post is NOT yours!", 400));
    }
    const updatedPost = await Post.findByIdAndUpdate(
      pid,
      {
        title,
        description,
        category,
        image: req.file ? req.file.path : post?.image,
      },
      { new: true, runValidators: true },
    );
    if (!updatedPost) {
      return next(AppError("Couldn't update this post", 400));
    }
    // res.status(200).json({
    //   status: "success",
    //   data: updatedPost,
    // });
    res.redirect("/api/v1/posts/" + updatedPost._id);
  } catch (error) {
    return next(AppError(error));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const uid = req.session.userAuth;
    const post = await Post.findById(pid).populate("comments");
    if (!post) {
      return next(AppError("Post not found", 404));
    }
    if (post.user.toString() !== uid) {
      return next(AppError("You are not authorized to delete this post", 403));
    }
    const user = await User.findById(uid);
    const commentIds = post.comments.map((comment) => comment._id);
    await Comment.deleteMany({ _id: { $in: commentIds } });
    user.posts.pull(pid);
    await user.save();
    await Post.findByIdAndDelete(pid);
    // res.status(204).json({
    //   status: "success",
    //   data: "Post deleted successfully",
    // });
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return next(AppError(error, 500));
  }
};

module.exports = {
  createPost,
  getSinglePost,
  getAllPosts,
  updateUserPost,
  deletePost,
};
