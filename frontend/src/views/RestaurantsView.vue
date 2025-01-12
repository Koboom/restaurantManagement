<script>
import { useStore } from '@/stores/restaurantUse';
import { mapActions } from 'pinia';

    export default {
        data() {
            return {
                sidebarOpen: false,
                customers: [],
                tables:[],
                waiters: [],
                items: [],
                interval:null,
                lastUpdatedTable: []
            }
        },
        computed: {
            totalCapacity() {
              return this.tables.reduce((total, table) => total + (table.capacity || 0), 0)
            },
            totalEarnings() {
              return this.customers.reduce((total, customer) => {
                return total + this.getTotalPrice(customer)
              }, 0)
            },
            lastCustomer() {
              return this.customers.length > 0 ? this.customers[this.customers.length -1] : null // son kullaniciyi goster
            },
            lastTable(){
              return this.tables.length > 0 ? this.tables[this.tables.length -1] : null
            },
            minutesAgoCustomer() {
              if(this.lastCustomer && this.lastCustomer.createdAt){// son müsteri veya son müsteri oluşturma zamanı
                const createdAt = new Date(this.lastCustomer.createdAt) //son müsteri oluşturma zamanını ata
                const now = new Date() // şimdiki zamanı al
                const deffInMs = now - createdAt // şu an dan oluşturulan zamanı çıkart
                const deffInMinutes = Math.floor(deffInMs / 60000) // saat olarak hesapla
                return deffInMinutes // dön
              }
              return null // yoksa boş dön
            },
            minutesAgoTable() {
              if(this.lastTable && this.lastTable.createdAt){// son müsteri veya son müsteri oluşturma zamanı
                const createdAt = new Date(this.lastTable.createdAt) //son müsteri oluşturma zamanını ata
                const now = new Date() // şimdiki zamanı al
                const deffInMs = now - createdAt // şu an dan oluşturulan zamanı çıkart
                const deffInMinutes = Math.floor(deffInMs / 60000) // saat olarak hesapla
                return deffInMinutes // dön
              }
              return null // yoksa boş dön
            }
        },
        async mounted() {
            await this.loadData()
            this.interval = setInterval(this.loadData, 10000)
        },
        methods: {
            ...mapActions(useStore, ["fetchCustomers","fetchTables","fetchWaiters","fetchItems","updateTable"]),
            async loadData() {
              try {
                //Aynı anda yükleyebileceklerimi paralel olarak çekiyorum.
                const [customers, tables, waiters] = await Promise.all([
                  this.fetchCustomers(),
                  this.fetchTables(),
                  this.fetchWaiters(),
                ])
                this.customers = customers
                this.tables = tables
                this.waiters = waiters
                // item verisini diğerlerinden bağımsız olarak daha sonra yüklesin
                this.items = await this.fetchItems()
              }
              catch (error) {
                console.log("Data Fetch Error", error)
                alert("Data Fetch Error. Please try again later")
              }
            },
            getTotalPrice(customer){
              if (!customer.orderBookings || customer.orderBookings.length === 0) {
                return 0
              }
              return customer.orderBookings.reduce((total, orderBooking) => total + (orderBooking.item.price || 0), 0)
            }
        }
    }
</script>

