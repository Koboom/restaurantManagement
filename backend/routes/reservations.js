const express = require('express');
const router = express.Router();
const ReservationService = require('../services/reservation-service');

// GET /reservations/customer/:customerId
// Belirli bir müşteri için yapılan rezervasyonları getirir
router.get('/customer/:customerId', async (req, res) => {
    const customerId = req.params.customerId;

    try {
        const reservations = await ReservationService.findReservationsByCustomerId(customerId);
        res.send(reservations);
    } catch (error) {
        res.status(500).send(`Error retrieving reservations for customer with ID ${customerId}: ${error.message}`);
    }
});

// GET /reservations/table/:tableId
// Belirli bir masa için yapılan rezervasyonları getirir
router.get('/table/:tableId', async (req, res) => {
    const tableId = req.params.tableId;

    try {
        const reservations = await ReservationService.findReservationsByTableId(tableId);
        res.send(reservations);
    } catch (error) {
        res.status(500).send(`Error retrieving reservations for table with ID ${tableId}: ${error.message}`);
    }
});

// POST /reservations
// Yeni bir rezervasyon ekler
router.post('/', async (req, res) => {
    const reservationData = req.body;

    try {
        const reservation = await ReservationService.addReservation(reservationData);// bunu direkt service ediyorum. Pinia dan çağırmıyorum.
        res.status(201).send(reservation);
    } catch (error) {
        res.status(500).send(`Error adding reservation: ${error.message}`);
    }
});

// PUT /reservations/:reservationId/cancel
// Belirli bir rezervasyonu iptal eder
router.put('/:reservationId/cancel', async (req, res) => {
    const reservationId = req.params.reservationId;

    try {
        const cancelledReservation = await ReservationService.cancelReservation(reservationId);// bunu direkt service ediyorum. Pinia dan çağırmıyorum.
        res.send(cancelledReservation);
    } catch (error) {
        res.status(500).send(`Error cancelling reservation: ${error.message}`);
    }
});

// GET /reservations/sort/status/:order
// Rezervasyonları duruma göre sıralar (artan veya azalan)
router.get('/sort/status/:order', async (req, res) => {
    const order = req.params.order;

    try {
        const sortedReservations = await ReservationService.sortReservationsByStatus(order);// bunu direkt service ediyorum. Pinia dan çağırmıyorum.
        res.send(sortedReservations);
    } catch (error) {
        res.status(500).send(`Error sorting reservations by status: ${error.message}`);
    }
});

module.exports = router;
