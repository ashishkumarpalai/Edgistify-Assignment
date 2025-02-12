const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const { CartModel } = require("../models/cart.model");
const { OrderModel } = require("../models/order.model");
const { ProductModel } = require("../models/product.model");

const orderRouter = express.Router();

// Place an order from the user's cart

orderRouter.post("/", authenticate, async (req, res) => {
    try {
        const { user, shippingAddress } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({ message: "Shipping address is required" });
        }

        // Find the user's cart and populate product details
        const cart = await CartModel.findOne({ user }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.status(404).json({ message: "Cart is empty or not found" });
        }

        // Check product availability
        for (let item of cart.products) {
            const product = await ProductModel.findById(item.product._id);

            if (!product || !product.availablity) {
                return res.status(400).json({ message: `Product "${product?.title || "unknown"}" is unavailable` });
            }
        }

        // Calculate total amount
        const totalAmount = cart.products.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);

        // Create a new order
        const order = new OrderModel({
            user,
            products: cart.products.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price,
            })),
            totalAmount,
            shippingAddress,
            paymentStatus: "Pending",
            orderStatus: "Pending",
        });

        await order.save();

        // Clear the user's cart
        await CartModel.findOneAndDelete({ user });

        res.status(201).json({ message: "Order placed successfully", orderId: order._id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Fetch order history for authenticated users
orderRouter.get("/", authenticate, async (req, res) => {
    try {
        const userId = req.body.user;
        const orders = await OrderModel.find({ user: userId }).populate("products.product");

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Fetch details of a specific order by its ID
orderRouter.get("/:orderId", authenticate, async (req, res) => {
    try {
        const userId = req.body.user;
        const orderId = req.params.orderId;
        const order = await OrderModel.findOne({ _id: orderId, user: userId }).populate("products.product");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = { orderRouter };
