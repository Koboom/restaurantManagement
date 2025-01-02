const BaseService = require("./base-service");
const Staff = require("../models/staff");

class StaffService extends BaseService {
    // Tüm aktif personeli bul
    async findActiveStaff() {
        try {
            return await this.findBy("active", true);
        } catch (error) {
            throw new Error(`Error finding active staff: ${error.message}`);
        }
    }

    // Belirli bir role sahip personeli buluyorum
    async findStaffByRole(role) {
        try {
            return await this.findBy("role", role);
        } catch (error) {
            throw new Error(`Error finding staff with role ${role}: ${error.message}`);
        }
    }

    // Yaşa göre personeli sıralıyorum
    async sortStaffByAge(order = 'asc') {
        try {
            const sortOption = order === 'asc' ? { age: 1 } : { age: -1 };
            return await this.query({}, { sort: sortOption });
        } catch (error) {
            throw new Error(`Error sorting staff by age: ${error.message}`);
        }
    }

    // Maaşa göre personeli sıralarıyorum
    async sortStaffBySalary(order = 'asc') {
        try {
            const sortOption = order === 'asc' ? { salary: 1 } : { salary: -1 };
            return await this.query({}, { sort: sortOption });
        } catch (error) {
            throw new Error(`Error sorting staff by salary: ${error.message}`);
        }
    }

    // Belirli bir yaştan büyük personeli bul
    async findStaffOlderThan(age) {
        try {
            return await this.query({ age: { $gt: age } });
        } catch (error) {
            throw new Error(`Error finding staff older than ${age}: ${error.message}`);
        }
    }

    // Belirli bir isimle personeli bul
    async findStaffByName(name) {
        try {
            return await this.findBy("name", name);
        } catch (error) {
            throw new Error(`Error finding staff by name ${name}: ${error.message}`);
        }
    }

    // Belirli bir maaş aralığındaki personeli bul
    async findStaffBySalaryRange(minSalary, maxSalary) {
        try {
            return await this.query({ salary: { $gte: minSalary, $lte: maxSalary } });
        } catch (error) {
            throw new Error(`Error finding staff with salary between ${minSalary} and ${maxSalary}: ${error.message}`);
        }
    }

    // Belirli bir cinsiyete sahip personeli bul
    async findStaffByGender(gender) {
        try {
            return await this.findBy("gender", gender);
        } catch (error) {
            throw new Error(`Error finding staff with gender ${gender}: ${error.message}`);
        }
    }

    // Personel maaşını güncelle
    async updateStaffSalary(staffId, newSalary) {
        try {
            const staff = await this.find(staffId);
            if (!staff) throw new Error(`Staff with ID ${staffId} not found`);

            staff.salary = newSalary;
            return await staff.save(); // Güncellemeyi kaydet.
        } catch (error) {
            throw new Error(`Error updating salary for staff ID ${staffId}: ${error.message}`);
        }
    }
}

// 'Staff' modelini doğrudan constructor'a geçirerek daha kısa ve net bir yapı oluşturuyoruz.
module.exports = new StaffService(Staff);
