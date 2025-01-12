<script>
import { useStore} from '@/stores/restaurantUse'
import { mapActions } from 'pinia'

    export default {
        data() {
            return {
                customers: [],
                allOrderBookings: []
            }
        },
        async mounted() {
            await this.updateCustomers()
        },
        computed: {
            totalOrderBookings() {
                return this.customers.reduce((total, customer) => total + customer.orderBookings.length, 0)
            }
        },
        methods: {
            ...mapActions(useStore, ['fetchCustomers']),
            async updateCustomers() {
                this.customers = await this.fetchCustomers()
                this.allOrderBookings = this.customers.reduce((orderBookings, customer) => orderBookings.concat(customer.orderBookings), [])
            }
        }
    }
</script>

<template>
    <div class="w3-container">
        <p class="w3-panel w3-leftbar w3-border-green w3-pale-red w3-round-large">
            Es handelt sich um eine Demoseite.
        </p>
        <hr>
        <div>
            <router-link class="w3-button w3-green w3-round-large" to="/restaurantDashboard">Home</router-link>
        </div>

        <p class="w3-panel w3-leftbar w3-padding-large w3-border-green w3-round w3-pale-red w3-round-large">Anzahl der Bestellungen: {{ totalOrderBookings }}</p>
        <div class="w3-container">
        <h3>All Order Bookings</h3>
        {{ allOrderBookings }}
    </div>
    </div>
</template>