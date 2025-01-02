const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Menü adı
    description: { type: String }, // Menü açıklaması (isteğe bağlı)
    categories: [{
        name: { type: String, required: true }, // Kategori adı (Örneğin: "Ana Yemekler", "İçecekler", "Tatlılar" gibi)
        items: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }] // Kategoriye ait ürünlerin referansları
    }],
    price: { type: Number, required: true }, // Menü fiyatı
    image: { type: String, required: true }, // Menü resmi
    active: { type: Boolean, default: true }, // Menü aktif mi?
    currency: { type: String, required: true, default: 'USD' }, // Fiyatın para birimi
    discount: {
        percentage: { type: Number, default: 0 }, // İndirim yüzdesi
        amount: { type: Number, default: 0 }, // İndirim miktarı
        validUntil: { type: Date } // İndirim geçerlilik tarihi
    },
    tags: [{ type: String }], // Menü etiketleri
    availability: {
        days: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }], // Menü için geçerli günler
        hours: {
            start: { type: String }, // Başlangıç saati
            end: { type: String } // Bitiş saati
        }
    },
    ratings: {
        average: { type: Number, default: 0 }, // Ortalama kullanıcı puanı
        count: { type: Number, default: 0 } // Değerlendirme sayısı
    },
    nutrition: {
        calories: { type: Number }, // Kalori miktarı
        protein: { type: Number }, // Protein miktarı
        fat: { type: Number }, // Yağ miktarı
        carbohydrates: { type: Number } // Karbonhidrat miktarı
    },
    ingredients: [{ type: String }], // Menünün içerikleri
    isFeatured: { type: Boolean, default: false } // Menü öne çıkan mı?
}, { timestamps: true });

MenuSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Menu', MenuSchema);
