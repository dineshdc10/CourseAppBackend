var express = require("express");
var router = express.Router();

// Require controller modules.
var user_controller = require("../controllers/user.controller");

router.post("/login", user_controller.login);
router.get("/logout", user_controller.logout);
router.post("/register", user_controller.register);
module.exports = router;