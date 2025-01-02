class BaseService {
    constructor(model) {
        this.model = model;
    }

    async save(objects) {
        try {
            return await this.model.insertMany(objects);
        } catch (error) {
            throw new Error('Error saving objects: ' + error.message);
        }
    }

    async load(page = 1, limit = 100, sort = {}) {
        try {
            return await this.model.find().limit(limit).skip((page - 1) * limit).sort(sort);
        } catch (error) {
            throw new Error('Error loading objects: ' + error.message);
        }
    }

    async insert(object) {
        try {
            return await this.model.create(object);
        } catch (error) {
            throw new Error('Error inserting object: ' + error.message);
        }
    }

    async removeBy(property, value) {
        try {
            return await this.model.deleteOne({ [property]: value });
        } catch (error) {
            throw new Error('Error removing object: ' + error.message);
        }
    }

    async update(id, object) {
        try {
            return await this.model.findByIdAndUpdate(id, object, { new: true });
        } catch (error) {
            throw new Error('Error updating object: ' + error.message);
        }
    }

    async find(id) {
        try {
            return await this.model.findById(id);
        } catch (error) {
            throw new Error('Error finding object: ' + error.message);
        }
    }

    async query(filter = {}, options = {}) {
        try {
            return await this.model.find(filter, null, options);
        } catch (error) {
            throw new Error('Error querying objects: ' + error.message);
        }
    }

    async findBy(property, value) {
        try {
            return await this.model.findOne({ [property]: value });
        } catch (error) {
            throw new Error('Error finding by property: ' + error.message);
        }
    }
}

module.exports = BaseService;
