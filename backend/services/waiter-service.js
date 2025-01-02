const BaseService = require("./base-service");
const Waiter = require("../models/waiter");
const mongoose = require("mongoose");

class WaiterService extends BaseService {
    async find(waiterId) {
        try {
            const waiter = await Waiter.findById(waiterId);
            if (!waiter) {
                throw new Error(`Waiter with ID ${waiterId} not found`);
            }
            return waiter;
        } catch (error) {
            throw new Error('Error finding waiter: ' + error.message);
        }
    }
    // Belirli bir restoranda çalışan garsonları bul. bu kodu alternatif olarak kullanıyorum. state durumunu pinia ile yönetiyorum.
    async updateWaiter(waiterId, updateFields) {
        if (!mongoose.Types.ObjectId.isValid(waiterId)) {
            throw new Error('Invalid ID format');
        }
        try {
            const updatedWaiter = await Waiter.findByIdAndUpdate(waiterId, updateFields, { new: true });
            if (!updatedWaiter) {
                throw new Error(`Waiter with ID ${waiterId} not found`);
            }
            return updatedWaiter;
        } catch (error) {
            throw new Error('Error updating waiter: ' + error.message);
        }
    }
}

module.exports = new WaiterService(Waiter);
