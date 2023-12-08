const express = require("express");
const router = express.Router();
const Comment = require("../../models/comments/Comment");

const commentsController = require("../../controllers/comments/commentsController");

const Protected = require("../../middlewares/Protected");

router.post("/:pid", Protected, commentsController.createComment);

router.delete("/:cid", Protected, commentsController.deleteComment);

router.put("/:cid", Protected, commentsController.updateComment);
router.get("/updateComment/:cid", async (req, res) => {
  const cid = req.params.cid;
  const comment = await Comment.findById(cid);
  res.render("comments/updateComment", { comment, error: "" });
});
module.exports = router;
