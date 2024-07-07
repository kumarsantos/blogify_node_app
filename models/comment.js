const { Schema, model, models } = require("mongoose");

const commentSchema = new Schema(
  {
    content: {
      type: String,
      require: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Comments = models.Comments || model("Comments", commentSchema);
module.exports = Comments;
