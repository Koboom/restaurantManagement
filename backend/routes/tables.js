const express = require('express');
const router = express.Router();
const TableService = require('../services/table-service');

// Tüm masaları getirme endpoint'i
router.get('/', async (req, res) => {
    try {
        const tables = await TableService.load();
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Belirli bir masa ID'sine göre masayı getirme endpoint'i
router.get('/:tableId', async (req, res) => {
    const tableId = req.params.tableId;
    try {
        const table = await TableService.find(tableId);
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Yeni masa ekleme endpoint'i
router.post('/', async (req, res) => {
    const tableData = req.body;
    try {
        const newTable = await TableService.insert(tableData);
        res.status(201).json(newTable);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Belirli bir masa ID'sine göre masayı güncelleme endpoint'i (PUT)
router.put('/:tableId', async (req, res) => {
    const tableId = req.params.tableId;
    const updatedTableData = req.body;
    try {
        const result = await TableService.update(tableId, updatedTableData);
        res.send(result)
    } catch (error) {
        res.status(500).send(`Error updating table with ID ${tableId}: ${error.message}`);
    }
});

// Belirli bir masa ID'sine göre masayı kısmi güncelleme endpoint'i (PATCH)
router.patch("/:tableId", async (req, res) => {
    try {
        const { tableId } = req.params;
        const updatedFields = req.body;

        // Güncellenecek alanların uygunluğunu kontrol edin (opsiyonel)
        // Örneğin, "number" ve "capacity" zorunlu alanlar olduğu için kontrol edilebilir
        if (!updatedFields.number || !updatedFields.capacity) {
            return res.status(400).send("Number and capacity are required.");
        }

        // Veritabanı güncelleme işlemini servis katmanında gerçekleştirin
        await TableService.update(tableId, updatedFields);

        res.status(200).send("Table updated successfully");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Belirli bir masa ID'sine göre masayı silme endpoint'i
router.delete('/:tableId', async (req, res) => {
    const tableId = req.params.tableId;
    try {
        const deletedTable = await TableService.removeBy('_id', tableId);
        if (!deletedTable) {
            return res.status(404).json({ error: 'Table not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
