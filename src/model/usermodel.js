const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userschema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 35,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("please write proper email");
        }
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      lowercase: true,
      validate(value) {
        if (
          ![
            "male",
            "Male",
            "MALE",
            "FEMALE",
            "Female",
            "female",
            "other",
            "Other",
            "OTHER",
          ].includes(value)
        ) {
          throw new Error("gender is not valid");
        }
      },
    },

    about: {
      type: String,
      default: "my bio",
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userschema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "THISISTHESECRETKEY123", {
    expiresIn: "7d",
  });
  return token;
};

module.exports = mongoose.model("User", userschema);
