const express = require("express")
const userRoutes = require("./routes/users")
const employeeRoutes = require("./routes/employees")
const mongoose = require("mongoose")

const app = express()

const SERVER_PORT = process.env.SERVER_PORT || 3001
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || "mongodb+srv://admin:!password123@cluster0.kv0ijv9.mongodb.net/comp3123_assignment1?retryWrites=true&w=majority&appName=Cluster0"

app.use(express.json())
app.use(express.urlencoded())


app.use("/api/v1", userRoutes)
app.use("/api/v1", employeeRoutes)
app.use(express.urlencoded({extended: true}))

app.route("/")
    .get((req, res) => {
        res.send("<h1>MogoDB + Mongoose Example</h1>")
    })

mongoose.connect(DB_CONNECTION_STRING).then(() =>{
    console.log("Connected to MongoDB");
    app.listen(SERVER_PORT, () =>{
        console.log(`Server running at http://localhost:${SERVER_PORT}/`)
    })
}).catch((err) => {
    console.log("Error connecting to MongoDB: ", err.message)
})


