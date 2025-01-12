<script>
import { useStore } from "@/stores/restaurantUse";
import { mapActions } from "pinia";

export default {
  name: "Customer",
  data() {
    return {
      customer: {},
      error: "",
      tables: [],
      orderBookings: [],
      items: [],
      itemType: "",
      slideIndex: 1,
      selectedFilter: "all",
      searchQuery: "",
      progress: 0,
      isLoading: true,
      orderStart:"",
      order: [],
      payTotal: [],
    };
  },
  computed: {
    totalPrice() {
      if (!this.customer.orderBookings || this.customer.orderBookings.length === 0) {
        return 0;
      }
      return this.customer.orderBookings.reduce((total, orderBooking) => total + (orderBooking.item.price || 0), 0);
    },
    filteredItems() {
      const searchQuery = this.searchQuery.toLowerCase()
      const filterByType = this.selectedFilter === "all" ? this.items : this.items.filter(item => item.type === this.selectedFilter);
      return filterByType.filter(item => item.name.toLowerCase().includes(searchQuery));
    },
    totalPriceByDate() {
      const priceByDate = {} //yeni bir obje oluşturduk


      if (!this.customer.orderBookings || this.customer.orderBookings.length === 0) { // eğer bu müşterinin siparişleri yoksa veya boşsa
        return priceByDate // obö
      }

      this.customer.orderBookings.forEach(orderBooking => {
        const date = new Date(orderBooking.createdAt).toLocaleDateString() // tarihi alip gün/ay/yıl formatına çeviriyorum.
        if (!priceByDate[date]) {
          priceByDate[date] =0
        }
        priceByDate[date]+= orderBooking.item.price || 0
      })
      return priceByDate
    },
  },
  watch: {
    itemType(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.slideIndex = 1;
          this.showDivs(this.slideIndex);
        })
      }
    }
  },
  async mounted() {
    await this.updateCustomer();
    await this.updateTables();
    await this.updateItems();

    const interval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 1;
      }
      else if (this.progress === 100) {
        this.isLoading = false;
      }
      else {
        clearInterval(interval);
      }
    },5)
  },
  methods: {
    ...mapActions(useStore, ["fetchCustomer", "fetchTables", "bookOrder", "fetchItems"]),
    async updateCustomer() {
      try {
        this.customer = await this.fetchCustomer(this.$route.params.customerId);
      } catch (error) {
        console.error("Error fetching customer:", error);
        this.error = "Error fetching customer: " + (error.message || "Unknown error");
      }
    },
    async bookItem({ itemId, customerId, orderStart, orderEnd }) {
      if (!itemId) {
        this.error = "Item ID is required"
        return
      }
      this.error =""
      await this.bookOrder({ itemId, customerId, orderStart, orderEnd })
      this.updateCustomer()
      alert("Item booked successfully")
    },
    async updateTables() {
      try {
        this.tables = await this.fetchTables();
      } catch (error) {
        console.error("Error fetching tables:", error);
        this.error = "Error fetching tables: " + (error.message || "Unknown error");
      }
    },
    async updateItems() {
      try {
        this.items = await this.fetchItems();
      } catch (error) {
        console.error("Error fetching items:", error);
        this.error = "Error fetching items: " + (error.message || "Unknown error");
      }
    },
    filterSelection(type) {
      this.selectedFilter = type
    },
    handleTableClick(table) {
      if (table.status === "Occupied" || table.status === "Reserved") {
        alert("This table is currently occupied or reserved.");
      }
      this.$router.push(`/tables/${table._id}`);
    },
    statusClass(status) {
      switch (status) {
        case "Available":
          return "bg-available";
        case "Occupied":
          return "bg-occupied";
        case "Reserved":
          return "bg-reserved";
        case "Cleaning":
          return "bg-cleaning";
        default:
          return "";
      }
    },
    plusDivs(n) {
      this.showDivs((this.slideIndex += n));
    },
    showDivs(n) {
      if (!this.filteredItems.length) return;

      if (n > this.filteredItems.length) {
        this.slideIndex = 1;
      }
      if (n < 1) {
        this.slideIndex = this.filteredItems.length;
      }

      this.$nextTick(() => {
        this.filteredItems.forEach((item, index) => {
          this.$refs[`slide-${index}`][0].style.display = "none";
        });

        this.$refs[`slide-${this.slideIndex - 1}`][0].style.display = "block";
      });
    },
    pay() {
      this.payTotal.push(this.getTotalPrice)

    },
    getPayTotalPrice(){
      return this.payTotal.reduce((total, item) => total + (item.price || 0))
    }
  },
};
</script>

