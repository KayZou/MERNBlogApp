const express = require("express");
const router = express.Router();

const Protected = require("../../middlewares/Protected");

const usersController = require("../../controllers/users/usersController");

const storage = require("../../config/Cloudinary");
const multer = require("multer");

const upload = multer({ storage });

router.post("/register", usersController.registerUser);
router.get("/register", (req, res, next) => {
  res.render("users/Register", { error: "" });
});

router.post("/login", usersController.loginUser);
router.get("/login", (req, res, next) => {
  res.render("users/login", { error: "" });
});

router.get("/logout", Protected, usersController.logoutUser);

router.get("/profile", Protected, usersController.getUserProfile);
router.get("/profile-page", (req, res) => {
  res.render("users/profile", { userData: null, error: "" });
});

router.put("/update", Protected, usersController.updateUserData);
router.get("/update-profile", (req, res) => {
  res.render("users/updateUser", { error: "", userData: null });
});

router.put("/update-password", Protected, usersController.updateUserPassword);
router.get("/updatePassword", (req, res, next) => {
  res.render("users/updatePassword", { error: "" });
});

router.put(
  "/update-profile-image",
  Protected,
  upload.single("profileImage"),
  usersController.updateUserProfileImage,
);
router.get("/upload-profile-photo", (req, res) => {
  res.render("users/uploadProfilePhoto", { error: "" });
});

router.put(
  "/update-cover-image",
  Protected,
  upload.single("coverImage"),
  usersController.updateCoverImage,
);
router.get("/upload-cover-photo", (req, res) => {
  res.render("users/uploadCoverPhoto", { error: "" });
});

router.get("/", Protected, usersController.getAllUsers);

router.get("/:uid", Protected, usersController.getUserDetails);

module.exports = router;
