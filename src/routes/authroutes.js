const express = require("express");
const { validatesignup } = require("../utils/validatefunction");
const User = require("../model/usermodel");
const authrouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authrouter.post("/signup", async (req, res) => {
  try {
    validatesignup(req);
    if (!validatesignup) {
      throw new Error(" user detail is not correct");
    }
    const { firstname, lastname, password, email, gender, age, about } =
      req.body;
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstname,
      lastname,
      password: hashedpassword,
      email,
      gender,
      age,
      about,
    });

    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({
      message: error.message,
      name: error.name,
    });
  }
});

authrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("please enter valid credentials");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("user does not exist");
    }

    const comparehash = await bcrypt.compare(password, user.password);
    if (!comparehash) {
      throw new Error("invalid credentails");
    }

    const token = await user.getJWT();
    res.cookie("token", token);
    res.status(200).send({
      message: "login succesful",
      user: user,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      name: error.name,
    });
  }
});

authrouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("user logout successfully");
});

module.exports = { authrouter };
