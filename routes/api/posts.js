const express = require("express");

const router = express.Router();

// @route GET api/post
//@desc post route
// @access public
router.get("/", (req, res) => {
  res.send("post routes");
});

module.exports = router;
