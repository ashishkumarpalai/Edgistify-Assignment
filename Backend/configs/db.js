require("dotenv").config()

const mongoose = require("mongoose")

const connection = mongoose.connect(process.env.mongourl)

module.exports = { connection }


// const mongoose = require("mongoose");
// require("dotenv").config();

// const connectDB =async()=>{
//     try {
//         await mongoose.connect(process.env.mongoURI);
//         console.log("connected with DB")
//     } catch (err) {
//         console.log(err.message)
//         console.log("error in DB connection")
//     }
// }


// module.exports = connectDB 