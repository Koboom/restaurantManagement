const { orderService } = require("../services");
const router = require("express").Router();

// GET /orders - Tüm siparişleri listele
router.get('/', async (req, res, next) => {
    try {
        const orders = await orderService.load();
        res.send(orders);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
