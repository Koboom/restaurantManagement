const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
        autopopulate: true
    }, // Yorum yapan müşteri
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    }, // Yorum yapılan ürün
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }, // Puanlama
    comment: {
        type: String,
        required: true,
        maxlength: 500
    }, // Yorum
    date: {
        type: Date,
        default: Date.now
    } // Yorum tarihi
}, { timestamps: true });

ReviewSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Review', ReviewSchema);
