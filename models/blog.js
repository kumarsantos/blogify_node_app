const { Schema, model, models } = require("mongoose");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    body: {
      type: String,
      required: true,
    },

    coverImgURL: {
      type: String,
      require: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Blog = models.Blog || model("Blog", blogSchema);
module.exports = Blog;
