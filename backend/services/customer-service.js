const BaseService = require("./base-service")
const Customer = require("../models/customer")

class CustomerService extends BaseService {
    async findById(id) {
        try {
            return await this.model.findById(id).populate({
                path: 'orderBookings',
                populate: [
                    { path: 'item' },
                    { path: 'table' },
                    { path: 'waiter' }
                ]
            }).exec();
        } catch (error) {
            throw new Error('Error finding customer by ID: ' + error.message);
        }
    }

    async findByName(name) {
        try {
            return await this.model.findOne({ name: name });
        } catch (error) {
            throw new Error('Error finding customer by name: ' + error.message);
        }
    }
}

module.exports = new CustomerService(Customer)
