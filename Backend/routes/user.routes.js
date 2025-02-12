const express = require("express")
const { UserModel } = require("../models/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userRouter = express.Router()


userRouter.post("/register", async (req, res) => {
    const { fullname, email, password } = req.body
    try {
        if (!fullname ) {
            res.status(400).send({ "msg": "Please enter fullname" })
        }   
        if (!email) {
            res.status(400).send({ "msg": "Please enter email" })
        }
        if (!password) {
            res.status(400).send({ "msg": "Please enter password" })
        }
        const user = await UserModel.find({ email })
        console.log(user)
        if (user.length > 0) {
            res.status(409).send({ "msg": "user already exist" })
        }if(password.length<8){
            res.status(400).send({ "msg": "Password must be at least 8 characters long" })
        } else {
            bcrypt.hash(password, 5, async function (err, hash) {
                if (err) {
                    res.send({ "msg": "Something went wrong" })
                } else {
                    const user = new UserModel({ fullname, email, password: hash })
                    await user.save()
                    res.status(201).send({ "msg": "new User has been register" })
                }
            })
        }
    } catch (error) {
        res.status(500).send({ "msg": "Something went wrong", "error": error.message })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        if (!email) {
            res.status(400).send({ "msg": "Please enter email" })
        }
        if (!password) {
            res.status(400).send({ "msg": "Please enter password" })
        }
        const user = await UserModel.find({ email })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, function (err, result) {
                if (result) {
                    let token = jwt.sign({ userID: user[0]._id }, "masai", { expiresIn: "1h" })
                    res.status(200).send({ "msg": "Sucessfully Login ", "token": token, "user": user[0]._id })
                }else{
                    res.status(401).send({ "msg": "Wrong Password" })
                }
            })
        } else {
            res.status(404).send({ "msg": "User not found" })
        }
    } catch (error) {
        res.status(500).send({ "msg": "Something Went wrong", "error": error.message })
    }
})

module.exports = { userRouter }