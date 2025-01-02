const BaseService = require("./base-service");
const Menu = require("../models/menu");

class MenuService extends BaseService {
    // Menüye yeni bir kategori ekler
    async addCategory(menuId, categoryName) {
        try {
            const menu = await this.find(menuId);
            if (!menu) throw new Error('Menu not found');

            menu.categories.push({ name: categoryName, items: [] });
            await menu.save();

            return menu;
        } catch (error) {
            throw new Error(`Error adding category to menu: ${error.message}`);
        }
    }

    // Menüdeki bir kategoriye ürün ekler
    async addItemToCategory(menuId, categoryName, itemId) {
        try {
            const menu = await this.find(menuId);
            if (!menu) throw new Error('Menu not found');

            const category = menu.categories.find(cat => cat.name === categoryName);
            if (!category) throw new Error('Category not found in menu');

            category.items.push(itemId);
            await menu.save();

            return menu;
        } catch (error) {
            throw new Error(`Error adding item to category: ${error.message}`);
        }
    }

    // Menüden bir kategori siler
    async removeCategory(menuId, categoryName) {
        try {
            const menu = await this.find(menuId);
            if (!menu) throw new Error('Menu not found');

            menu.categories = menu.categories.filter(cat => cat.name !== categoryName);
            await menu.save();

            return menu;
        } catch (error) {
            throw new Error(`Error removing category from menu: ${error.message}`);
        }
    }

    // Menüdeki bir kategoriden ürün siler
    async removeItemFromCategory(menuId, categoryName, itemId) {
        try {
            const menu = await this.find(menuId);
            if (!menu) throw new Error('Menu not found');

            const category = menu.categories.find(cat => cat.name === categoryName);
            if (!category) throw new Error('Category not found in menu');

            category.items = category.items.filter(item => item.toString() !== itemId);
            await menu.save();

            return menu;
        } catch (error) {
            throw new Error(`Error removing item from category: ${error.message}`);
        }
    }

    // Menüdeki tüm aktif ürünleri getirir
    async getActiveMenuItems(menuId) {
        try {
            const menu = await this.find(menuId).populate({
                path: 'categories.items',
                match: { active: true }
            });

            if (!menu) throw new Error('Menu not found');

            return menu.categories.reduce((activeItems, category) => {
                return activeItems.concat(category.items);
            }, []);
        } catch (error) {
            throw new Error(`Error getting active items from menu: ${error.message}`);
        }
    }

    // Menülerin listesi ve belirli bir sayfadaki menülerin alınması
    async listMenus(page = 1, limit = 10) {
        return await this.load(page, limit);
    }

    // Menü aktif/pasif durumunu değiştirir
    async toggleMenuStatus(menuId) {
        try {
            const menu = await this.find(menuId);
            if (!menu) throw new Error('Menu not found');

            menu.active = !menu.active;
            await menu.save();

            return menu;
        } catch (error) {
            throw new Error(`Error toggling menu status: ${error.message}`);
        }
    }

    // Menüye özel ek işlevler eklemek için burada yeni metodlar oluşturabilirsiniz.
}

// 'Menu' modelini doğrudan constructor'a geçirerek daha kısa ve net bir yapı oluşturuyoruz.
module.exports = new MenuService(Menu);
