const jwt = require("jsonwebtoken");
const User = require("../model/usermodel");
const authtokenvalidate = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("unauthorized access");
    }
    const decoded = await jwt.verify(token, "THISISTHESECRETKEY123");
    const { _id } = decoded;
    const user = await User.findById({ _id: _id });
    if (!user) {
      throw new Error("invalid user");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send({
      message: error.message,
      name: error.name,
    });
  }
};

module.exports = authtokenvalidate;
