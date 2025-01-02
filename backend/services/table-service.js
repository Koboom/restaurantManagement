const BaseService = require('./base-service');
const Table = require('../models/table');

class TableService extends BaseService {
    // Özgün metotlar buraya eklenebilir

    async findByStatus(status) {
        try {
            return await this.model.find({ status });
        } catch (error) {
            throw new Error(`Error finding tables by status '${status}': ${error.message}`);
        }
    }

    async findAvailableTables() {
        try {
            return await this.findByStatus('Available');
        } catch (error) {
            throw new Error(`Error finding available tables: ${error.message}`);
        }
    }

    async findOccupiedTables() {
        try {
            return await this.findByStatus('Occupied');
        } catch (error) {
            throw new Error(`Error finding occupied tables: ${error.message}`);
        }
    }

    async findReservedTables() {
        try {
            return await this.findByStatus('Reserved');
        } catch (error) {
            throw new Error(`Error finding reserved tables: ${error.message}`);
        }
    }

    async findCleaningTables() {
        try {
            return await this.findByStatus('Cleaning');
        } catch (error) {
            throw new Error(`Error finding cleaning tables: ${error.message}`);
        }
    }

    // İhtiyaca göre diğer özgün metotlar eklenebilir
}

module.exports = new TableService(Table);
