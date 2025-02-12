const express = require("express")

require("dotenv").config()
const { connection } = require("./configs/db")
const{userRouter}=require("./routes/user.routes")
const {authenticate}=require("./middleware/auth.middleware")
const{productRouter}=require("./routes/product.routes")
const{cartRouter}=require("./routes/cart.routes")
const{orderRouter}=require("./routes/order.routes")


const app = express()

app.use(express.json())

app.get("/", async (req, res) => {
    res.send("wellcome to Ecommerce backend")
    console.log("Wellcome Ecommerce backend app")
})

//user registration and login
app.use("/user",userRouter)

//product details
app.use("/product",productRouter)

//cart details
app.use("/cart",cartRouter)

//order details
app.use("/order",orderRouter)
//authentication
// app.use(authenticate)

app.get("/a", async (req, res) => {
    res.send("wellcome to Ecommerce backend")
    console.log(req.body.user)
})


app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("DataBase is connected")
    } catch (error) {
        console.log(error.message)
    }
    console.log(`server is running ${process.env.port}`)
})