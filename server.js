require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const Helpers = require("./utils/Helpers");

const ConnectDB = require("./config/ConnectDB");

const Post = require("./models/posts/Post");

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan("dev"));

server.set("view engine", "ejs");
server.use(express.static(__dirname + "/public"));

server.use(methodOverride("_method"));

server.use(
  session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
      mongoUrl: process.env.DB_CONNECTION_STRING,
      ttl: 24 * 60 * 60, //1day ,
    }),
  }),
);

//app.locals:
// server.locals.truncatePost = Helpers.truncatePost;
server.use((req, res, next) => {
  res.locals.truncatePost = Helpers.truncatePost;
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  // console.log(res.locals);
  next();
});

const usersRoutes = require("./routes/users/usersRoutes");
const commentsRoutes = require("./routes/comments/commentsRoutes");
const postsRoutes = require("./routes/posts/postsRoutes");

server.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate("user").populate("comments");
    res.render("index", { posts, error: "" });
  } catch (error) {
    return res.render("index", { error });
  }
});

server.use("/api/v1/users", usersRoutes);
server.use("/api/v1/posts", postsRoutes);
server.use("/api/v1/comments", commentsRoutes);

const errorHandler = require("./middlewares/errorHandler");
const { truncatePost } = require("./utils/Helpers");
server.use(errorHandler);

const PORT = 5000 || process.env.PORT;
server.listen(PORT, async () => {
  await ConnectDB();
  console.log(`listening on; http://localhost:${PORT}`);
});
