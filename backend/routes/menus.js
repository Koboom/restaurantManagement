const express = require('express');
const router = express.Router();
const menuService = require('../services/menu-service');

// GET /menus - Tüm menüleri listele (sayfalama ve sıralama ile)
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = {} } = req.query;
        const menus = await menuService.listMenus(page, limit, sort);
        res.send(menus);
    } catch (error) {
        next(error);
    }
});

// GET /menus/featured - Öne çıkan menüleri listele
router.get('/featured', async (req, res, next) => {
    try {
        const featuredMenus = await menuService.getFeaturedMenus();
        res.send(featuredMenus);
    } catch (error) {
        next(error);
    }
});

// GET /menus/tag/:tag - Belirli bir etikete sahip menüleri listele
router.get('/tag/:tag', async (req, res, next) => {
    try {
        const { tag } = req.params;
        const menusByTag = await menuService.getMenusByTag(tag);
        res.send(menusByTag);
    } catch (error) {
        next(error);
    }
});

// GET /menus/nutritional - Belirli bir besin değeri aralığındaki menüleri listele
router.get('/nutritional', async (req, res, next) => {
    try {
        const { minCalories, maxCalories } = req.query;
        const menusByNutritionalValue = await menuService.getMenusByNutritionalValue(minCalories, maxCalories);
        res.send(menusByNutritionalValue);
    } catch (error) {
        next(error);
    }
});

// POST /menus - Yeni bir menü oluştur
router.post('/', async (req, res, next) => {
    try {
        const newMenu = req.body;
        const createdMenu = await menuService.insert(newMenu);
        res.status(201).send(createdMenu);
    } catch (error) {
        next(error);
    }
});

// PUT /menus/:id - Belirli bir menüyü güncelle
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedMenu = await menuService.update(id, updatedData);
        res.send(updatedMenu);
    } catch (error) {
        next(error);
    }
});

// DELETE /menus/:id - Belirli bir menüyü sil
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await menuService.removeBy('_id', id);
        res.send({ message: 'Menu deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// PATCH /menus/:id/price - Belirli bir menünün fiyatını güncelle
router.patch('/:id/price', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { price } = req.body;
        const updatedMenu = await menuService.updateMenuPrice(id, price);
        res.send(updatedMenu);
    } catch (error) {
        next(error);
    }
});

// PATCH /menus/:id/image - Belirli bir menünün resmini güncelle
router.patch('/:id/image', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { image } = req.body;
        const updatedMenu = await menuService.updateMenuImage(id, image);
        res.send(updatedMenu);
    } catch (error) {
        next(error);
    }
});

// PATCH /menus/:id/status - Belirli bir menünün aktif/pasif durumunu değiştir
router.patch('/:id/status', async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedMenu = await menuService.toggleMenuStatus(id);
        res.send(updatedMenu);
    } catch (error) {
        next(error);
    }
});

// POST /menus/:id/categories - Menünün bir kategorisine yeni ürün ekle
router.post('/:id/categories', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;
        const menuWithNewCategory = await menuService.addCategory(id, categoryName);
        res.send(menuWithNewCategory);
    } catch (error) {
        next(error);
    }
});

// POST /menus/:id/categories/:categoryName/items - Kategoriye yeni bir ürün ekle
router.post('/:id/categories/:categoryName/items', async (req, res, next) => {
    try {
        const { id, categoryName } = req.params;
        const { itemId } = req.body;
        const menuWithNewItem = await menuService.addItemToCategory(id, categoryName, itemId);
        res.send(menuWithNewItem);
    } catch (error) {
        next(error);
    }
});

// DELETE /menus/:id/categories/:categoryName - Menünün belirli bir kategorisini sil
router.delete('/:id/categories/:categoryName', async (req, res, next) => {
    try {
        const { id, categoryName } = req.params;
        const menuWithoutCategory = await menuService.removeCategory(id, categoryName);
        res.send(menuWithoutCategory);
    } catch (error) {
        next(error);
    }
});

// DELETE /menus/:id/categories/:categoryName/items/:itemId - Kategoriden belirli bir ürünü sil
router.delete('/:id/categories/:categoryName/items/:itemId', async (req, res, next) => {
    try {
        const { id, categoryName, itemId } = req.params;
        const menuWithoutItem = await menuService.removeItemFromCategory(id, categoryName, itemId);
        res.send(menuWithoutItem);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
