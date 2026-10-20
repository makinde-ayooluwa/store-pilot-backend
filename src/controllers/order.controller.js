
const Order = require("../models/order.model");
const Product = require("../models/product.model");

const createOrder = async (req, res) => {
    try {
        const {
            user,
            items,
            customer,
            shippingAddress,
            deliveryMethod,
        } = req.body;

        // Basic validation
        if (
            !user ||
            !Array.isArray(items) ||
            items.length === 0 ||
            !customer ||
            !shippingAddress
        ) {
            return res.status(400).json({
                status: false,
                message: "Missing required order information",
            });
        }

        let subtotal = 0;
        let grandtotal = 0;
        let fee = 0.02;
        let processingFee = 0;
        let deliveryFee = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    status: false,
                    message: `Product not found: ${item.product}`,
                });
            }

            // Ensure the product belongs to the selected store
            // if (product.store !== store) {
            //     return res.status(400).json({
            //         status: false,
            //         message: `${product.name} does not belong to this store`,
            //     });
            // }

            if (product.deliveryPricing.enabled && product.deliveryPricing.rules.length > 0) {
                product.deliveryPricing.rules.map(({ minQuantity, maxQuantity, price }) => {
                    if (item.quantity >= minQuantity && item.quantity <= maxQuantity) {
                        deliveryFee += price;
                    }
                })
            }
            // Check stock availability
            if (
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                product.stock < item.quantity
            ) {
                return res.status(400).json({
                    status: false,
                    message: `Insufficient stock for ${product.name}`,
                });
            }

            // Calculate using the database price, not the frontend price
            subtotal += product.price * item.quantity;
            processingFee += subtotal * fee;
            grandtotal += subtotal + deliveryFee + processingFee;
        }

        // Create the order in MongoDB
        const order = await Order.create({
            user,
            items,
            customer,
            shippingAddress,
            deliveryMethod,

            // Temporary placeholders.
            // We will calculate these securely from database
            // product and delivery data before production.
            subtotal,
            deliveryFee,
            processingFee,
            total: grandtotal,

            paymentStatus: "pending",
            status: "pending",
        });

        return res.status(201).json({
            status: true,
            message: "Order created successfully",
            order: {
                _id: order._id,
                orderId: order.orderId,
                paymentStatus: order.paymentStatus,
                total: order.total,
                email: order.customer.email
            },
        });
    } catch (error) {
        console.error("Create order error:", error.message);

        return res.status(500).json({
            status: false,
            message: "Failed to create order",
        });
    }
};
const getOrders = async(req, res)=>{
    try {
        const {user} = req.body;
        const orders = await Order.find({user});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error)
    }
}
module.exports = { createOrder, getOrders };
