const express = require("express")
const routes = express.Router()
const jwt = require("jsonwebtoken");


const UserModel = require("../models/users")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")



//Get All Users
routes.get("/", (req, res) => {
    UserModel.find({})
        .then((users)=>{
            res.json({
                status: true,
                message: "Users fetched successfully",
                count: users.length,
                data: users
            })
        }).catch((err) => {
            res.status(500).json({
                status: false,
                message: err.message
            })
        })
})

//Add NEW User
routes.post("/", async (req, res) => {
    const newUserData = req.body
    try{
        const newUserModel = new UserModel(newUserData)
        const newUser = await newUserModel.save()
        res.status(201).json({
            status: true,
            message: "User registered successfully",
            data: newUser
        })
    }catch (error){
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
})

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    }
  );
}

// User Login
routes.post("/login", async (req, res) => {
  const { login, password } = req.body;

  try {
    if (!login || !password) {
      return res.status(400).json({
        status: false,
        message: "Email or username, and password are required"
      });
    }

    const looksLikeEmail = login.includes("@");
    const query = looksLikeEmail
      ? { email: login.toLowerCase().trim() }
      : { username: login.trim() };

    const user = await UserModel.findOne(query).select("+password");
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "No user with this username or email"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid password"
      });
    }

    const { password: _, __v, ...userData } = user.toObject();


    //Creating Token
    const token = generateToken(user);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "none",
        maxAge: 60 * 60 * 1000, // 1 hour
      })
      .status(200)
      .json({
        status: true,
        message: "Login successful",
        user: userData,
        token
      });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
});


module.exports = routes