<template >
  <p class="w3-panel w3-leftbar w3-border-green w3-pale-red w3-round-large">
      Es handelt sich um eine Demoseite.
  </p>
  <div class="">
      <div class="w3-bar w3-black w3-large" style="z-index:4">
          <button class="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-light-grey" @click="sidebarOpen = !sidebarOpen">
              <i class="fa fa-bars"></i>  Menu
          </button>
          <span class="w3-bar-item w3-right">
              Logo
          </span>
      </div>

      <nav class="w3-sidebar w3-collapse w3-white w3-animate-left " style="z-index:3;width:240px;" id="mySidebar"><br>
          <div class="w3-container w3-row">
              <div class="w3-col s4">
                  <img src="../components/icons/icons/avatar2.png" class="w3-circle w3-margin-right" style="width:46px">
              </div>
          <div class="w3-col s8 w3-bar">
          <span>Welcome, <strong>Yüksel</strong></span><br>
              <a href="#" class="w3-bar-item w3-button"><i class="fa fa-envelope"></i></a>
              <a href="#" class="w3-bar-item w3-button"><i class="fa fa-user"></i></a>
              <a href="#" class="w3-bar-item w3-button"><i class="fa fa-cog"></i></a>
          </div>
          </div>
      <hr>
          <div class="w3-container">
              <h5>Dashboard</h5>
          </div>
          <div class="w3-bar-block">
            <a href="#" class="w3-bar-item w3-button w3-padding-16 w3-hide-large w3-dark-grey w3-hover-black" @click="sidebarOpen = !sidebarOpen" title="close menu"><i class="fa fa-remove fa-fw"></i>  Close Menu</a>
            <a href="/restaurantDashboard" class="w3-bar-item w3-button w3-padding w3-blue"><i class="fa fa-users fa-fw"></i>  Overview</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-eye fa-fw"></i>  Views</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-users fa-fw"></i>  Traffic</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-bullseye fa-fw"></i>  Geo</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-diamond fa-fw"></i>  Orders</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-bell fa-fw"></i>  News</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-bank fa-fw"></i>  General</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-history fa-fw"></i>  History</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-cog fa-fw"></i>  Settings</a><br><br>
          </div>
      </nav>

      <!-- small screen sidebar -->
      <nav class="w3-sidebar w3-white w3-animate-left w3-hide-large" style="z-index:3;width:300px;" id="mySidebar" v-show="sidebarOpen"><br>
          <div class="w3-container w3-row">
              <div class="w3-col s4">
                  <img src="../components/icons/icons/avatar2.png" class="w3-circle w3-margin-right" style="width:46px">
              </div>
              <div class="w3-col s8 w3-bar">
                <span>Welcome, <strong>Yüksel</strong></span><br>
                  <a href="#" class="w3-bar-item w3-button"><i class="fa fa-envelope"></i></a>
                  <a href="#" class="w3-bar-item w3-button"><i class="fa fa-user"></i></a>
                  <a href="#" class="w3-bar-item w3-button"><i class="fa fa-cog"></i></a>
              </div>
          </div>
      <hr>
          <div class="w3-container">
              <h5>Dashboard</h5>
          </div>
          <div class="w3-bar-block">
            <a href="#" class="w3-bar-item w3-button w3-padding-16 w3-hide-large w3-dark-grey w3-hover-black" @click="sidebarOpen = !sidebarOpen" title="close menu"><i class="fa fa-remove fa-fw"></i>  Close Menu</a>
            <a href="/restaurantDashboard" class="w3-bar-item w3-button w3-padding w3-blue"><i class="fa fa-users fa-fw"></i>  Overview</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-eye fa-fw"></i>  Views</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-users fa-fw"></i>  Traffic</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-bullseye fa-fw"></i>  Geo</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-diamond fa-fw"></i>  Orders</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-bell fa-fw"></i>  News</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-bank fa-fw"></i>  General</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-history fa-fw"></i>  History</a>
            <a href="#" class="w3-bar-item w3-button w3-padding"><i class="fa fa-cog fa-fw"></i>  Settings</a><br><br>
          </div>
      </nav>

      <div class="w3-overlay w3-hide-large w3-animate-opacity"  style="cursor:pointer" id="myOverlay"></div>

      <div class="">
        <div class=" w3-main w3-brown w3-padding" style="margin-left: 240px;">
        <header class="w3-container" style="padding-top:22px">
          <h5><b><i class="fa fa-dashboard"></i> Dashboard</b></h5>
        </header>
        <div class="w3-row-padding w3-margin-bottom">
          <div class="w3-quarter w3-hover-opacity w3-margin-top">
            <a href="/customers" style="text-decoration: none;">
                <div class="w3-container w3-red w3-padding-16">
              <div class="w3-left"><i class="fa fa-users w3-xxxlarge"></i></div>
              <div class="w3-right">
                <p> {{ customers.length }}</p>
              </div>
              <div class="w3-clear"></div>
              <h4>Customers</h4>
            </div>
            </a>
          </div>
          <div class="w3-quarter w3-hover-opacity w3-margin-top">
           <a href="/tables" style="text-decoration: none;">
            <div class="w3-container w3-blue w3-padding-16">
              <div class="w3-left"><i class="fa fa-laptop w3-xxxlarge"></i></div>
              <div class="w3-right">
                <!-- <h3>{{ tables.length }}</h3> -->
                 <p> {{ tables.length }}</p>
              </div>
              <div class="w3-clear"></div>
              <h4>Table</h4>
            </div>
           </a>
          </div>
          <div class="w3-quarter w3-hover-opacity w3-margin-top">
            <!-- <a href="/passengernew" style="text-decoration: none;"> -->
            <a href="/waiters" style="text-decoration: none;">
              <div class="w3-container w3-teal w3-padding-16">
              <div class="w3-left"><i class="fa fa-user w3-xxxlarge"></i></div>
              <div class="w3-right">
                <p>{{ waiters.length }}</p>
              </div>
              <div class="w3-clear"></div>
              <h4>Waiters</h4>
            </div>
            </a>
          </div>

          <div class="w3-quarter w3-hover-opacity w3-margin-top">
            <a href="/items" style="text-decoration: none;">
              <div class="w3-container w3-orange w3-text-white w3-padding-16" style="text-decoration: none;">
              <div class="w3-left"><i class="fa fa-table w3-xxxlarge"></i></div>
              <div class="w3-right">
                <p>{{ items.length }}</p>
              </div>
              <div class="w3-clear"></div>
              <h4>Items</h4>
            </div>
            </a>
          </div>

          <div class="w3-quarter w3-hover-opacity w3-margin-top">
            <a href="/kasseDashboard" style="text-decoration: none;">
              <div class="w3-container w3-orange w3-text-white w3-padding-16" style="text-decoration: none;">
              <div class="w3-left"><i class="fa fa-eye w3-xxxlarge"></i></div>
              <div class="w3-right">
                <p>{{ totalEarnings }} €</p>
              </div>
              <div class="w3-clear"></div>
              <h4>Kasse</h4>
            </div>
            </a>
          </div>

          <!-- <div class="w3-quarter w3-margin-top w3-hover-opacity">
            <a href="#" style="text-decoration: none;">
              <div class="w3-container w3-orange w3-text-white w3-padding-16" style="text-decoration: none;">
              <div class="w3-left"><i class="fa fa-users w3-xxxlarge"></i></div>
              <div class="w3-right">
                <p>{{ totalEarnings }} €</p>
              </div>
              <div class="w3-clear"></div>
              <h4>Demo</h4>
            </div>
            </a>
          </div> -->

          <!-- <div class="w3-quarter w3-margin-top w3-hover-opacity">
            <a href="#" style="text-decoration: none;">
              <div class="w3-container w3-orange w3-text-white w3-padding-16" style="text-decoration: none;">
              <div class="w3-left"><i class="fa fa-users w3-xxxlarge"></i></div>
              <div class="w3-right">
                <p>{{ totalEarnings }} €</p>
              </div>
              <div class="w3-clear"></div>
              <h4>Demo</h4>
            </div>
            </a>
          </div> -->

          <!-- <div class="w3-quarter w3-margin-top w3-hover-opacity">
            <a href="#" style="text-decoration: none;">
              <div class="w3-container w3-orange w3-text-white w3-padding-16" style="text-decoration: none;">
              <div class="w3-left"><i class="fa fa-users w3-xxxlarge"></i></div>
              <div class="w3-right">
                <p>{{ totalEarnings }} €</p>
              </div>
              <div class="w3-clear"></div>
              <h4>Demo</h4>
            </div>
            </a>
          </div> -->

        </div>
      </div>

      <div class="w3-main w3-margin-top" style="margin-left: 240px;">
        <div class="w3-container">
          <h3>Feeds</h3>
          <table class="w3-table w3-striped w3-white">
            <tbody>
              <tr class="w3-light-grey">
                <td><i class="fa fa-user w3-text-blue w3-large "></i></td>
                <td> New customer</td>
                <td v-if="lastCustomer">
                  <a :href="`/customers/${lastCustomer._id}`" style="text-decoration: none;" class="w3-hover-text-blue">{{ lastCustomer.name }}
                    <span class="w3-badge w3-orange w3-round-large" v-if="lastCustomer.isVIP">{{ lastCustomer.isVIP ? "VIP" : "NOT VIP" }}</span>
                  </a>
                </td>
                <td v-else>Henüz eklenmedi</td>
                <td class="w3-animate-left" v-if="lastCustomer"><i> {{ minutesAgoCustomer }} mins</i></td>
                <td class="w3-animate-left" v-else><i>Henüz eklenmedi</i></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>

  </div>
</template>

<style scoped>
p{
  color: white;
}
</style>