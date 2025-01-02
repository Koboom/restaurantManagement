const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
        autopopulate: true
    }, // Ödemesi yapılan müşteri
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        autopopulate: true
    }, // Ödemesi yapılan sipariş (opsiyonel)
    amount: {
        type: Number,
        required: true,
        min: 0
    }, // Ödeme tutarı
    paymentDate: {
        type: Date,
        required: true,
        default: Date.now
    }, // Ödeme tarihi
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'Cash', 'Mobile Payment', 'Bank Transfer'],
        required: true
    }, // Ödeme yöntemi
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    }, // Ödeme durumu
    referenceNumber: {
        type: String,
        unique: true
    }, // Ödeme referans numarası
    note: {
        type: String
    } // Ödeme ile ilgili notlar
}, { timestamps: true });

PaymentSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Payment', PaymentSchema);
