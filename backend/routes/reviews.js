const express = require('express');
const router = express.Router();
const ReviewService = require('../services/review-service');

// GET /reviews/customer/:customerId
// Belirli bir müşterinin yaptığı yorumları getirir
router.get('/customer/:customerId', async (req, res) => {
    const customerId = req.params.customerId;

    try {
        const reviews = await ReviewService.findReviewsByCustomerId(customerId);
        res.send(reviews);
    } catch (error) {
        res.status(500).send(`Error retrieving reviews for customer with ID ${customerId}: ${error.message}`);
    }
});

// GET /reviews/item/:itemId
// Belirli bir ürün hakkında yapılan yorumları getirir
router.get('/item/:itemId', async (req, res) => {
    const itemId = req.params.itemId;

    try {
        const reviews = await ReviewService.findReviewsByItemId(itemId);
        res.send(reviews);
    } catch (error) {
        res.status(500).send(`Error retrieving reviews for item with ID ${itemId}: ${error.message}`);
    }
});

// GET /reviews/rating/:rating
// Belirli bir puandan yüksek veya eşit yorumları getirir
router.get('/rating/:rating', async (req, res) => {
    const rating = parseInt(req.params.rating);

    try {
        const reviews = await ReviewService.findReviewsWithRating(rating);
        res.send(reviews);
    } catch (error) {
        res.status(500).send(`Error retrieving reviews with rating ${rating} or higher: ${error.message}`);
    }
});

// GET /reviews/sort/rating/:order
// Yorumları puana göre sıralar (artan veya azalan)
router.get('/sort/rating/:order', async (req, res) => {
    const order = req.params.order;

    try {
        const sortedReviews = await ReviewService.sortReviewsByRating(order);
        res.send(sortedReviews);
    } catch (error) {
        res.status(500).send(`Error sorting reviews by rating: ${error.message}`);
    }
});

// GET /reviews/date/:startDate/:endDate
// Belirli bir tarih aralığındaki yorumları getirir
router.get('/date/:startDate/:endDate', async (req, res) => {
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;

    try {
        const reviews = await ReviewService.findReviewsByDateRange(startDate, endDate);
        res.send(reviews);
    } catch (error) {
        res.status(500).send(`Error retrieving reviews between ${startDate} and ${endDate}: ${error.message}`);
    }
});

// GET /reviews/customer/:customerId/item/:itemId
// Bir müşterinin belirli bir ürün hakkındaki yorumunu getirir
router.get('/customer/:customerId/item/:itemId', async (req, res) => {
    const customerId = req.params.customerId;
    const itemId = req.params.itemId;

    try {
        const review = await ReviewService.findReviewByCustomerAndItem(customerId, itemId);
        res.send(review);
    } catch (error) {
        res.status(500).send(`Error retrieving review for customer ${customerId} and item ${itemId}: ${error.message}`);
    }
});

// POST /reviews
// Yeni bir yorum ekler
router.post('/', async (req, res) => {
    const reviewData = req.body;

    try {
        const review = await ReviewService.addReview(reviewData);
        res.status(201).send(review);
    } catch (error) {
        res.status(500).send(`Error adding review: ${error.message}`);
    }
});

module.exports = router;
