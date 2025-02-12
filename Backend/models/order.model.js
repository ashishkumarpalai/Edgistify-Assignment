const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true }, // Ensure total price is stored
  shippingAddress: { type: String, required: true }, // New required field
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered"],
    default: "Pending",
  },
  orderDate: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model("order", orderSchema);

module.exports = { OrderModel };


// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
//   products: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
//       quantity: Number,
//       price: Number,
//     },
//   ],
// //   totalAmount: Number,
//   orderDate: { type: Date, default: Date.now },
// });

// const OrderModel = mongoose.model("OrderModel", orderSchema);

// module.exports = { OrderModel };
