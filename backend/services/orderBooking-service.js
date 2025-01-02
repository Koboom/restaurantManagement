// İlgili servislerin ve modelin içe aktarılması
const BaseService = require("./base-service")
const OrderBooking = require("../models/orderBooking")
const customerService = require("./customer-service")
const itemService = require("./item-service")


// OrderService sınıfı, BaseService sınıfından türetilmiş olup, siparişlerle ilgili işlemleri gerçekleştirir
class OrderBookingService extends BaseService {

    // Belirli bir müşteri ID'sine göre siparişleri bulma
    async findByCustomerId(customerId) {
        return this.findBy("customer", customerId);
    }

    // Belirli bir garson ID'sine göre siparişleri bulma
    async findByWaiterId(waiterId) {
        return this.findBy("waiter", waiterId);
    }

    // Belirli bir masa ID'sine göre siparişleri bulma
    async findByTableId(tableId) {
        return this.findBy("table", tableId);
    }

    async findByItemId(itemId) {
        return this.findBy("item", itemId)
    }

    async orderBook(itemId, customerId, orderStart, orderEnd) {
        const customer = await customerService.find(customerId)
        const item = await itemService.find(itemId)

        const orderBooking = await this.insert({ customer,item, orderStart, orderEnd})
        customer.orderBookings.push(orderBooking)

        await customer.save()
        return orderBooking
    }
}

// OrderService sınıfını dışa aktar
module.exports = new OrderBookingService(OrderBooking)
