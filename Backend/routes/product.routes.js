const express=require("express")
const {ProductModel}=require("../models/product.model")

const productRouter=express.Router()

//get the all category

productRouter.get("/category",async(req,res)=>{
    try {
        let product=await ProductModel.distinct('category');
        res.status(200).send(product)
    } catch (error) {
        res.send({"error":error.message})
    }
})

// add product data 

productRouter.post('/', async (req, res) => {
    try {
        const { title, image, price, category,availablity,description } = req.body;

        // Create a new product
        const newProduct = new ProductModel({
            title,
            image,
            price,
            category,
            availablity,
            description
        });

        // Save the product to the database
        await newProduct.save();
        res.status(201).send({"msg":"product data added successfully"})
    } catch (error) {
        res.status(400).send({"error":error.message})
    }
});



//get the all products

productRouter.get("/", async (req, res) => {
    try {
        const filter = req.query || {}; // Allows filtering via query params
        const products = await ProductModel.find(filter);

        if (!products.length) {
            return res.status(404).json({ "msg": "No products found" });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ "msg": "Internal Server Error", "error": error.message });
    }
});


//get product by theire id

productRouter.get("/:id",async(req,res)=>{
    try {
        let product=await ProductModel.findById(req.params.id);
        res.status(200).send(product)
    } catch (error) {
        res.status(400).send({"error":error.message})
    }
})

module.exports={productRouter}