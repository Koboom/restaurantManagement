const { itemService, reviewService } = require("../services");
const router = require("express").Router();

// GET /items - Tüm öğeleri listele (filtreleme ve sıralama parametreleri eklenebilir)
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 100, sort = {} } = req.query; // Sayfalama ve sıralama parametreleri
        const items = await itemService.load(page, limit, sort);
        res.send(items);
    } catch (error) {
        next(error);
    }
});

// Belirli bir item ID'sine göre item'i güncelleme endpoint'i (PUT)
router.put('/itemId', async (req, res) => {
    const itemId = req.params.itemId;
    const updatedItemData = req.body;
    try {
        const result = await itemService.update(itemId, updatedItemData)
        res.send(result)
    } catch (error) {
        res.status(500).send(`Error updating item with ID ${itemId}: ${error.message}`);
    }
})
// POST /items - Yeni öğe oluştur
router.post('/', async (req, res ) => {
    try {
        const item = await itemService.insert(req.body);
        res.status(201).send(item);
    } catch (error) {
        res.status(500).send(error.message)
    }
});

// GET /items/:itemId - ID'ye göre öğe getir
router.get('/:itemId', async (req, res, next) => {
    try {
        const item = await itemService.find(req.params.itemId);
        if (!item) {
            return res.status(404).send("Item not found");
        }
        res.send(item);
    } catch (error) {
        next(error);
    }
});

// PATCH /items/:itemId - Öğe bilgilerini güncelle
router.patch('/:itemId', async (req, res, next) => {
    try {
        const { itemId} = req.params;
        const updatedData = req.body

        if(!updatedData.price) {
            return res.status(400).send("Price are req")
        }

        await itemService.update(itemId, updatedData)
        res.status(200).send("Item updated successfully")
    } catch (error) {
        next(error)
    }
});

// DELETE /items/:itemId - Öğeyi sil
router.delete('/:itemId', async (req, res, next) => {
    const itemId = req.params.itemId;
    try {
        const result = await itemService.removeBy('_id', itemId);
        res.send(result);
    } catch (error) {
        next(error);
    }
});

// GET /items/category/:category - Belirli bir kategoriye göre öğeleri getir
router.get('/category/:category', async (req, res, next) => {
    try {
        const items = await itemService.findItemsByCategory(req.params.category);
        res.send(items);
    } catch (error) {
        next(error);
    }
});

// GET /items/available - Stokta bulunan öğeleri getir
router.get('/available', async (req, res, next) => {
    try {
        const items = await itemService.findAvailableItems();
        res.send(items);
    } catch (error) {
        next(error);
    }
});

// GET /items/price - Fiyat aralığına göre öğeleri getir
router.get('/price', async (req, res, next) => {
    try {
        const { min, max } = req.query;
        const items = await itemService.query({
            price: { $gte: min, $lte: max }
        });
        res.send(items);
    } catch (error) {
        next(error);
    }
});

// GET /items/discount - İndirimdeki öğeleri getir
router.get('/discount', async (req, res, next) => {
    try {
        const items = await itemService.query({
            'discount.percentage': { $gt: 0 },
            'discount.validUntil': { $gte: new Date() }
        });
        res.send(items);
    } catch (error) {
        next(error);
    }
});

// POST /items/:itemId/reviews - Belirli bir öğeye yorum ekle
router.post('/:itemId/reviews', async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const review = await reviewService.insert({
            rating,
            comment,
            item: req.params.itemId
        });
        const item = await itemService.find(req.params.itemId);
        if (!item) {
            return res.status(404).send("Item not found");
        }
        item.reviews.push(review);
        await item.save();
        res.status(201).send(review);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
