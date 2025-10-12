const mongoose = require("mongoose")
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({

        "username": {
            type: String,
            required: [true, "Username is required"],
            unique: [true, "Username is already in use"],
            trim: true,
            maxlength: 30
        },
        "email": {
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
        password: {
          type: String,
          required: [true, "Password is required"],
          minlength: [6, "Password must be at least 6 characters long"],
          trim: true,
          select: false // exclude password by default when fetching user
        }      // must be hashed
    },
    {timestamps: true}
)

// Hash password before saving
userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema)