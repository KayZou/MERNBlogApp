const express = require("express");
const router = express.Router();
const Post = require("../../models/posts/Post");

const multer = require("multer");
const storage = require("../../config/Cloudinary");
const upload = multer({ storage });

const postsController = require("../../controllers/posts/postsController");

const Protected = require("../../middlewares/Protected");

router.post("/", Protected, upload.single("image"), postsController.createPost);
router.get("/addPost", (req, res) => {
  res.render("posts/addPost", { error: "" });
});

router.get("/", postsController.getAllPosts);

router.put(
  "/:pid",
  Protected,
  upload.single("image"),
  postsController.updateUserPost,
);
router.get("/updatePost/:pid", async (req, res) => {
  const pid = req.params.pid;
  try {
    const post = await Post.findById(pid);
    res.render("posts/updatePost", { post, error: "" });
  } catch (error) {
    return res.render("posts/updatePost", { error });
  }
});

router.get("/:pid", postsController.getSinglePost);

router.delete("/:pid", Protected, postsController.deletePost);

module.exports = router;
