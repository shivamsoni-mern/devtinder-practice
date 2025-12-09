const express = require("express");
const { validateprofileudate } = require("../utils/validatefunction");
const profilerouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");

profilerouter.get("/profile/view", async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send({
      message: "user details",
      user: user,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      name: error.name,
    });
  }
});

profilerouter.patch("/profile/edit", async (req, res) => {
  try {
    if (!validateprofileudate(req)) {
      throw new Error(" invalid request");
    }

    const logedinuser = req.user;
    Object.keys(req.body).forEach((key) => (logedinuser[key] = req.body[key]));
    await logedinuser.save();
    res.status(200).send({
      message: "profile updated successfully",
      user: logedinuser,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      name: error.name,
    });
  }
});

profilerouter.patch("/profile/password", async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;
    if (!oldpassword || !newpassword) {
      throw new Error("please enter proper credentials");
    }

    const user = req.user;

    const compare = await bcrypt.compare(oldpassword, user.password);
    if (!compare) {
      throw new Error("invalid credentials");
    }

    if (!validator.isStrongPassword(newpassword)) {
      throw new Error("please enter strong password");
    }

    const hashedpassword = await bcrypt.hash(newpassword, 10);

    user.password = hashedpassword;
    await user.save();
    res.status(200).send({
      message: "password updated successfully",
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      name: error.name,
    });
  }
});

module.exports = { profilerouter };









/** 
 
const userschema = new mongoose.Schema({
    // ... baaki purane fields (firstname, email, etc.)
    password: {
        type: String,
        required: true
    },
    // Naya field add karein 👇
    previousPasswords: {
        type: [String], // Array of Strings
        default: []
    }
}, { timestamps: true });


 profilerouter.patch("/profile/password", authtokenvalidate, async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;
    const user = req.user;

    // 1. Basic Validation
    if (!oldpassword || !newpassword) {
      throw new Error("Please enter proper credentials");
    }

    if (oldpassword === newpassword) {
      throw new Error("New password cannot be same as the current password");
    }

    // 2. Verify Old Password (Current wala sahi hai ya nahi)
    const isMatch = await bcrypt.compare(oldpassword, user.password);
    if (!isMatch) {
      throw new Error("Invalid old password");
    }

    if (!validator.isStrongPassword(newpassword)) {
      throw new Error("Please enter a strong password");
    }

    // --- 🔥 NEW FEATURE: HISTORY CHECK START ---
    
    // Logic: Loop through previousPasswords array
    // Agar user ne 5 baar password change kiya hai, toh paancho se compare karega
    for (let prevHash of user.previousPasswords) {
        const isUsedBefore = await bcrypt.compare(newpassword, prevHash);
        if (isUsedBefore) {
            throw new Error("You have used this password recently. Please choose a different one.");
        }
    }

    // Ab current password ko history mein daal do (Backup ke liye)
    user.previousPasswords.push(user.password);

    // OPTIONAL: Limit rakhein (e.g., last 5 passwords hi yaad rakhe)
    // Agar 5 se zyada ho gaye, toh sabse purana delete kar do
    if (user.previousPasswords.length > 5) {
        user.previousPasswords.shift(); // Remove first element
    }
    
    // --- HISTORY CHECK END ---


    // 3. Hash New Password and Save
    const hashedpassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedpassword;
    
    await user.save();

    res.status(200).send({
      message: "Password updated successfully",
    });

  } catch (error) {
    res.status(400).send({
      message: error.message,
      name: error.name,
    });
  }
});
 */