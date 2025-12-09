const express = require("express");
// This is a test comment for git practice
const feedroute = express.Router();
const User = require("../model/usermodel");

feedroute.get("/user", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      throw new Error("something went wrong");
    }

    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({
      message: error.message,
      name: error.name,
    });
  }
});

module.exports = { feedroute };
