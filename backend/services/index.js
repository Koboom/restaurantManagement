const customerService = require('./customer-service');
const itemService = require('./item-service');
const orderService = require('./orderBooking-service');
const paymentService = require('./payment-service');
const reservationService = require('./reservation-service');
const reviewService = require('./review-service');
const staffService = require('./staff-service');
const tableService = require('./table-service');
const waiterService = require('./waiter-service');
const menuService = require('./menu-service');

module.exports = {
    customerService,
    itemService,
    orderService,
    paymentService,
    reservationService,
    reviewService,
    staffService,
    tableService,
    waiterService,
    menuService
}