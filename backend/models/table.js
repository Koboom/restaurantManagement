const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
    number: { type: Number, required: true }, // Masa numarası
    capacity: { type: Number, required: true }, // Masa kapasitesi
    status: { type: String, enum: ['Available', 'Occupied', 'Reserved', 'Cleaning'] }, // Masa durumu
    isVIP: { type: Boolean, default: false }, // VIP Masa
    specialRequests: [{ type: String }], // Özel İstekler (opsiyonel)
    location: { type: String, enum: ['Indoor', 'Outdoor', 'Other'] }, // Masa konumu (opsiyonel)
    isSmokingAllowed: { type: Boolean, default: false },
    reservedUntil: { type: Date }, // Masa rezerve edilme süresi
    lastCleaningDate: { type: Date }, // Son temizlenme tarihi
    waiter: { type: mongoose.Schema.Types.ObjectId, ref: 'Waiter' }, // Masa ile ilişkili garson
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Masa ile ilişkili siparişler
    notes: { type: String }, // Notlar (opsiyonel)
    rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

TableSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Table', TableSchema);
