const express = require('express');
const router = express.Router();
const PaymentService = require('../services/payment-service');

// GET /payments/customer/:customerId
// Belirli bir müşteri için yapılan ödemeleri getirir
// GET /payments/customer/:customerId
router.get('/customer/:customerId', async (req, res) => {
    const customerId = req.params.customerId;

    try {
        const payments = await PaymentService.findPaymentsByCustomerId(customerId);
        res.send(payments);
    } catch (error) {
        res.status(500).send(`Error retrieving payments for customer with ID ${customerId}: ${error.message}`);
    }
});

// GET /payments/order/:orderId
router.get('/order/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const payments = await PaymentService.findPaymentsByOrderId(orderId);
        res.send(payments);
    } catch (error) {
        res.status(500).send(`Error retrieving payments for order with ID ${orderId}: ${error.message}`);
    }
});

// POST /payments
router.post('/', async (req, res) => {
    const paymentData = req.body;

    try {
        const payment = await PaymentService.addPayment(paymentData);
        res.status(201).send(payment);
    } catch (error) {
        res.status(500).send(`Error adding payment: ${error.message}`);
    }
});

// PUT /payments/:paymentId/status
router.put('/:paymentId/status', async (req, res) => {
    const paymentId = req.params.paymentId;
    const newStatus = req.body.status;

    try {
        const updatedPayment = await PaymentService.updatePaymentStatus(paymentId, newStatus);
        res.send(updatedPayment);
    } catch (error) {
        res.status(500).send(`Error updating payment status: ${error.message}`);
    }
});

// GET /payments/sort/method/:order
router.get('/sort/method/:order', async (req, res) => {
    const order = req.params.order;

    try {
        const sortedPayments = await PaymentService.sortPaymentsByMethod(order);
        res.send(sortedPayments);
    } catch (error) {
        res.status(500).send(`Error sorting payments by method: ${error.message}`);
    }
});

// GET /payments/sort/amount/:order
router.get('/sort/amount/:order', async (req, res) => {
    const order = req.params.order;

    try {
        const sortedPayments = await PaymentService.sortPaymentsByAmount(order);
        res.send(sortedPayments);
    } catch (error) {
        res.status(500).send(`Error sorting payments by amount: ${error.message}`);
    }
});

module.exports = router;
