const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRETKEY = "ABHAYPATELISAGOODANDHONESTBOY";
const fetchuser = require("../middleware/fetchuser");

//ROUTE 1 : creating a user using: POST "api/auth/createuser"
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter long password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      // if error accure than return error or bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: "More character need in name or password!" });
      }

      // if user already exist
      let user = await User.findOne({
        email: req.body.email,
      });
      if (user) {
        return res.status(400).json({
          error: "user already exist with this email",
        });
      }

      //hasing the password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // now create new document in collection
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "some error accured!" });
    }
  }
);

//ROUTE 2 : authenticate a user using: POST "api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be a blank").exists(),
  ],
  async (req, res) => {
    let success = false;

    //if email validator error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success, error: errors.array() });
    }

    //if email,password validate
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });

      //if user not exist on this emial
      if (!user) {
        return res.status(400).json({
          success,
          error: "Please try to login with currect credentials",
        });
      }

      //if user is exist on this email
      //now compare the password
      const cmpPass = await bcrypt.compare(password, user.password);
      if (!cmpPass) {
        return res.status(400).json({
          success,
          error: "Please try to login with currect credentials",
        });
      }

      //if email password is matched
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRETKEY);
      success = true;
      res.status(200).json({ success, authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ error: "some internal server error accured!" });
    }
  }
);

// ROUTE 3 : get user details path : "api/auth/getuser"
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.status(200).send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "some internal server error accured!" });
  }
});

module.exports = router;
