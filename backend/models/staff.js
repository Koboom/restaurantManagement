const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, // Personelin adı
    role: {
        type: String,
        required: true
    }, // Personelin görevi veya pozisyonu (Örneğin: Chef, Manager, Cleaner vb.)
    age: {
        type: Number,
        required: true,
        min: 18
    }, // Personelin yaşı
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    }, // Personelin cinsiyeti
    contact: {
        phone: {
            type: String,
            validate: {
                validator: function(v) {
                    return /\d{10}/.test(v); // 10 haneli telefon numarası doğrulaması
                },
                message: props => `${props.value} geçerli bir telefon numarası değil!`
            }
        },
        email: {
            type: String,
            validate: {
                validator: function(v) {
                    return /\S+@\S+\.\S+/.test(v); // Geçerli email formatı doğrulaması
                },
                message: props => `${props.value} geçerli bir email adresi değil!`
            }
        }
    }, // Personelin iletişim bilgileri
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String }
    }, // Personelin adres bilgileri
    salary: {
        type: Number,
        required: true,
        min: 0
    }, // Personelin maaşı
    hiredDate: {
        type: Date,
        required: true,
        default: Date.now
    }, // Personelin işe giriş tarihi
    active: {
        type: Boolean,
        default: true
    }, // Personel aktif mi?
    notes: {
        type: String
    } // Ek notlar
}, { timestamps: true });

module.exports = mongoose.model('Staff', StaffSchema);
