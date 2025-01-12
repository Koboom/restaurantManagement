<script>
import { useStore } from '@/stores/restaurantUse';
import { mapActions } from 'pinia';

export default {
    name: "TableView",
    data() {
        return {
            table: {}, // Seçilen tablo bilgileri
            tables: [] // Tüm tabloların listesi
        }
    },
    async mounted() {
        await this.loadTable(); // loadTable metodunu kullanarak tabloyu yükler
    },
    methods: {
        ...mapActions(useStore, ["fetchTable", "fetchTables", "updateTable"]),
        async loadTable() {
            try {
                // fetchTable ile tek tabloyu getir ve table değişkenine ata
                this.table = await this.fetchTable(this.$route.params.tableId);
                // fetchTables ile tüm tabloları getir ve tables değişkenine ata
                this.tables = await this.fetchTables();
            } catch (error) {
                console.log("Error fetching table:", error);
            }
        },
        async submitTableUpdateForm() {
            try{
                await this.updateTable(this.table._id, this.table)
                alert("Table updated successfully")
            } catch (error) {
                console.log("Error updating table:", error);
                alert("Error updating table")
            }
        },

        statusClass(status) {
            switch (status) {
                case 'Available':
                    return 'bg-available';
                case 'Occupied':
                    return 'bg-occupied';
                case 'Reserved':
                    return 'bg-reserved';
                case 'Cleaning':
                    return 'bg-cleaning';
                default:
                    return '';
            }
        },
    }
}
</script>

<template>
    <div class="w3-container w3-margin-top">
      <router-link class="w3-button w3-green w3-round-large w3-left" to="/tables"><i class="fa fa-arrow-left"></i></router-link>
    </div>
    <!-- Tablo Güncelleme Formu -->
    <div class="w3-container">
        <p class="w3-panel w3-leftbar w3-border-green w3-pale-red w3-round-large">
            Es handelt sich um eine Demoseite.
        </p>
        <h3>Table Update Form</h3>
        <div class="w3-border w3-half w3-border-green w3-round-large w3-pale-green">
            <div class="w3-container" :class="statusClass(table.status)">
                <p>Table Number:  {{ table.number }}- Table Status: {{ table.status }}</p>

                <form action="" @submit.prevent="submitTableUpdateForm" class="w3-form">
                <p>
                    <label for="number">Number</label>
                    <input type="number" name="" id="number" disabled v-model="table.number" class="w3-input w3-border w3-round-large">
                </p>
                <p>
                    <label for="capacity">Capacity</label>
                    <input type="number" name="" id="capacity" v-model="table.capacity" class="w3-input w3-border w3-round-large">
                </p>
                <p>
                    <label for="status">Status</label>
                    <select name="status" id="status" v-model="table.status" class="w3-input w3-border w3-round-large">
                        <option disabled value="">Please select a status</option>
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Cleaning">Cleaning</option>
                    </select>
                </p>
                <p>
                    <label for="isVIP">VIP </label>
                    <input type="checkbox" name="" id="isVIP" v-model="table.isVIP" class="w3-check">
                </p>
                <p>
                    <label for="specialRequests">Special Requests</label>
                    <textarea name="" id="specialRequests" v-model="table.specialRequests" class="w3-input w3-border w3-round-large"></textarea>
                </p>
                <p>
                    {{ table.specialRequests ? table.specialRequests.join(', ') : '' }}
                </p>
                <p>
                    <label for="location">Location</label>
                    <select name="location" id="" v-model="table.location" class="w3-input w3-border w3-round-large">
                        <option disabled value="">Please select a location</option>
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                        <option value="Other">Other</option>
                    </select>
                </p>
                <p>
                    <label for="isSmokingAllowed">Smoking Allowed </label>
                    <input type="checkbox" name="" id="isSmokingAllowed" v-model="table.isSmokingAllowed" class="w3-check">
                </p>
                <p>
                    <label for="reservedUntil">Reserved Until</label>
                    <input type="datetime-local" name="" id="reservedUntil" v-model="table.reservedUntil" class="w3-input w3-border w3-round-large">
                </p>
                <p>
                    <label for="lastCleaningDate">Last Cleaning Date</label>
                    <input type="datetime-local" name="" id="lastCleaningDate" v-model="table.lastCleaningDate" class="w3-input w3-border w3-round-large">
                </p>
                <p>
                    <label for="notes">Notes</label>
                    <textarea name="" id="notes" v-model="table.notes" class="w3-input w3-border w3-round-large"></textarea>
                </p>
                <p>
                    <button type="submit" class="w3-button w3-green w3-round-large w3-large">Submit</button>
                </p>
                </form>
            </div>
        </div>

        <!-- Ekstra Tablo Bilgileri -->
        <div class="w3-border w3-half w3-border-green w3-round-large w3-pale-green w3-round w3-padding">
            <p>Additional Information about the table</p>
            <p>Capacity: {{ table.capacity }}</p>
            <p>Location: {{ table.location }}</p>
            <p>VIP: {{ table.isVIP ? 'Yes' : 'No' }}</p>
            <p>Special Requests: {{ table.specialRequests }}</p>
            <p>Smoking Allowed: {{ table.isSmokingAllowed ? 'Yes' : 'No' }}</p>
            <p>Reserved Until: {{ table.reservedUntil }}</p>
            <p>Last Cleaning Date: {{ table.lastCleaningDate }}</p>
            <p>Rating: {{ table.rating }}</p>
            <p>Notes: {{ table.notes }}</p>
            <p>Waiter:{{ table.waiter ? table.waiter.name : "Not Available" }}</p>
        </div>
    </div>
</template>
