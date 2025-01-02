const BaseService = require("./base-service");
const Review = require("../models/review");
const customerService = require("./customer-service");
const itemService = require("./item-service");

class ReviewService extends BaseService {
    // Belirli bir müşteri tarafından yapılan yorumları bul
    async findReviewsByCustomerId(customerId) {
        try {
            return await this.findBy("customer", customerId);
        } catch (error) {
            throw new Error(`Error finding reviews by customer ID ${customerId}: ${error.message}`);
        }
    }

    // Belirli bir ürün hakkında yapılan yorumları bul
    async findReviewsByItemId(itemId) {
        try {
            return await this.findBy("item", itemId);
        } catch (error) {
            throw new Error(`Error finding reviews by item ID ${itemId}: ${error.message}`);
        }
    }

    // Belirli bir puana eşit veya daha yüksek yorumları bul
    async findReviewsWithRating(rating) {
        try {
            return await this.query({ rating: { $gte: rating } });
        } catch (error) {
            throw new Error(`Error finding reviews with rating ${rating} or higher: ${error.message}`);
        }
    }

    // Yorumları puana göre sıralar (artan veya azalan)
    async sortReviewsByRating(order = 'asc') {
        try {
            const sortOption = order === 'asc' ? { rating: 1 } : { rating: -1 };
            return await this.query({}, { sort: sortOption });
        } catch (error) {
            throw new Error(`Error sorting reviews by rating: ${error.message}`);
        }
    }

    // Belirli bir tarih aralığında yapılan yorumları bul
    async findReviewsByDateRange(startDate, endDate) {
        try {
            return await this.query({
                date: { $gte: new Date(startDate), $lte: new Date(endDate) }
            });
        } catch (error) {
            throw new Error(`Error finding reviews between dates ${startDate} and ${endDate}: ${error.message}`);
        }
    }

    // Bir müşterinin belirli bir ürüne verdiği yorumu bul
    async findReviewByCustomerAndItem(customerId, itemId) {
        try {
            return await this.query({ customer: customerId, item: itemId });
        } catch (error) {
            throw new Error(`Error finding review by customer ID ${customerId} and item ID ${itemId}: ${error.message}`);
        }
    }

    // Yeni bir inceleme (yorum) eklerken müşteri ve ürün doğrulaması yaparak ekle
    async addReview(reviewData) {
        const { customerId, itemId, rating, comment } = reviewData;

        try {
            // Müşteri ve ürün olup olmadığını kontrol et
            const customer = await customerService.find(customerId);
            const item = await itemService.find(itemId);

            if (!customer) throw new Error("Customer not found");
            if (!item) throw new Error("Item not found");

            // Yorum ekleme
            const review = await this.insert({
                customer: customerId,
                item: itemId,
                rating,
                comment,
                date: new Date()
            });

            return review;
        } catch (error) {
            throw new Error('Error adding review: ' + error.message);
        }
    }
}

// 'Review' modelini doğrudan constructor'a geçirerek daha kısa ve net bir yapı oluşturuyoruz.
module.exports = new ReviewService(Review);
