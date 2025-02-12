const express = require("express")
const { authenticate } = require("../middleware/auth.middleware")
const { CartModel } = require("../models/cart.model")
const { ProductModel } = require("../models/product.model")
const cartRouter = express.Router()

// Add a product to the cart

cartRouter.post("/", authenticate, async (req, res) => {
    try {
        const user = req.body.user;
        const productId = req.body.productid;
        const { quantity } = req.body;

        if(!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        if(!quantity) {
            return res.status(400).json({ message: 'Quantity is required' });
        }   
        // Fetch product details from ProductModel
        const product = await ProductModel.findById(productId);
        
        // Check if product exists and is available
        if (!product || !product.availablity) {
            return res.status(404).json({ message: 'Product is not available' });
        }

        let cart = await CartModel.findOne({ user: user });

        if (!cart) {
            // If no cart exists, create a new one
            cart = new CartModel({
                user: user,
                products: [{ product: productId, quantity: quantity }]
            });
            await cart.save();
            return res.status(201).json({ message: 'Product added to cart successfully' });
        } else {
            // Check if the product is already in the cart
            const productIndex = cart.products.findIndex(
                (item) => item.product.toString() === productId
            );

            if (productIndex !== -1) {
                return res.status(200).json({ message: 'Product is already in cart' });
            } else {
                cart.products.push({ product: productId, quantity: quantity });
                await cart.save();
                return res.status(201).json({ message: 'Product added to cart successfully' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error while adding product to the cart" });
    }
});


// Get all products in the cart
cartRouter.get("/", authenticate, async (req, res) => {
    try {
        const userId = req.body.user;
        const cart = await CartModel.findOne({ user: userId }).populate("products.product");

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }
        if (cart.products.length === 0) {
            return res.status(200).json({ message: "Cart is empty", products: [] });
        }
        res.status(200).json({ message: "Cart retrieved successfully", products: cart.products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove all products from the cart
cartRouter.delete("/", authenticate, async (req, res) => {
    try {
        const userId = req.body.user;
        const cart = await CartModel.findOneAndDelete({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
        }

        res.status(204).json({ message: 'Cart data removed successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove a product from the cart
cartRouter.delete("/:itemId", authenticate, async (req, res) => {
    try {
        const userId = req.body.user; // Extract user ID from authenticated request
        const itemId = req.body.itemid; // Extract item ID from URL params

        // Find user's cart
        const cart = await CartModel.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found for this user" });
        }

        // Find the index of the item in the cart's 'products' array
        const itemIndex = cart.products.findIndex((item) => item._id.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in the cart" });
        }

        // Remove the item from the 'products' array
        cart.products.splice(itemIndex, 1);

        // If the cart is now empty, remove the cart itself (optional)
        if (cart.products.length === 0) {
            await CartModel.findOneAndDelete({ user: userId });
            return res.status(204).send(); // 204 No Content (successful deletion)
        }

        await cart.save();

        return res.status(200).json({ message: "Item removed from the cart successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = { cartRouter }
