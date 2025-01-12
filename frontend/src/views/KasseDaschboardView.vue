<script>
    import { useStore } from '@/stores/restaurantUse';
    import { mapActions } from 'pinia';

    export default {
        name: "KasseView",
        data(){
            return {
                customers: [],
                totalEarnings: 0
            }
        },
        async mounted() {
            await this.updateCustomers(),
            this.interval = setInterval(async () => {
                await this.updateCustomers()
            },5000)
        },
        beforeDestroy() {
            clearInterval(this.interval)
        },
        computed: {
            totalEarnings() {
                return this.customers.reduce((total, customer) => {
                    return total + this.getTotalPrice(customer)
                }, 0)
            },
            totalEarningsPerDay(){
                return this.customers.reduce((earnings, customer) => {
                    if(customer.orderBookings && customer.orderBookings.length > 0) {
                        customer.orderBookings.forEach(orderBooking => {
                            const orderDate = new Date(orderBooking.createdAt).toLocaleDateString() // Tarihi gün/ay/yıl formatında alıyorum
                            const price = orderBooking.item.price || 0
                            if (!earnings[orderDate]) {
                                earnings[orderDate] = 0
                            }
                            earnings[orderDate] +=price
                        })
                    }
                    return earnings
                }, {})
            },
            totalEarningsPerMonth(){
                return this.customers.reduce((earnings, customer) => {
                    if ( customer.orderBookings && customer.orderBookings.length > 0) {
                        customer.orderBookings.forEach(orderBooking => {
                            const orderMonth = new Date(orderBooking.createdAt).toLocaleDateString('default', { year: 'numeric', month: 'long'})
                            const price = orderBooking.item.price || 0
                            if (!earnings[orderMonth]) {
                                earnings[orderMonth] = 0
                            }
                            earnings[orderMonth] += price
                        })
                    }
                    return earnings
                }, {})
            },
            totalEarningsPerYear(){
                return this.customers.reduce((earnings, customer) => {
                    if ( customer.orderBookings && customer.orderBookings.length > 0) {
                        customer.orderBookings.forEach(orderBooking => {
                            const orderYear = new Date(orderBooking.createdAt).getFullYear() // Yılı
                            const price = orderBooking.item.price || 0
                            if (!earnings[orderYear]) {
                                earnings[orderYear] = 0
                            }
                            earnings[orderYear] +=price
                        })
                        return earnings
                    }
                }, {})
            }
        },
        methods: {
            ...mapActions(useStore, ["fetchCustomers"]),
            async updateCustomers() {
                try  {
                    this.customers = await this.fetchCustomers()
                } catch (error) {
                    console.error("Customers konnten nicht aktualisiert werden", error)
                    alert('Customers konnten nicht aktualisiert werden. Bitte versuchen Sie es später noch einmal.')
                }
            },
            getTotalPrice(customer) {
                if (!customer.orderBookings || customer.orderBookings.lenght === 0) {
                    return 0
                }
                return customer.orderBookings.reduce((total, orderBooking) => total + (orderBooking.item.price || 0), 0)
            }
        }
    }

</script>

<template>

    <div class="w3-container w3-margin-top">
        <h2 class="w3-center w3-green w3-round-xxlarge w3-margin-top w3-margin-bottom w3-padding-large">
            <span>Kasse</span><span class="w3-hide-small w3-animate-opacity"> Details</span> <span class="w3-right">
            Total <span class="w3-hide-small w3-animate-opacity"> Price:</span><span class="w3-tag w3-circle w3-green w3-margin-left">{{ totalEarnings }} €</span>
        </span>
        </h2>
    </div>
    <div class="w3-container">
        <div class="w3-container w3-col l4 m6 s12" style="max-height: 300px; overflow: auto;">
            <h3>Daily Earnings: </h3>
            <ul class="w3-ul">
                <li v-for="(earnings, date) in totalEarningsPerDay" :key="date">
                    <span class="w3-light-grey w3-padding w3-round-large w3-margin-right"> {{ date }}</span>
                    <span class="w3-badge w3-green w3-round-large w3-margin-left">{{ earnings }} €</span>
                </li>
            </ul>
        </div>
        <div class="w3-container w3-col l4 m6 s12">
            <h3>Monthly Earnings: </h3>
            <ul class="w3-ul">
                <li v-for="(earnings, month) in totalEarningsPerMonth" :key="month">
                    <span class="w3-light-grey w3-padding w3-round-large w3-margin-right"> {{ month }}</span>
                    <span class="w3-badge w3-green w3-round-large w3-margin-left">{{ earnings }} €</span>
                </li>
            </ul>
        </div>
        <div class="w3-container w3-col l4 m6 s12">
            <h3>Yearly Earnings: </h3>
            <ul class="w3-ul">
                <li v-for="(earnings, year) in totalEarningsPerYear" :key="year">
                    <span class="w3-light-grey w3-padding w3-round-large w3-margin-right"> {{ year }}</span>
                    <span class="w3-badge w3-green w3-round-large w3-margin-left">{{ earnings }} €</span>
                </li>
            </ul>
        </div>
    </div>
</template>