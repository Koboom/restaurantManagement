<script>
import { mapActions } from 'pinia';
import { useStore } from '@/stores/restaurantUse';

    export default {
        data() {
            return {
                tables: [],
                table: {
                    number: '',
                    capacity: '',
                    location: '',
                    isVIP: false,
                    specialRequests: [],
                    isSmokingAllowed: false,
                    reservedUntil: '',
                    lastCleaningDate: '',
                    rating: '',
                    notes: ''
                }
            }
        },
        async mounted() {
            this.updateTables()
        },
        methods: {
            ...mapActions(useStore, ["fetchTables","addTable"]),
            async updateTables() {
                try {
                    this.tables = await this.fetchTables()
                } catch (error) {
                    console.log(error)
                    alert("An error occurred while fetching tables. Please try again.")
                }
            },
            setRating(rating) {
                this.table.rating = rating;
            },
            async submitTableForm() {
                try {
                    await this.addTable(this.table)
                    alert("Table added successfully")
                    this.tables.push({ ...this.table})
                    this.updateTables()
                    this.resetTableForm()
                } catch (error) {
                    console.log(error)
                    alert("An error occurred while adding table. Please try again.")
                }
            },
            resetTableForm() {
                this.table = {
                    number: '',
                    capacity: '',
                    location: '',
                    isVIP: false,
                    specialRequests: [],
                    isSmokingAllowed: false,
                    reservedUntil: '',
                    lastCleaningDate: '',
                    rating: '',
                    notes: ''
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
            handleTableClick(table) {
                if (table.status === 'Occupied' || table.status === 'Reserved') {
                    alert('This table is currently occupied or reserved.');
                    this.$router.push(`/tables/${table._id}`);
                } else {
                    this.$router.push(`/tables/${table._id}`);
                }
            }
        }
    }
</script>

<template>
    <div class="w3-container">
        <p class="w3-panel w3-leftbar w3-border-green w3-pale-red w3-round-large">
            Es handelt sich um eine Demoseite.
        </p>
        <div class="w3-container w3-border w3-border-green w3-round-large w3-light-grey w3-round w3-padding-large">
            <h2>Tables</h2>
            <p>Total Tables: {{ tables.length }}</p>
            <ul class="w3-ul">
                <li v-for="table in tables.sort((a, b) => a.number - b.number)"
                    :key="table._id"
                    style="max-height: 300px; overflow: auto; cursor: pointer;"
                    class="w3-card-4 w3-hover-opacity w3-round-large w3-col s6 m4 l2 w3-margin-bottom w3-padding-large"
                    :class="statusClass(table.status)"
                    >

                    <a class="table-link" @click="handleTableClick(table)">
                        <div>
                            <h3>{{ table.number }}</h3>
                            <div>
                                <p>Status: {{ table.status }}</p>
                                <p>Capacity: {{ table.capacity }}</p>
                                <p>Location: {{ table.location }}</p>
                                <p>VIP: {{ table.isVIP ? 'Yes' : 'No' }}</p>
                                <p>Special Requests:
                                    <span v-if="table.specialRequests && table.specialRequests.length">
                                        <ul>
                                            <li v-for="request in table.specialRequests" :key="request">{{ request }}</li>
                                        </ul>
                                    </span>
                                    <span v-else>None</span>
                                </p>
                                <p>Smoking Allowed: {{ table.isSmokingAllowed ? 'Yes' : 'No' }}</p>
                                <p>Reserved Until: {{ table.reservedUntil ? new Date(table.reservedUntil).toLocaleString() : 'Not Reserved' }}</p>
                                <p>Last Cleaning Date: {{ table.lastCleaningDate ? new Date(table.lastCleaningDate).toLocaleString() : 'Unknown' }}</p>
                                <p>
                                    <label for="rating">Rating</label> <br>
                                    <span class="rating-stars">
                                        <i class="fa fa-star" @click="setRating(1)" :class="{ 'rated': table.rating >= 1 }"></i>
                                        <i class="fa fa-star" @click="setRating(2)" :class="{ 'rated': table.rating >= 2 }"></i>
                                        <i class="fa fa-star" @click="setRating(3)" :class="{ 'rated': table.rating >= 3 }"></i>
                                        <i class="fa fa-star" @click="setRating(4)" :class="{ 'rated': table.rating >= 4 }"></i>
                                        <i class="fa fa-star" @click="setRating(5)" :class="{ 'rated': table.rating >= 5 }"></i>
                                    </span>
                                </p>
                                <p>Notes: {{ table.notes ? table.notes : 'No Notes' }}</p>
                            </div>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
        <div class="w3-container w3-border w3-border-green w3-round-large w3-pale-green w3-round">
            <h2>Add New Table</h2>
            <form action="" @submit.prevent="submitTableForm" class="w3-form">
                <p>
                    <label for="number">Number</label>
                    <input type="number" name="" id="number" v-model="table.number" class="w3-input w3-border w3-round-large">
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
</template>

<style>
.bg-available {
    background-color: #ffa07a;
}
.bg-occupied {
    background-color: #81c784;
}
.bg-reserved {
    background-color: #c5cae9;
}
.bg-cleaning {
    background-color: #ffe0b2;
}
.rating-stars {
    color: #4c4105;
    font-size: 24px;
}
.rating-stars .fa {
    cursor: pointer;
}
.rating-stars .fa.rated {
    color: #ffcc00;
}
</style>
