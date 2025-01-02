const BaseService = require("./base-service");
const Payment = require("../models/payment");
const customerService = require("./customer-service");

class PaymentService extends BaseService {
    // Belirli bir müşteri için yapılan ödemeleri bul
    async findPaymentsByCustomerId(customerId) {
        try {
            return await this.findBy("customer", customerId);
        } catch (error) {
            throw new Error(`Error finding payments by customer ID ${customerId}: ${error.message}`);
        }
    }

    // Belirli bir sipariş için yapılan ödemeleri bul
    async findPaymentsByOrderId(orderId) {
        try {
            return await this.findBy("order", orderId);
        } catch (error) {
            throw new Error(`Error finding payments by order ID ${orderId}: ${error.message}`);
        }
    }

    // Belirli bir tarihte yapılan ödemeleri bul
    async findPaymentsByDate(date) {
        try {
            const start = new Date(date.setHours(0, 0, 0, 0));
            const end = new Date(date.setHours(23, 59, 59, 999));
            return await this.query({ paymentDate: { $gte: start, $lte: end } });
        } catch (error) {
            throw new Error(`Error finding payments on date ${date}: ${error.message}`);
        }
    }

    // Belirli bir zaman aralığında yapılan ödemeleri bul
    async findPaymentsByDateRange(startDate, endDate) {
        try {
            return await this.query({
                paymentDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
            });
        } catch (error) {
            throw new Error(`Error finding payments between ${startDate} and ${endDate}: ${error.message}`);
        }
    }

    // Yeni bir ödeme eklerken müşteri ve opsiyonel olarak siparişi doğrular
    async addPayment(paymentData) {
        const { customerId, orderId, amount, paymentMethod, status, referenceNumber, note } = paymentData;

        try {
            // Müşteri olup olmadığını kontrol et
            const customer = await customerService.find(customerId);
            if (!customer) throw new Error("Customer not found");

            // Sipariş olup olmadığını kontrol et (eğer verildiyse)
            let order = null;
            if (orderId) {
                order = await orderService.find(orderId);
                if (!order) throw new Error("Order not found");
            }

            // Ödeme ekleme
            const payment = await this.insert({
                customer: customerId,
                order: orderId,
                amount,
                paymentMethod,
                status: status || 'Pending',
                referenceNumber,
                note
            });

            // Siparişin ödeme durumunu güncelleme (eğer sipariş verildiyse)
            if (order) {
                order.paymentStatus = 'Paid';
                await order.save();
            }

            return payment;
        } catch (error) {
            throw new Error('Error adding payment: ' + error.message);
        }
    }

    // Ödeme durumunu güncelle
    async updatePaymentStatus(paymentId, newStatus) {
        try {
            const payment = await this.find(paymentId);
            if (!payment) throw new Error("Payment not found");

            payment.status = newStatus;
            await payment.save();

            return payment;
        } catch (error) {
            throw new Error('Error updating payment status: ' + error.message);
        }
    }

    // Ödemeleri ödeme metoduna göre sıralar (artan veya azalan)
    async sortPaymentsByMethod(order = 'asc') {
        try {
            const sortOption = order === 'asc' ? { paymentMethod: 1 } : { paymentMethod: -1 };
            return await this.query({}, { sort: sortOption });
        } catch (error) {
            throw new Error(`Error sorting payments by method: ${error.message}`);
        }
    }

    // Ödemeleri miktara göre sıralar (artan veya azalan)
    async sortPaymentsByAmount(order = 'asc') {
        try {
            const sortOption = order === 'asc' ? { amount: 1 } : { amount: -1 };
            return await this.query({}, { sort: sortOption });
        } catch (error) {
            throw new Error(`Error sorting payments by amount: ${error.message}`);
        }
    }
}

// 'Payment' modelini doğrudan constructor'a geçirerek daha kısa ve net bir yapı oluşturuyoruz.
module.exports = new PaymentService(Payment);
