const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
        autopopulate: true
    }, // Rezervasyonu yapan müşteri
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true,
        autopopulate: true
    }, // Rezerve edilen masa
    reservationStart: {
        type: Date,
        required: true
    }, // Rezervasyon başlangıç tarihi ve saati
    reservationEnd: {
        type: Date,
        required: true
    }, // Rezervasyon bitiş tarihi ve saati
    durationMinutes: {
        type: Number,
        required: true
    }, // Rezervasyon süresi (dakika cinsinden)
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending'
    }, // Rezervasyon durumu
    note: {
        type: String
    } // Rezervasyonla ilgili notlar
}, { timestamps: true });

ReservationSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Reservation', ReservationSchema);
