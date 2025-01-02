const Item = require("../models/item");
const BaseService = require("./base-service");

class ItemService extends BaseService {
    // BaseService'deki findById metodunu kullanarak item'ı ID ile bul
    async findItemById(itemId) {
        return this.findById(itemId);
    }

    // Belirli bir kategorideki item'ları bul
    async findItemsByCategory(category) {
        try {
            const items = await this.model.find({ category });
            return items;
        } catch (error) {
            throw new Error(`Error finding items in category ${category}: ${error.message}`);
        }
    }

    // Stokta bulunan item'ları bul
    async findAvailableItems() {
        try {
            const items = await this.model.find({ inStock: true });
            return items;
        } catch (error) {
            throw new Error(`Error finding available items: ${error.message}`);
        }
    }
}

// 'Item' modelini doğrudan constructor'a geçirerek daha kısa ve net bir yapı oluşturuyoruz.
module.exports = new ItemService(Item);
