const express = require('express');
const router = express.Router();
const StaffService = require('../services/staff-service');

// GET /staffs/active
// Tüm aktif personeli getirir
router.get('/active', async (req, res) => {
    try {
        const activeStaff = await StaffService.findActiveStaff();
        res.send(activeStaff);
    } catch (error) {
        res.status(500).send(`Error retrieving active staff: ${error.message}`);
    }
});

// GET /staffs/role/:role
// Belirli bir role sahip personeli getirir
router.get('/role/:role', async (req, res) => {
    const role = req.params.role;

    try {
        const staffByRole = await StaffService.findStaffByRole(role);
        res.send(staffByRole);
    } catch (error) {
        res.status(500).send(`Error retrieving staff with role ${role}: ${error.message}`);
    }
});

// GET /staffs/sort/age/:order
// Personeli yaşa göre sıralar (artan veya azalan)
router.get('/sort/age/:order', async (req, res) => {
    const order = req.params.order;

    try {
        const sortedStaff = await StaffService.sortStaffByAge(order);
        res.send(sortedStaff);
    } catch (error) {
        res.status(500).send(`Error sorting staff by age: ${error.message}`);
    }
});

// GET /staffs/sort/salary/:order
// Personeli maaşa göre sıralar (artan veya azalan)
router.get('/sort/salary/:order', async (req, res) => {
    const order = req.params.order;

    try {
        const sortedStaff = await StaffService.sortStaffBySalary(order);
        res.send(sortedStaff);
    } catch (error) {
        res.status(500).send(`Error sorting staff by salary: ${error.message}`);
    }
});

// GET /staffs/olderthan/:age
// Belirli bir yaştan büyük personeli getirir
router.get('/olderthan/:age', async (req, res) => {
    const age = parseInt(req.params.age);

    try {
        const staffOlderThan = await StaffService.findStaffOlderThan(age);
        res.send(staffOlderThan);
    } catch (error) {
        res.status(500).send(`Error retrieving staff older than ${age}: ${error.message}`);
    }
});

// GET /staffs/name/:name
// Belirli bir isimle personeli getirir
router.get('/name/:name', async (req, res) => {
    const name = req.params.name;

    try {
        const staffByName = await StaffService.findStaffByName(name);
        res.send(staffByName);
    } catch (error) {
        res.status(500).send(`Error retrieving staff with name ${name}: ${error.message}`);
    }
});

// GET /staffs/salaryrange/:minSalary/:maxSalary
// Belirli bir maaş aralığındaki personeli getirir
router.get('/salaryrange/:minSalary/:maxSalary', async (req, res) => {
    const minSalary = parseInt(req.params.minSalary);
    const maxSalary = parseInt(req.params.maxSalary);

    try {
        const staffBySalaryRange = await StaffService.findStaffBySalaryRange(minSalary, maxSalary);
        res.send(staffBySalaryRange);
    } catch (error) {
        res.status(500).send(`Error retrieving staff with salary between ${minSalary} and ${maxSalary}: ${error.message}`);
    }
});

// GET /staffs/gender/:gender
// Belirli bir cinsiyete sahip personeli getirir
router.get('/gender/:gender', async (req, res) => {
    const gender = req.params.gender;

    try {
        const staffByGender = await StaffService.findStaffByGender(gender);
        res.send(staffByGender);
    } catch (error) {
        res.status(500).send(`Error retrieving staff with gender ${gender}: ${error.message}`);
    }
});

// PUT /staffs/:staffId/update-salary
// Personel maaşını günceller
router.put('/:staffId/update-salary', async (req, res) => {
    const staffId = req.params.staffId;
    const newSalary = req.body.newSalary;

    try {
        const updatedStaff = await StaffService.updateStaffSalary(staffId, newSalary);
        res.send(updatedStaff);
    } catch (error) {
        res.status(500).send(`Error updating salary for staff with ID ${staffId}: ${error.message}`);
    }
});

module.exports = router;
