const express = require('express');
const router = express.Router();
const WaiterService = require('../services/waiter-service');

// GET /waiters
// Tüm garsonları getirir
router.get('/', async (req, res) => {
    try {
        const waiters = await WaiterService.load();
        res.send(waiters);
    } catch (error) {
        res.status(500).send(`Error retrieving waiters: ${error.message}`);
    }
});

// GET /waiters/:waiterId
// Belirli bir garsonu getirir
router.get('/:waiterId', async (req, res) => {
    const waiterId = req.params.waiterId;

    try {
        const waiter = await WaiterService.find(waiterId);
        if (!waiter) {
            return res.status(404).send(`Waiter with ID ${waiterId} not found`);
        }
        res.send(waiter);
    } catch (error) {
        res.status(500).send(`Error retrieving waiter with ID ${waiterId}: ${error.message}`);
    }
});

// POST /waiters
// Yeni bir garson ekler
router.post('/', async (req, res) => {
    const newWaiter = req.body;

    try {
        const createdWaiter = await WaiterService.insert(newWaiter);
        res.status(201).send(createdWaiter);
    } catch (error) {
        res.status(500).send(`Error creating new waiter: ${error.message}`);
    }
});

// routes/waiters.js

router.patch("/:waiterId", async (req, res) => {
    try {
        const waiterId = req.params.waiterId;
        const updateFields = req.body;

        // Garson bilgilerini güncelle
        const updatedWaiter = await WaiterService.updateWaiter(waiterId, updateFields);

        if (!updatedWaiter) {
            return res.status(404).send({ error: `Waiter with ID ${waiterId} not found` });
        }

        // Güncellenmiş garson bilgilerini geri döndür
        res.status(200).send(updatedWaiter);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// PUT /waiters/:waiterId
// Belirli bir garsonun bütün bilgilerini günceller.Bunu kullan genelde.
router.put('/:waiterId', async (req, res) => {
    const waiterId = req.params.waiterId;
    const updatedWaiter = req.body;

    try {
        const result = await WaiterService.update(waiterId, updatedWaiter);
        res.send(result);
    } catch (error) {
        res.status(500).send(`Error updating waiter with ID ${waiterId}: ${error.message}`);
    }
});

// DELETE /waiters/:waiterId
// Belirli bir garsonu siler
router.delete('/:waiterId', async (req, res) => {
    const waiterId = req.params.waiterId;

    try {
        const result = await WaiterService.removeBy("_id", waiterId);
        if (result.deletedCount === 0) {
            return res.status(404).send(`Waiter with ID ${waiterId} not found`);
        }
        res.send(`Waiter with ID ${waiterId} deleted successfully`);
    } catch (error) {
        res.status(500).send(`Error deleting waiter with ID ${waiterId}: ${error.message}`);
    }
});

// GET /waiters/search/:name
// İsimle garson arama yapar
router.get('/search/:name', async (req, res) => {
    const name = req.params.name;

    try {
        const waiters = await WaiterService.findByName(name);
        res.send(waiters);
    } catch (error) {
        res.status(500).send(`Error searching waiters by name ${name}: ${error.message}`);
    }
});

module.exports = router;
