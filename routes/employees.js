const express = require("express")
const routes = express.Router()


const EmployeeModel = require("../models/employees")
const mongoose = require("mongoose")



//Get All Employees
routes.get("/", (req, res) => {
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
routes.post("/", async (req, res) => {
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
routes.get("/:employeeid", async (req, res) => {
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

//Update existing Employee By Id
routes.put("/:employeeid", async (req, res) => {
    const employeeId = req.params.employeeid
    const updateData = req.body

    try {
        if(!mongoose.Types.ObjectId.isValid(employeeId)){
            return res.status(400).json({
                status: false,
                message: "Invalid Employee ID"
            })
        }

         //logic to update employee by id
        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(employeeId, updateData, {new: true})
        if(!updatedEmployee) {
            return res.status(404).json({
                status: false,
                message: `Employee not found for id: ${employeeId}`
            })
        }

        res.status(200).json({
            status: true,
            message: `Employee updated successfully for id: ${employeeId}`,
            data: updatedEmployee,
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
})

//Update employees department
routes.patch("/:employeeid", async (req, res) => {
    const employeeId = req.params.employeeid
    const {department} = req.body

    try {
        if(!mongoose.Types.ObjectId.isValid(employeeId)){
            return res.status(400).json({
                status: false,
                message: "Invalid Employee ID"
            })
        }
        if (!department || typeof department !== "string" || !department.trim()) {
            return res.status(400).json({ status: false, message: "Department is required" });
        }


        //logic to update employee's department
        const update = { $set: { department: department.trim() } }; 
        const updated = await EmployeeModel.findByIdAndUpdate(
            employeeId,
            update,
            { new: true, runValidators: true, context: "query" }
        );

        if(!updated) {
            return res.status(404).json({
                status: false,
                message: `Employee not found for id: ${employeeId}`
            })
        }

        res.status(200).json({
            status: true,
            message: `Department updated successfully for id: ${employeeId}`,
            data: updatedEmployee,
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
})

//Delete Employee By ID
routes.delete("/:employeeid", async (req, res) => {
    const employeeId = req.params.employeeid

    try {
        if(!mongoose.Types.ObjectId.isValid(employeeId)){
            return res.status(400).json({
                status: false,
                message: "Invalid Employee ID"
            })
        }
        
         //logic to delete book by id
         const deletedEmployee = await EmployeeModel.findByIdAndDelete(employeeId)
         if(!deletedEmployee) {
             return res.status(404).json({
                 status: false,
                 message: `Employee not found for id: ${employeeId}`
             })
         }

        res.status(204).json({
            status: true,
            message: `Employee deleted successfully for id: ${employeeId}`,
            data: deletedEmployee,
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
})


module.exports = routes