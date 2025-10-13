const express = require("express")
const routes = express.Router()


const EmployeeModel = require("../models/employees")
const mongoose = require("mongoose")



//Get All Employees
routes.get("/employees", (req, res) => {
    EmployeeModel.find({})
        .then((employees)=>{
            res.json({
                status: true,
                message: "employees fetched successfully",
                count: employees.length,
                data: employees
            })
        }).catch((err) => {
            res.status(500).json({
                status: false,
                message: err.message
            })
        })
})

//Add NEW Employee
routes.post("/employees", async (req, res) => {
    const newEmployeeData = req.body
    try{
        const newEmployeeModel = new EmployeeModel(newEmployeeData)
        const newEmployee = await newEmployeeModel.save()
        res.status(201).json({
            status: true,
            message: "Employee added successfully",
            data: newEmployee
        })
    }catch (error){
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
})

//Get Employee By ID
routes.get("/employees/:employeeid", async (req, res) => {
    const employeeid = req.params.employeeid

    if(!mongoose.Types.ObjectId.isValid(employeeid)){
        return res.status(400).json({
            status: false,
            message: "Invalid Employee ID"
        })
    }
    
    //logic to get employee by id
    const employee = await EmployeeModel.findById(employeeid)

    if(!employee) {
        return res.status(404).json({
            status: false,
            message: `Employee not found for id: ${employeeid}`
        })
    }

    res.status(200).json({
        status: true,
        message: `Employee fetched successfully for id: ${employeeid}`,
        data: employee,
    })
   
})


module.exports = routes