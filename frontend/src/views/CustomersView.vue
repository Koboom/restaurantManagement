<script>
import { useStore } from '@/stores/restaurantUse';
import { mapActions } from 'pinia';

export default {
    name: 'Restaurant',
    data() {
        return {
            customers: [],
            name: "",
            email: "",
            phone: "",
            isVIP: false,
            vipCount: 0,
            nonVipCount: 0,
            searchQuery:"",
            isLoading:true,
            progress:0
        }
    },
    computed: {
        filteredCustomers() {
            if(!this.searchQuery) {
                return this.customers
            }
            return this.customers.filter(customer =>
                customer.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            )
        }
    },
    async mounted() {
        await this.updateCustomers();
        const interval = setInterval(() => {
            if (this.progress <100) {
                this.progress +=1
            } else if (this.progress ===100){
                this.isLoading = false
            } else {
                clearInterval(interval)
            }
        })
        this.loadGoogleCharts();
    },
    methods: {
        ...mapActions(useStore, ["fetchCustomers", "addCustomer", "deleteFetchCustomer"]),
        async updateCustomers() {
            try {
                this.customers = await this.fetchCustomers();
                this.updateVipCounts();
            } catch (error) {
                console.error("Customer konnten nicht aktualisiert werden:", error);
                alert('Customer konnten nicht aktualisiert werden. Bitte versuchen Sie es später noch einmal.');
            }
        },
        async updateVipCounts() {
            this.vipCount = this.customers.filter(customer => customer.isVIP).length;
            this.nonVipCount = this.customers.length - this.vipCount;
            // this.drawChart();
        },
        async deleteCustomers(customerId) {
            await this.deleteFetchCustomer(customerId);
            await this.updateCustomers();
            alert("Customer deleted successfully");
        },
        async addNewCustomer() {
            if (!this.name || !this.email || !this.phone) {
                alert("Bitte alle Felder ausfüllen");
                return;
            }
            try {
                await this.addCustomer({
                    name: this.name,
                    email: this.email,
                    phone: this.phone,
                    isVIP: this.isVIP
                });
                this.name = "";
                this.email = "";
                this.phone = "";
                this.isVIP = false;
                await this.updateCustomers();
            } catch (error) {
                console.error("Customer konnten nicht hinzugefügt werden:", error);
                alert('Customer konnten nicht hinzugefügt werden. Bitte versuchen Sie es später noch einmal.');
            }
        },
        async loadGoogleCharts() {
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(this.drawChart);
        },
        // async drawChart() {
        //     const data = google.visualization.arrayToDataTable([
        //         ['Task', 'Count'],
        //         ['VIP', this.vipCount],
        //         ['Non-VIP', this.nonVipCount]
        //     ]);
        //     const options = {
        //         title: 'VIP vs Non-VIP Customers',
        //         width: 550,
        //         height: 300
        //     };
        //     const chart = new google.visualization.PieChart(document.getElementById('piechart'));
        //     chart.draw(data, options);
        // }
    },
    watch: {
        customers() {
            this.updateVipCounts();
        }
    }
};
</script>

<template>
    <div class="w3-container w3-animate-opacity w3-padding-32">
        <!-- <div class="w3-containe w3-border w3-border-green w3-round-large" id="piechart" style="width: 700px; height: 400px;"></div> -->
        <div class="w3-container w3-half w3-border w3-border-green w3-round-large w3-light-grey w3-round">
            <h2>Customers</h2>
            <p class="w3-light-green w3-margin-bottom w3-padding w3-round-large">Customers: {{ customers.length }}</p>
            <input type="text" placeholder="Search for names..." title="Type in a name" v-model="searchQuery"
            class="w3-input w3-margin-bottom w3-border w3-round-large w3-animate-input" style="width: 30%;"
            >
            <div v-if="isLoading">
                <div id="myBar" class="w3-center w3-padding w3-theme" :style="{ width: progress + '%' }">{{ progress }}% Please wait...</div>
            </div>
            <div v-else>
                <ol class="w3-ul">
                    <li class="" v-for="customer in filteredCustomers.sort((a, b) => a.name.localeCompare(b.name))" :key="customer.id">
                        <a class="w3-button" :href="`/customers/${customer._id}`">{{ customer.name }} <span class="w3-badge w3-orange w3-round-large" v-if="customer.isVIP">{{ customer.isVIP ? "VIP" : "NOT VIP" }}</span> </a>
                        <button class="w3-button w3-red w3-round-large w3-right w3-small" @click="deleteCustomers(customer._id)">Delete</button>
                    </li>
                </ol>
            </div>
        </div>
        <div class="w3-container w3-half w3-border w3-border-green w3-round-large w3-light-grey w3-round">
            <h2>New Customer</h2>
            <p>
                <label for="name"></label>
                <input class="w3-input" type="text" id="name" v-model="name" placeholder="Name eingeben..." required>
            </p>
            <p>
                <label for="email"></label>
                <input class="w3-input" type="text" id="email" v-model="email" placeholder="Email eingeben..." required>
            </p>
            <p>
                <label for="phone"></label>
                <input class="w3-input" type="text" id="phone" v-model="phone" placeholder="Phone eingeben..." required>
            </p>
            <p>
                <label for="isVIP">VIP</label> <input type="checkbox" id="isVIP" v-model="isVIP">
            </p>
            <button @click="addNewCustomer" class="w3-button w3-green w3-round-large">New Customer</button>
        </div>

    </div>

</template>

<style></style>