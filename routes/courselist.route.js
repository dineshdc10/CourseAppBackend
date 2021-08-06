var express = require("express");
var router = express.Router();

// Require controller modules.
var list_controller = require("../controllers/courselist.controller");

router.post("/addcourse", list_controller.addCourse);
router.get("/getcourselist", list_controller.getPaidCourseList);
router.post("/verifypaidcourse", list_controller.verifyPaidCourse);
module.exports = router;