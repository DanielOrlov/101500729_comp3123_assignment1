const express = require("express")
const routes = express.Router()


const userModel = require("../models/users")
const mongoose = require("mongoose")



//Get All Books
routes.get("/users", (req, res) => {
    userModel.find({})
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
routes.post("/users", async (req, res) => {
    const newUserData = req.body
    try{
        const newUserModel = new UserModel(newUserData)
        const newUser = await newUserModel.save()
        res.status(201).json({
            status: true,
            message: "User registered successfully",
            data: newBook
        })
    }catch (error){
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
})


module.exports = routes