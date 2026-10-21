
const mongoose = require("mongoose");
const crypto = require("crypto");

const orderSchema = new mongoose.Schema(
    {
        // Unique public order ID, separate from MongoDB _id
        orderId: {
            type: String,
            required: true,
            unique: true,
            default: () =>
                `SP-${Date.now()}-${crypto
                    .randomBytes(4)
                    .toString("hex")
                    .toUpperCase()}`,
        },

        // Customer who placed the order
        user: {
            type: String,
            required: true,
        },

        // Store receiving the order


        // Products purchased
        items: [
            {
                product: {
                    type: String,
                    required: true,
                },

                name: {
                    type: String,
                    required: true,
                },

                image: {
                    type: String,
                    default: "",
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },

                unitPrice: {
                    type: Number,
                    required: true,
                    min: 0,
                },

                deliveryFee: {
                    type: Number,
                    default: 0,
                    min: 0,
                },
                store: {
                    type: String,
                    required: true,
                },
                status: {
                    type: String,
                    enum:["approved","pending","delivered", "completed", "rejected","shipped"],
                    default:"pending"
                }
            },
        ],

        // Customer contact information
        customer: {
            name: {
                type: String,
                required: true,
            },

            email: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },
        },

        // Delivery information
        shippingAddress: {
            address: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            state: {
                type: String,
                required: true,
            },

            country: {
                type: String,
                default: "Nigeria",
            },
        },

        deliveryMethod: {
            type: String,
            default: "standard",
        },

        // Order calculations
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },

        deliveryFee: {
            type: Number,
            required: true,
            min: 0,
        },

        processingFee: {
            type: Number,
            required: true,
            min: 0,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
        },

        total: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: "NGN",
        },

        // Paystack payment details
        paymentMethod: {
            type: String,
            enum: ["paystack"],
            default: "paystack",
        },

        paymentReference: {
            type: String,
            unique: true,
            sparse: true,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },

        // Order fulfilment status
        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },

        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
