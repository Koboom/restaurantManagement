const mongoose = require('mongoose');

const WaiterSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2}, //Garsonun adı
    age: { type: Number, required: true, min: 18, max: 67}, //Garsonun yaşı
    experience: { type: Number, required: true, min: 0}, //Garsonun tecrübesi}
    available: { type: Boolean, default: true},//Garsonun şu an çalışabilir olup olmadığı
    section: { type: String, enum: ['Bar', 'Dining', 'Outdoor', 'Kitchen', 'Other'], required: true},
    workingHours: {
        start: { type: String},
        end: { type: String}
    }, //Garsonun çalışma saatleri}
    skills: [{type: String}], //Garsonun yetenekleri
    education: {
        degree: { type: String},
        school: { type: String}
    }, //Garsonun eğitimi
    certifications: [{ type: String }], //Garsonun sertifikası
    dailyReports: [{
        date: { type: Date, default: Date.now },
        content: { type: String }
    }], //Garsonun günlük raporları
    performance: {
        satisfactionScore: { type: Number, min: 0, max: 100 },
        orderSpeed: { type: String, enum: ['Slow', 'Average', 'Fast'] }
    }, //Garsonun performansı
    employmentStatus: { type: String, enum: ['Active', 'On Leave', 'Vacation', 'Sick'] }, // Garsonun çalışma durumu
    startDate: { type: Date },//Garsonun işe giriş tarihi
    tips: {
        totalTips: { type: Number, default: 0 },
        distributionMethod: { type: String, enum: ['Individual', 'Pooled'] }
    }, //Garsonun tipileri

}, { timestamps: true });

WaiterSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Waiter', WaiterSchema);
