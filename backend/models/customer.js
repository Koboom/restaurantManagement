const mongoose = require('mongoose');
const validator = require('validator');

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email format'
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function(v) {
                return /\d{10,11}/.test(v); // 10 veya 11 haneli telefon numarası doğrulaması
            },
            message: props => `${props.value} is not a valid phone number! It should be 10 or 11 digits.`
        }
    },
    isVIP: {
        type: Boolean,
        default: false
    },
    specialRequests: {
        type: String,
        maxlength: [500, 'Special requests cannot exceed 500 characters']
    },
    orderBookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderBooking',
        autopopulate: { maxDepth: 2 }
    }],
    reservedTables: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        autopopulate: { maxDepth: 2 }
    }],
}, { timestamps: true });

CustomerSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Customer', CustomerSchema);
