const mongoose = require("mongoose")

const OrderBookingSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        autopopulate: { maxDepth: 1 }
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        autopopulate: { maxDepth: 1 }
    },
    orderStart: Date,
    orderEnd: Date

}, { timestamps: true })

OrderBookingSchema.plugin(require("mongoose-autopopulate"))

module.exports = mongoose.model("OrderBooking", OrderBookingSchema)
