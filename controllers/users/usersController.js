const bcrypt = require("bcryptjs");

const User = require("../../models/users/User");
const AppError = require("../../utils/AppError");
const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      // return next(AppError("Please fill all fields!", 400));
      return res.render("users/register", { error: "Please fill all fields!" });
    }
    const userFound = await User.findOne({ email });
    if (userFound) {
      // return next(AppError("User already exists!", 400));
      return res.render("users/register", { error: "User already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const registeredUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    if (!registeredUser) {
      return next(AppError("Couldn't create user", 400));
    }
    // res.status(201).json({ status: "success", data: registeredUser });
    res.redirect("/api/v1/users/login");
  } catch (error) {
    return next(AppError(error.message));
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // return next(AppError("Please fill all fields!", 400));
    return res.render("users/login", { error: "Please fill all fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // return next(AppError("User not found", 400));
      return res.render("users/login", { error: "User not found!" });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      // return next(AppError("Credentials are not correct!", 400));
      return res.render("users/login", {
        error: "Credentials are not correct!",
      });
    }
    req.session.userAuth = user._id;
    // console.log(req.session);
    // res.status(200).json({
    //   status: "success",
    //   data: user,
    // });
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return next(AppError(error.message));
  }
};

const logoutUser = async (req, res, next) => {
  req.session.destroy(() => {
    return res.redirect("/api/v1/users/login");
  });
  // res.status(200).json({
  //   status: "success",
  //   message: "logged out successfully",
  // });
};

const getUserProfile = async (req, res, next) => {
  try {
    const uid = req.session.userAuth;
    // console.log(uid);
    const user = await User.findById(uid)
      .populate("posts")
      .populate("comments");
    if (!user) {
      // return next(AppError("User profile not found!", 400));
      return res.render("users/profile", { error: "User profile not found!" });
    }
    // res.status(200).json({
    //   status: "success",
    //   data: user,
    // });
    // console.log(user);
    res.render("users/profile", { userData: user, error: "" });
  } catch (error) {
    // return next(AppError(error));
    return res.render("users/profile", { error: error.message });
  }
};

const getUserDetails = async (req, res, next) => {
  const uid = req.params.uid;
  try {
    const user = await User.findById(uid);
    if (!user) {
      // return next(AppError("User doesn't exist", 400));
      return res.render("users/updateUser", { error: "User doesn't exist" });
    }
    // res.status(200).json({
    //   status: "success",
    //   data: user,
    // });
    res.render("users/updateUser", { userData: user, error: "" });
  } catch (error) {
    // return next(AppError(error.message));
    return res.render("users/updateUser", { error: error.message });
  }
};

const updateUserData = async (req, res, next) => {
  try {
    const userId = req.session.userAuth;
    const { fullName, email } = req.body;
    const isUserWithNewEmail = await User.findOne({ email });
    if (isUserWithNewEmail && isUserWithNewEmail._id.toString() !== userId) {
      return res.render("users/updateUser", {
        error: "Email is already in use!",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, email },
      {
        runValidators: true,
        new: true,
      },
    );
    if (!updatedUser) {
      return res.render("users/updateUser", {
        error: "User to update not found!",
      });
    }
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    return res.render("users/updateUser", { error: error.message });
  }
};
const updateUserPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(
      req.session.userAuth,
      {
        password: hashedPassword,
      },
      { new: true, runValidators: true },
    );
    if (!user) {
      // return next(AppError("Couldn't update this user", 400));
      return res.render("users/updatePassword", {
        error: "Couldn't update the password",
      });
    }
    // res.status(201).json({
    //   status: "success",
    //   data: user,
    // });
    res.redirect("/api/v1/users/login");
  } catch (error) {
    // return next(AppError(error.message));
    return res.render("users/updatePassword", { error: error.message });
  }
};

const updateUserProfileImage = async (req, res, next) => {
  const uid = req.session.userAuth;
  try {
    const user = await User.findByIdAndUpdate(
      uid,
      {
        profileImage: req.file.path,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      // return next(AppError("Couldn't update profile image", 400));
      return res.render("users/uploadProfilePhoto", {
        error: "Couldn't update image!",
      });
    }
    // res.status(201).json({
    //   status: "success",
    //   data: user,
    // });
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    // return next(AppError(error.message));
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

const updateCoverImage = async (req, res, next) => {
  const uid = req.session.userAuth;
  try {
    const user = await User.findByIdAndUpdate(
      uid,
      {
        coverImage: req.file.path,
      },
      { new: true, runValidators: true },
    );
    if (!user) {
      // return next(AppError("Couldn't update cover image", 400));
      return res.render("users/uploadCoverPhoto", {
        error: "Couldn't update cover image",
      });
    }
    // res.status(201).json({
    //   status: "success",
    //   data: user,
    // });
    res.redirect("/api/v1/users/profile");
  } catch (error) {
    // return next(AppError(error.message));
    return res.render("users/uploadCoverPhoto", {
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(400).json({
        message: "No users found!",
      });
    }
    res.status(200).json({
      status: "success",
      length: users.length,
      data: users,
    });
  } catch (error) {
    return next(AppError(error.message));
  }
};
module.exports = {
  registerUser,
  getUserProfile,
  getAllUsers,
  loginUser,
  logoutUser,
  getUserDetails,
  updateUserData,
  updateUserPassword,
  updateUserProfileImage,
  updateCoverImage,
};
