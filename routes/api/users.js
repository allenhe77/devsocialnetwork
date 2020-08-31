const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

//init middleware

// @route POST api/user
//@desc user register
// @access public
router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "please include valid email").isEmail(),
    check("password", "password with 6 or more characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //check if user exists
      let user = await User.findOne({ email });
      //if user exist, send error msg
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "user already exists" }] });
      }

      //get users gravatr
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //return json web token

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
