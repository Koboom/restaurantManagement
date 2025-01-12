import { createRouter, createWebHistory } from "vue-router";

import RestaurantsView from "../views/RestaurantsView.vue";
import RestaurantsOrderView from "../views/RestaurantOrderView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home"
    },
    {
      path: "/restaurants",
      name: "Restaurants",
      component: RestaurantsView
    },
    {
      path: "/restaurantsorder",
      name: "RestaurantsOrder",
      component: RestaurantsOrderView
    },
    {
      path: "/customers",
      name: "Customers",
      component: () => import("../views/CustomersView.vue")
    },
    {
      path: "/customers/:customerId",
      name: "Customer",
      component: () => import("../views/CustomerView.vue")
    },
    {
      path: "/customers/:customerId/orderBookings/:orderBookingId",
      name: "OrderBooking",
      component: () => import("../views/CustomersView.vue")
    },
    {
      path: "/tables",
      name: "Tables",
      component: () => import("../views/TablesView.vue")
    },
    {
      path: "/tables/:tableId",
      name: "Table",
      component: () => import("../views/TableView.vue")
    },
    {
      path: "/waiters",
      name: "Waiters",
      component: () => import("../views/WaitersView.vue")
    },
    {
      path: "/waiters/:waiterId",
      name: "Waiter",
      component: () => import("../views/WaiterView.vue")
    },
    {
      path: "/items",
      name: "Items",
      component: () => import("../views/ItemsView.vue")
    },
    {
      path: "/items/:itemId",
      name: "Item",
      component: () => import("../views/ItemView.vue")
    },
    {
      path: "/kasseDashBoard",
      name: "Kasses",
      component: () => import("../views/KasseDaschboardView.vue")
    }
  ]
})

export default router