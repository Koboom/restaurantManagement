const BaseService = require("./base-service");
const Reservation = require("../models/reservation");
const customerService = require("./customer-service");
const tableService = require("./table-service");

class ReservationService extends BaseService {
    // Belirli bir müşteri tarafından yapılan rezervasyonları bul
    async findReservationsByCustomerId(customerId) {
        try {
            return await this.findBy("customer", customerId);
        } catch (error) {
            throw new Error(`Error finding reservations by customer ID ${customerId}: ${error.message}`);
        }
    }

    // Belirli bir masa için yapılan rezervasyonları bul
    async findReservationsByTableId(tableId) {
        try {
            return await this.findBy("table", tableId);
        } catch (error) {
            throw new Error(`Error finding reservations by table ID ${tableId}: ${error.message}`);
        }
    }

    // Belirli bir tarihte yapılan rezervasyonları bul
    async findReservationsByDate(date) {
        try {
            const start = new Date(date.setHours(0, 0, 0, 0));
            const end = new Date(date.setHours(23, 59, 59, 999));
            return await this.query({ reservationStart: { $gte: start, $lte: end } });
        } catch (error) {
            throw new Error(`Error finding reservations on date ${date}: ${error.message}`);
        }
    }

    // Belirli bir zaman aralığında yapılan rezervasyonları bul
    async findReservationsByDateRange(startDate, endDate) {
        try {
            return await this.query({
                reservationStart: { $gte: new Date(startDate) },
                reservationEnd: { $lte: new Date(endDate) }
            });
        } catch (error) {
            throw new Error(`Error finding reservations between ${startDate} and ${endDate}: ${error.message}`);
        }
    }

    // Yeni bir rezervasyon eklerken müşteri ve masa doğrulaması yaparak ekle
    async addReservation(reservationData) {
        const { customerId, tableId, reservationStart, reservationEnd, durationMinutes, note } = reservationData;

        try {
            // Müşteri ve masa olup olmadığını kontrol et
            const customer = await customerService.find(customerId);
            const table = await tableService.find(tableId);

            if (!customer) throw new Error("Customer not found");
            if (!table) throw new Error("Table not found");

            // Çakışan rezervasyonların kontrolü
            const overlappingReservations = await this.query({
                table: tableId,
                $or: [
                    { reservationStart: { $lt: reservationEnd, $gte: reservationStart } },
                    { reservationEnd: { $gt: reservationStart, $lte: reservationEnd } }
                ]
            });

            if (overlappingReservations.length > 0) {
                throw new Error("Table is already reserved for the specified time range");
            }

            // Rezervasyon ekleme
            const reservation = await this.insert({
                customer: customerId,
                table: tableId,
                reservationStart: new Date(reservationStart),
                reservationEnd: new Date(reservationEnd),
                durationMinutes,
                status: 'Pending',
                note
            });

            // Masa durumunu güncelleme
            table.status = 'Reserved';
            await table.save();

            return reservation;
        } catch (error) {
            throw new Error('Error adding reservation: ' + error.message);
        }
    }

    // Rezervasyonu iptal et
    async cancelReservation(reservationId) {
        try {
            // Rezervasyonu bul
            const reservation = await this.find(reservationId);
            if (!reservation) throw new Error("Reservation not found");

            // Rezervasyonu iptal et
            reservation.status = 'Cancelled';
            await reservation.save();

            // Masanın durumunu güncelle
            const table = await tableService.find(reservation.table._id);
            if (table) {
                table.status = 'Available';
                await table.save();
            }

            return reservation;
        } catch (error) {
            throw new Error('Error cancelling reservation: ' + error.message);
        }
    }

    // Rezervasyonları duruma göre sıralar (artan veya azalan)
    async sortReservationsByStatus(order = 'asc') {
        try {
            const sortOption = order === 'asc' ? { status: 1 } : { status: -1 };
            return await this.query({}, { sort: sortOption });
        } catch (error) {
            throw new Error(`Error sorting reservations by status: ${error.message}`);
        }
    }
}

// 'Reservation' modelini doğrudan constructor'a geçirerek daha kısa ve net bir yapı oluşturuyoruz.
module.exports = new ReservationService(Reservation);
