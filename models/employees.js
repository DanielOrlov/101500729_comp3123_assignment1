const mongoose = require("mongoose")

const employeeSchema = new mongoose.Schema({

    first_name: {
        type: String,
        trim: true,
        maxlength: 30
    },
    last_name: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        maxlength: 30
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email is already in use"],
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
            "Please enter a valid email address"
        ]
    },
    position: {
        type: String,
        default: 'New hire',
        trim: true,
        maxlength: 100
    },
    department: {
        type: String,
        default: 'Not assigned',
        trim: true,
        maxlength: 100
    },
    salary: {
        type: Number,
        required: [true, "Salary is required"],
        min: [0, "Salary cannot be negative"]
    },
    date_of_joining: {
        type: Date,
        required: [true, "Date of joining is required"],
        default: Date.now, // defaults to now if not specified
        validate: {
            validator: function (value) {
                // joining date can't be in the future
                return value <= new Date();
            },
            message: "Date of joining cannot be in the future"
        }
    },
    avatarUrl: { 
        type: String, 
        default: "/uploads/avatars/default_av.jpg" }
},
    { timestamps: true }
)

module.exports = mongoose.model("Employee", employeeSchema)