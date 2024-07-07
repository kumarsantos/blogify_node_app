const express = require("express");
const dotEnv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const connectDB = require("./utils/dbConnection");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

///config db
dotEnv.config();
connectDB();

///app and port
const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')))
app.use(checkForAuthenticationCookie("token"));

//routes
app.get("/", async (req, res) => {
  const blogs = await Blog.find({}).sort({'createdAt': -1})
  return res.render("home", { allBlogs: blogs,user:req.user });
});

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT ", PORT);
});
