const { Schema, model, models } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../utils/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    password: {
      type: String,
      require: true,
    },
    salt: { type: String, require: true },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    profileImage: {
      type: String,
      default: "/images/user_icon.png",
    },
  },
  { timestamps: true }
);

//will run before save
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found!");
    const salt = user?.salt;
    const hashedPassword = user?.password;
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    if (hashedPassword !== userProvidedHash) {
      throw new Error("Invalid Email or Password!");
    }
    const token =  createTokenForUser(user);
    return token;
  }
);

const User = models.User || model("User", userSchema);
module.exports = User;
