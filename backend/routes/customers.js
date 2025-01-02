const { customerService } = require('../services');
const router = require("express").Router();

// GET /customers - Tüm müşterileri listele
router.get('/', async (req, res, next) => {
    try {
        const customers = await customerService.load();
        res.send(customers);
    } catch (error) {
        next(error);
    }
});

// POST /customers - Yeni müşteri oluştur
router.post('/', async (req, res, next) => {
    try {
        const customer = await customerService.insert(req.body);
        res.status(201).send(customer);
    } catch (error) {
        next(error);
    }
});

// GET /customers/:customerId - ID'ye göre müşteri getir
router.get('/:customerId', async (req, res, next) => {
    try {
        const customer = await customerService.find(req.params.customerId);
        if (!customer) {
            return res.status(404).send("Customer not found");
        }
        res.send(customer);
    } catch (error) {
        next(error);
    }
});

// PATCH /customers/:customerId - Müşteri bilgilerini güncelle
router.patch('/:customerId', async (req, res, next) => {
    const customerId = req.params.customerId;
    const updatedCustomer = req.body;
    try {
        const result = await customerService.update(customerId, updatedCustomer);
        res.send(result);
    } catch (error) {
        next(error);
    }
});

// DELETE /customers/:customerId - Müşteriyi sil
router.delete('/:customerId', async (req, res, next) => {
    const customerId = req.params.customerId;
    try {
        const result = await customerService.removeBy('_id', customerId);
        res.send(result);
    } catch (error) {
        next(error);
    }
});

// POST /customers/:customerId/orderBookings - Yeni sipariş oluştur
router.post('/:customerId/orderBookings', async (req, res, next) => {
    try {
        const { customerId } = req.params
        const { itemId, orderStart, orderEnd } = req.body
        const orderBooking = await orderBookingService.orderBook(itemId, customerId, orderStart, orderEnd)
        res.send(orderBooking)
    } catch (error) {
        next(error);
    }
});

// GET /customers/:customerId/orderBookings - Müşterinin sipariş geçmişini getir
router.get('/:customerId/orderBookings', async (req, res, next) => {
    try {
        const customer = await customerService.find(req.params.customerId);
        if (!customer) {
            return res.status(404).send("Customer not found");
        }
        const orderBookings = customer.orderBookings;
        res.send(orderBookings);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
