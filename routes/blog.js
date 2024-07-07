const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comments = require("../models/comment");
const router = Router();

///multer file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, `./public/uploads`);
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname;
    return cb(null, fileName);
  },
});
const upload = multer({ storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", { user: req?.user });
});

router.post("/add-new", upload.single("coverImg"), async (req, res) => {
  try {
    const { title, body } = req.body;
    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user?._id,
      coverImgURL: `uploads/${req.file?.filename}`,
    });
    return res.redirect(`/blog/${blog?._id}`);
  } catch (error) {
    return res.render("addBlog", {
      user: req?.user,
      error: "Failed to create a blog!",
    });
  }
});

router.post("/comment/:blogId", async (req, res) => {
  const { blogId } = req.params;
  try {
    await Comments.create({
      content: req.body.content,
      blogId,
      createdBy: req.user?._id,
    });
    return res.redirect(`/blog/${blogId}`);
  } catch (error) {
    return res.render("blog", { error: "Something went wrong" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id).populate("createdBy")
  const comments = await Comments.find({ blogId: id }).populate("createdBy").sort({'createdAt': -1})

  return res.render("blog", { user: req?.user, item: blog, comments });
});

module.exports = router;
