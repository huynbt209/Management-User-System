const express = require("express");
const passport = require("passport");
const dbContext = require("../dbInit/dbcontext");
const { Role, User } = dbContext;
const Jwt = require("jsonwebtoken");

const router = express.Router();

const signToken = (userId) => {
  return Jwt.sign(
    {
      issues: "TAM-Application",
      subject: userId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "86400s" }
  );
};

router.get("/login", async (req, res) => {
  res.render("../views/auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  async (req, res, next) => {
    if (req.isAuthenticated()) {
      const { _id, email, roleId, fullname } = req.user;
      const findRole = await Role.findById(roleId);
      const role = findRole.name;
      const token = signToken(_id);
      res.cookie("token", token, {
        httpOnly: true,
      })
      res.status(200).json({
        status: 200,
        isAuthenticated: true,
        token,
        data: {
          _id,
          email,
          fullname,
          role,
          token,
        },
      });
      next();
    } else {
      res.status(401).json({
        message: { mesBody: "Unauthorized" },
        mesError: true,
        status: 401,
        isAuthenticated: false,
      });
    }
  }
);

router.get("/register", async (req, res) => {
  res.render("../views/auth/register");
});

router.post("/register", async (req, res, next) => {
  const { email, password, fullname } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      mesError: true,
      isCreated: false,
      message: { mesBody: "Missing email or password" },
    });
  }
  if (!fullname) {
    return res.status(400).json({
      mesError: true,
      isCreated: false,
      message: { mesBody: "Please Input Your Name!" },
    });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: 400,
        mesError: true,
        isCreated: false,
        message: { mesBody: "Email Already Exists!" },
      });
    } else {
      const userRoleId = await Role.findOne({ name: "USER" });
      const newUser = new User({
        email,
        password,
        fullname,
        roleId: userRoleId._id,
      });
      await newUser.save();
      res.status(201).json({
        status: 201,
        message: "Register successfully",
        user: newUser,
        isCreated: true,
        mesError: false,
      });
    }
  } catch (error) {
    res.status(500).json({ message: { mesBody: "Error" }, mesError: true });
    next(error);
  }
});

module.exports = router;