<template>
  <div class="w3-container">
    <hr>
    <h2 class="w3-center w3-hide-small w3-animate-opacity w3-green w3-round-xxlarge w3-margin-top w3-margin-bottom w3-padding-large">
      Customer Details <span class="w3-right">
        Total Price:
        <span class="w3-tag w3-circle w3-green w3-margin-left">{{ totalPrice }}
          €
        </span>
      </span>
    </h2>
    <h2 class="w3-center w3-hide-large w3-hide-medium w3-animate-opacity w3-green w3-round-xxlarge w3-margin-top w3-margin-bottom w3-padding-large">
      <span>Customer Details</span><span class="w3-right w3-small">
        Total Price:
        <span class="w3-tag w3-circle w3-green w3-margin-left">{{ totalPrice }}
          €
        </span>
      </span>
    </h2>
    <div class="w3-container">
      Willkommen {{ customer.name }}, your email: {{ customer.email }}, phone: {{ customer.phone }}
      <span class="w3-badge w3-orange w3-round-large" v-if="customer.isVIP">{{ customer.isVIP ? "VIP" : "NOT VIP" }}</span>
      <div class="w3-container" style="max-height: 200px; overflow: auto;">
        <h3>Daily Price:</h3>
        <ul class="">
          <li v-for="(total, date) in totalPriceByDate" :key="date">
            {{ date }} <span class="w3-badge w3-green w3-round-large w3-margin-left">{{ total }} €</span>
          </li>
        </ul>
      </div>
    </div>
      <div class="w3-container w3-light-grey w3-margin-bottom w3-padding-large w3-round-large" style="max-height: 200px; overflow: auto;">
        <ol class="">
          <li v-for="orderBooking in customer.orderBookings" :key="orderBooking._id">
            {{ orderBooking.item.name }} <span class="w3-badge w3-green w3-round-large w3-margin-left">{{ orderBooking.item.price }} €</span>
            {{ orderBooking.createdAt }}
          </li>
        </ol>
      </div>
    <br />
    <p class="error" v-if="error">{{ error }}</p>
    <div>

    </div>

    <div class="w3-container" style="background-color: whitesmoke;">
          <h3>Select Item Type</h3>
      <div class="w3-container">
        <button class="w3-button w3-black w3-hover-green" :class="{ 'active' : selectedFilter === 'all' }" @click="filterSelection('all')">Show All</button>
        <button class="w3-button w3-black w3-hover-green" :class="{ 'active' : selectedFilter === 'Dinner' }" @click="filterSelection('Dinner')">Dinner</button>
        <button class="w3-button w3-black w3-hover-green" :class="{ 'active' : selectedFilter === 'Drink' }" @click="filterSelection('Drink')">Drink</button>
        <button class="w3-button w3-black w3-hover-green" :class="{ 'active' : selectedFilter === 'Dessert' }" @click="filterSelection('Dessert')">Dessert</button>
      </div>
      <p> items count: {{ filteredItems.length }}</p>
      <input type="text" placeholder="Search for names..." title="Type in a name" v-model="searchQuery"
      class="w3-input w3-margin-bottom w3-border w3-round-large w3-animate-input" style="width: 30%;"
      >
      <div v-if="isLoading">
        <div id="myBar" class="w3-center w3-padding w3-theme" :style="{ width: progress + '%' }">{{ progress }}% Please wait...</div>
      </div>

      <!-- Large Screen -->
      <div v-else class="w3-animate-opacity w3-row w3-padding w3-margin-bottom" style="overflow: hidden;">
        <div class=" w3-col w3-animate-opacity l3 w3-hide-medium w3-hide-small" v-for="item in filteredItems" :key="item._id" style="overflow: hidden;">
          <div class="w3-border w3-border-light-grey w3-display-container w3-margin" style="height: 300px; background-color: #eee;">
            <div class="w3-display-topmiddle">
              <img v-if="item.imageUrl" :src="item.imageUrl" alt="Item Image" style="width: 350px; height: 250px;">
            </div>
            <div class="">
              <span class="w3-theme-l3 w3-round-large w3-padding-small w3-display-bottomleft">{{ item.name }}</span>
              <span class="w3-theme-l3 w3-round-large w3-padding-small w3-display-bottomright">{{ item.price }} €</span>
            </div>
            <div class="w3-display-topright">
              <button class="w3-button w3-green w3-round-large" @click="bookItem({
                customerId: customer._id,
                itemId: item._id,
                orderStart: new Date().toISOString(),
                orderEnd: new Date(new Date().getTime() + 3600000).toISOString()
              })"
              >
                Order</button>
            </div>
          </div>
        </div>
        <!-- Medium Screen -->
        <div class=" w3-col m4 l3 w3-hide-large w3-hide-small w3-animate-opacity" v-for="item in filteredItems" :key="item._id" style="overflow: hidden;">
          <div class="w3-border w3-border-light-grey w3-display-container w3-margin " style="height: 300px; background-color: #eee;">
            <div class="w3-display-topmiddle" style="height: 300px;">
              <img v-if="item.imageUrl" :src="item.imageUrl" alt="Item Image" style="width: 170px; height: 180px;">
            </div>
            <div class="">
              <span class="w3-theme-l3 w3-small w3-round-large w3-padding-small w3-display-bottomleft">{{ item.name }}</span>
              <span class="w3-theme-l3 w3-small w3-round-large w3-padding-small w3-display-bottomright">{{ item.price }} €</span>
            </div>
            <div class="w3-display-topright">
              <button class="w3-button w3-green w3-round-large"
              @click="bookItem({
                customerId: customer._id,
                itemId: item._id,
                orderStart: new Date().toISOString(),
                orderEnd: new Date(new Date().getTime() + 3600000).toISOString()
              })"
              >Order</button>
            </div>
          </div>
        </div>
        <!-- Small Screen -->
        <div class="w3-col w3-hide-large w3-hide-medium s6" v-for="item in filteredItems" :key="item._id" style="overflow: hidden;">
          <div class="w3-border w3-border-light-grey w3-display-container w3-margin " style="height: 300px; background-color: #eee;">
            <div class="w3-display-topmiddle" style="height: 300px;">
              <img v-if="item.imageUrl" :src="item.imageUrl" alt="Item Image" style="width: 150px; height: 150px;  border-radius: 50%;" class="w3-animate-opacity">
            </div>
            <div class="">
              <span class="w3-theme-l3 w3-small w3-round-large w3-padding-small w3-display-bottomleft">{{ item.name }}</span>
              <span class="w3-theme-l3 w3-small w3-round-large w3-padding-small w3-display-bottomright">{{ item.price }} €</span>
            </div>
            <div class="w3-display-topright">
              <button class="w3-button w3-green w3-round-large"
              @click="bookItem({
                customerId: customer._id,
                itemId: item._id,
                orderStart: new Date().toISOString(),
                orderEnd: new Date(new Date().getTime() + 3600000).toISOString()
              })"
              >Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p>Total Tables: {{ tables.length }}</p>
    <h3>Tables to make a reservation ( Write a name in the note section )</h3>
    <div class="w3-container">
      <ul class="w3-ul">
        <li
          v-for="table in tables.sort((a, b) => a.number - b.number)"
          :key="table._id"
          style="cursor: pointer;"
          class="w3-card-4 w3-hover-opacity w3-round-large w3-col s6 m4 l2"
          @click="handleTableClick(table)"
          :class="statusClass(table.status)"
        >
          <div class="w3-display-container" style="height: 100px;">
            <div class="w3-badge w3-display-topleft">{{ table.number }}</div>
            <div class="w3-display-topright">{{ table.status }}</div>
            <div class="w3-display-middle" v-if="table.reservedUntil">
              {{ table.reservedUntil ? new Date(table.reservedUntil).toLocaleString() : '' }}
            </div>
            <div class="w3-display-topmiddle" v-if="table.isVIP">
              <span class="w3-badge w3-orange w3-round-large">{{ table.isVIP ? "VIP" : "NOT VIP" }}</span>
            </div>
            <div class="w3-display-bottomleft" v-if="table.location">{{ table.location }}</div>
            <div class="w3-display-bottomright w3-theme-l3 w3-round-large w3-padding-small" v-if="table.notes">{{ table.notes }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.error {
  color: red;
  font-weight: bold;
}
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
.mySlides {
  display: none;
}

.w3-button.active {
  background-color: red;
  color: white;
}

</style>
