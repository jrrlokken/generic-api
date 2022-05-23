const express = require("express");
const { register, login } = require("../controllers/auth");
const router = express.Router();

router.post("/register", register);
router.route("/login").get(login);

module.exports = router;
