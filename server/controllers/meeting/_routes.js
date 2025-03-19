const express = require("express");
const meetings = require("./meeting");
const auth = require("../../middelwares/auth");

const router = express.Router();

router.get("/", auth, meetings.index);
router.get("/view/:id", auth, meetings.view);
router.post("/add", auth, meetings.add);
router.delete("/delete/:id", auth, meetings.deleteData);
router.post("/deleteMany", auth, meetings.deleteMany);

module.exports = router;
