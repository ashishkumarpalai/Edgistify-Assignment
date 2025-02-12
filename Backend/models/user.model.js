const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        }

    }
)

const UserModel = mongoose.model("user", userSchema)

module.exports = { UserModel }