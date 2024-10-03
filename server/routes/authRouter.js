const express = require("express");

const router = express.Router();

const { login, signup, getAll, verifyToken, logout, userInfo } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getAll", getAll);
router.post("/verifyToken", verifyToken);
router.get("/userInfo", userInfo);
module.exports = router