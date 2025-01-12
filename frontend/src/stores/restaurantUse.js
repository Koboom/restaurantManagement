// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from "axios"

// axios.defaults.baseURL = 'http://localhost:3000'//process.env.VUE_APP_API_URL ||process.env.VITE_APP_API_URL || 'cloud url' yada,
const BASE_URL = 'http://localhost:3000'//process.env.VUE_APP_API_URL ||process.env.VITE_APP_API_URL || 'cloud url'

export const useStore = defineStore('restaurantUse', () => {

  async function fetchCustomers() {
    try {
      const response = await axios.get(`${BASE_URL}/customers`)
      return response.data
    } catch (error) {
      console.error("Error fetching customers", error)
      throw error
    }
  }

  async function fetchCustomer(customerId) {
    try {
      const response = await axios.get(`${BASE_URL}/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${customerId}:`, error);
      throw error;
    }
  }

  async function fetchTables() {
    try {
      const response = await axios.get(`${BASE_URL}/tables`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }
  }

  async function fetchWaiters() {
    try {
      const response = await axios.get(`${BASE_URL}/waiters`);
      return response.data;
    } catch (error) {
      console.error('Error fetching waiters:', error);
      throw error;
    }
  }

  async function fetchItems() {
    try {
      const response = await axios.get(`${BASE_URL}/items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  async function updateTable(tableId, tableData) {
    try {
      const response = await axios.put(`${BASE_URL}/tables/${tableId}`, tableData);
      return response.data;
    } catch (error) {
      console.error(`Error updating table ${tableId}:`, error);
      throw error;
    }
  }

  async function fetchOrderBookings() {
    try {
      const response = await axios.get(`${BASE_URL}/orderBookings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Order bookings:', error);
      throw error;
    }
  }

  async function addWaiter(waiterData) {
    try {
      console.log('Sending waiter data:', waiterData); // Gönderilen veriyi kontrol etmek için eklendi
      const response = await axios.post(`${BASE_URL}/waiters`, waiterData);
      console.log("API Response", response) // Yanıtı tam olarak kontrol etmek için eklendi
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error(
          'API Error Response:',
          error.response.data
        );
      } else if (error.request) {
        console.error(
          'No Response:',
          error.request
        );
      } else {
        console.error(
          'Error Message:',
          error.message
        )
      }
      throw error;
    }
  }

  async function fetchWaiter(waiterId) {
    try {
      const response = await axios.get(`${BASE_URL}/waiters/${waiterId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching waiter ${waiterId}:`, error);
      throw error;
    }
  }

  async function updateWaiter(waiterId, waiterData) {
    try {
      const response = await axios.put(`${BASE_URL}/waiters/${waiterId}`, waiterData)
      return response.data
    } catch (error) {
      console.error(`Error updating waiter ${waiterId}:`, error);
      throw error;
    }
  }

  async function deleteFetchWaiter(waiterId) {
    try {
      const response = await axios.delete(`${BASE_URL}/waiters/${waiterId}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting waiter ${waiterId}:`, error);
      throw error;
    }
  }

  async function fetchItems() {
    try {
      const response = await axios.get(`${BASE_URL}/items`);
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  async function fetchItem(itemId) {
    try {
      const response = await axios.get(`${BASE_URL}/items/${itemId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching item ${itemId}:`, error);
      throw error;
    }
  }

  async function updateItem(itemId, itemData) {
    try {
      const response = await axios.put(`${BASE_URL}/items/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      console.error(`Error updating item ${itemId}:`, error);
      throw error;
    }
  }

  async function addItem(itemData) {
    try {
      console.log('Sending item data:', itemData); // Gönderilen veriyi kontrol etmek için eklendi
      const response = await axios.post(`${BASE_URL}/items`, itemData);
      console.log('API Response:', response); // Yanıtı tam olarak kontrol etmek için eklendi
      return response.data; // `response.data`'yı döndürün
    } catch (error) {
      if (error.response) {
        console.error('API Error Response:', error.response.data);
      } else if (error.request) {
        console.error('No Response:', error.request);
      } else {
        console.error('Error Message:', error.message);
      }
      throw error;
    }
  }

  async function deleteFetchItem(itemId){
    try {
      const response = await axios.delete(`${BASE_URL}/items/${itemId}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log("Dlete responce: ", response)
      return response.data
    } catch (error) {
      console.error(`Error deleting item ${itemId}:`, error);
      throw error;
    }
  }

  async function addTable(tableData) {
    try {
      console.log('Sending table data:', tableData); // Gönderilen veriyi kontrol etmek için eklendi
      const response = await axios.post(`${BASE_URL}/tables`, tableData);
      console.log('API Response:', response); // Yanıtı tam olarak kontrol etmek için eklendi
      return response.data; // `response.data`'yı döndürün
    } catch (error) {
      if (error.response) {
        console.error('API Error Response:', error.response.data);
      } else if (error.request) {
        console.error('No Response:', error.request);
      } else {
        console.error('Error Message:', error.message);
      }
      throw error;
    }
  }

  async function fetchTable(tableId) {
    try {
      const response = await axios.get(`${BASE_URL}/tables/${tableId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching  ${tableId}:`, error);
      throw error;
    }
  }

  async function bookOrder({ itemId, customerId, orderStart, orderEnd}) {
    try {
      const response = await axios.post(`${BASE_URL}/customers/${customerId}/orderBookings`, {
        itemId,
        orderStart,
        orderEnd
      });
      return response.data;
    } catch (error) {
      console.error('Error booking order:', error);
      throw error;
    }
  }

  async function addCustomer(customerData) {
    try {
      const response = await axios.post(`${BASE_URL}/customers`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error adding passenger:', error);
      throw error;
    }
  }

  async function deleteFetchCustomer(customerId) {
    try {
      const response = await axios.delete(`${BASE_URL}/customers/${customerId}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting passenger ${customerId}:`, error);
      throw error;
    }
  }




  return {
    fetchCustomers,
    fetchTables,
    fetchWaiters,
    fetchItems,
    updateTable,
    fetchOrderBookings,
    fetchCustomer,
    addWaiter,
    fetchWaiter,
    updateWaiter,
    deleteFetchWaiter,
    fetchItem,
    updateItem,
    addItem,
    deleteFetchItem,
    addTable,
    fetchTable,
    bookOrder,
    addCustomer,
    deleteFetchCustomer
  }
})
