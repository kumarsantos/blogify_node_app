const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    await User.create({ fullName, email, password });
    return res.redirect("/");
  } catch (error) {
    return res.render("signup", {
      error: "Failed to create user!",
      success: false,
    });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", { error: "Invalid Email or Password" });
  }
});
router.get("/logout", async (req, res) => {
  try {
    return res.clearCookie("token").redirect("/");
  } catch (error) {
    return res.render("home", { error: "Failed to logout!" });
  }
});

module.exports = router;
