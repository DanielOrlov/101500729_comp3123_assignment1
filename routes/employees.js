const express = require("express")
const routes = express.Router()
const mongoose = require("mongoose")
const multer = require("multer");
const EmployeeModel = require("../models/employees")
const auth = require("../middleware/auth");





// Storing the avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads/avatars"); // local folder at backend root
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });



//Get All Employees
routes.get("/", auth(), (req, res) => {
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
routes.post("/", auth(), async (req, res) => {
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

// GET /api/v1/employees/search
routes.get('/search', auth(), async (req, res) => {
  try {
    const {
      q,
      department,
      position,
    //   email,
      page = 1,
      limit = 20,
      sort = 'last_name'
    } = req.query;

    const filters = {};

    // department filter (exact)
    if (department) {
      filters.department = department.trim().toLowerCase();
    }

    // position filter (exact)
    if (position) {
      filters.position = position.trim().toLowerCase();
    }

    // email filter (exact if provided)
    // if (email) {
    //   filters.email = email.trim().toLowerCase();
    // }

    // free-text across name/email/department (case-insensitive)
    if (q && q.trim()) {
      const rx = new RegExp(q.trim(), 'i');
      filters.$or = [
        // { first_name: rx },
        // { last_name: rx },
        // { email: rx },
        { department: rx },
        { position: rx}
      ];
    }

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100);

    const [data, total] = await Promise.all([
      EmployeeModel
        .find(filters)
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      EmployeeModel.countDocuments(filters)
    ]);

    res.json({
      status: true,
      message: 'Employees fetched',
      count: data.length,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
      data
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

//Get Employee By ID
routes.get("/:employeeid", auth(), async (req, res) => {
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
routes.put("/:employeeid", auth(), async (req, res) => {
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
routes.patch("/:employeeid", auth(), async (req, res) => {
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
            data: updated,
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
})

//Delete Employee By ID
routes.delete("/:employeeid", auth(), async (req, res) => {
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

// POST /api/v1/employees/:id/avatar
routes.post("/:employeeid/avatar", upload.single("avatar"), async (req, res) => {
  try {
    const employeeId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ status: false, message: "No file uploaded" });
    }

    // File path as it will be accessible from the frontend
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const employee = await EmployeeModel.findByIdAndUpdate(
      employeeId,
      { avatarUrl },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ status: false, message: "Employee not found" });
    }

    res.json({
      status: true,
      message: "Avatar uploaded",
      employee,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Server error" });
  }
});



module.exports = routes