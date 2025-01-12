<script>
  import { useStore } from '@/stores/restaurantUse';
  import { mapActions } from 'pinia';

  export default {
    data() {
      return {
        isLoading:true,
        items: [],
        item: {
          name: "",
          type: "",
          stock: 0,
          ingredients: [],
          nutrition: {
            calories: null,
            fat: null,
            protein: null,
            carbs: null
          },
          available: true,
          availableHours: {
            start: "",
            end: ""
          },
          reviews: [],
          discount: {
            percentage: 0,
            validUntil: ""
          },
          price: 0,
          deliveryTime: null,
          description: "",
          image: null,
          imageUrl: "",
        },
        newIngredient: "",
        searchQuery: "",
        progress:0,
        selectedFilter: "all",
      };
    },
    computed: {
      filteredItems() {
        const searchQuery = this.searchQuery.toLowerCase()
        const filterByType = this.selectedFilter === "all" ? this.items : this.items.filter(item => item.type === this.selectedFilter);
        return filterByType.filter(item => item.name.toLowerCase().includes(searchQuery));
      }
    },
    async mounted() {
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
      ...mapActions(useStore, ["fetchItems", "deleteFetchItem", "addItem"]),
      async updateItems() {
        this.items = await this.fetchItems();
      },
      async deleteItem(itemId) {
        await this.deleteFetchItem(itemId);
        await this.updateItems();
        alert("Item deleted successfully");
      },
      filterSelection(type) {
        this.selectedFilter = type;
      },
      addIngredient() {
        if (this.newIngredient) {
          this.item.ingredients.push(this.newIngredient);
          this.newIngredient = "";
        }
      },
      removeIngredient(index) {
        this.item.ingredients.splice(index, 1);
      },
      handleImageUpload(event) {
        const file = event.target.files[0];
        const supportedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        const maxSizeInMb= 5
        const maxSizeInBytes = maxSizeInMb * 1024 * 1024;

        if (file) {
          console.log('File selected:', file);
          console.log('File type:', file.type);
        }

        if (file && supportedTypes.includes(file.type)) {
          if (file.size > maxSizeInBytes) {
            alert(`File size should not exceed ${maxSizeInMb}`)
            return
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            this.item.imageUrl = e.target.result;
            console.log(" File loaded successfully:",this.item.imageUrl);
          };
          reader.onerror = () => {
            alert("There was an error reading the file. Please try again.");
          };
          reader.readAsDataURL(file);
          this.imageUrl = file;
        } else {
          alert("Please select an image file (.svg, .png, .jpeg, .jpg, .webp).");
        }
      },
      async submitItemForm() {
        try {
          await this.addItem(this.item);
          alert("Item added successfully");
          this.items.push({ ...this.item });
          await this.updateItems();
          this.resetItemForm();
        } catch (error) {
          console.error(error);
        }
      },
      resetItemForm() {
        this.item = {
          name: "",
          type: "",
          stock: 0,
          ingredients: [],
          nutrition: {
            calories: null,
            fat: null,
            protein: null,
            carbs: null
          },
          available: true,
          availableHours: {
            start: "",
            end: ""
          },
          reviews: [],
          discount: {
            percentage: 0,
            validUntil: ""
          },
          price: 0,
          imageUrl: "",
          deliveryTime: null,
          description: ""
        };
        this.newIngredient = "";
      }
    }
  };
  </script>

<template>
    <div class="w3-container w3-margin-top">

      <div class="w3-container w3-half w3-hide-small w3-hide-medium w3-border w3-border-green w3-round-large w3-light-grey w3-round">
        <h2>Items</h2>
        <div class="w3-container">
          <button class="w3-button w3-black w3-hover-green" :class="{ 'active' : selectedFilter === 'all' }" @click="filterSelection('all')">Show All</button>
          <button class="w3-button w3-black w3-hover-green" :class="{ 'active' : selectedFilter === 'Dinner' }" @click="filterSelection('Dinner')">Dinner</button>
          <button class="w3-button w3-black w3-hover-green" :class="{ 'active' : selectedFilter === 'Drink' }" @click="filterSelection('Drink')">Drink</button>
          <button class="w3-button w3-black w3-hover-green" :class="{ 'active' : selectedFilter === 'Dessert' }" @click="filterSelection('Dessert')">Dessert</button>
        </div>
        <p>Items count: {{ filteredItems.length }}</p>
        <input type="text" placeholder="Search for names..." title="Type in a name" v-model="searchQuery"
        class="w3-input w3-margin-bottom w3-border w3-round-large w3-animate-input" style="width: 30%;"
        >
        <div v-if="isLoading">
          <div id="myBar" class="w3-center w3-padding w3-theme" :style="{ width: progress + '%' }">{{ progress }}% Please wait...</div>
        </div>
        <div v-else class="w3-animate-opacity">
          <ol class="w3-ul">
            <li v-for="item in filteredItems.sort((a, b) => a.name.localeCompare(b.name))" :key="item._id" class="w3-border w3-round-xxlarge w3-round w3-card-4 w3-display-container w3-margin-bottom"
              style="height: 105px; ">
              <img v-if="item.imageUrl" :src="item.imageUrl" alt="Item Image" style="width: 96px; height: 96px; margin: 0 10px 0 -40px; border-radius: 50%; background-color: brown">
              <div class="w3-display-bottomleft w3-orange w3-round-large w3-badge filterDiv">
                {{ item.type }}
              </div>
              <a :href="`/items/${item._id}`" class="w3-button w3-green w3-round-large w3-display-middle">{{ item.name }}
              </a>
              <div class="w3-display-bottommiddle w3-orange w3-round-large w3-badge">
                {{ item.price }} €
              </div>
              <button @click="deleteItem(item._id)" class="w3-button w3-round-large w3-display-right"><span class="w3-opacity w3-large">X</span></button>
            </li>
          </ol>
        </div>
      </div>
      <div class="w3-container w3-hide-large w3-border w3-border-green w3-round-large w3-pale-green w3-round">
        <h2>Items</h2>
        <p>Items count: {{ items.length }}</p>
        <div class="">
          <button class="w3-button w3-black w3-hover-green active" :class="{ 'active' : selectedFilter === 'all' }" @click="filterSelection('all')">Show All</button>
          <button class="w3-button w3-black w3-hover-green active" :class="{ 'active' : selectedFilter === 'Dinner' }" @click="filterSelection('Dinner')">Dinner</button>
          <button class="w3-button w3-black w3-hover-green active" :class="{ 'active' : selectedFilter === 'Drink' }" @click="filterSelection('Drink')">Drink</button>
          <button class="w3-button w3-black w3-hover-green active" :class="{ 'active' : selectedFilter === 'Dessert' }" @click="filterSelection('Dessert')">Dessert</button>
        </div><br>
        <input type="text" placeholder="Search for names..." title="Type in a name" name="" id=" " v-model="searchQuery"
        class="w3-input w3-margin-bottom w3-border w3-round-large w3-animate-input" style="width: 40%;">
        <div v-if="isLoading">
          <div id="myBar" class="w3-center w3-padding w3-theme" :style="{ width: progress + '%' }">{{ progress }}% Please wait...</div>
        </div>
        <div v-else class="w3-animate-opacity">
          <ol class="w3-ul">
            <li v-for="item in filteredItems.sort((a, b) => a.name.localeCompare(b.name))" :key="item.id" class="w3-border w3-round-large w3-pale-green w3-round w3-card-4 w3-display-container w3-margin-bottom" style="height: 105px;">
              <img v-if="item.imageUrl" :src="item.imageUrl" alt="Item Image" style="width: 96px; height: 96px; margin: 0 10px 0 -40px; border-radius: 50%; background-color: brown" class="">
              <div class="w3-display-bottomleft w3-orange w3-round-large w3-badge">
                {{ item.type }}
              </div>
              <a :href="`/items/${item._id}`" class="w3-button w3-green w3-round-large w3-display-middle">{{ item.name }}
              </a>
              <div class="w3-display-bottommiddle w3-orange w3-round-large w3-badge">
                {{ item.price }} €
              </div>
              <button @click="deleteItem(item._id)" class="w3-button w3-round-large w3-display-right"><span class="w3-opacity w3-large">X</span></button>
            </li>
        </ol>
        </div>

      </div>

      <div class="w3-container w3-half w3-hide-small w3-hide-medium w3-border w3-border-green w3-round-large w3-light-grey w3-round">
        <h2>Add New Items</h2>

        <form @submit.prevent="submitItemForm" class="w3-form">
          <!--Name-->
          <p>
            <label for="name">Name</label>
            <input type="text" id="name" v-model="item.name" required class="w3-input w3-border w3-round-large">
          </p>

          <!--Type-->
          <div>
            <label for="type">Type</label>
            <select name="type" id="type" v-model="item.type" required class="w3-input w3-border w3-round-large">
              <option disabled value="">Please select a type</option>
              <option value="Dinner">Dinner</option>
              <option value="Drink">Drink</option>
              <option value="Dessert">Dessert</option>
            </select>
          </div>


          <!--Stock-->
          <p>
            <label for="stock">Stock</label>
            <input type="number" id="stock" v-model="item.stock" required class="w3-input w3-border w3-round-large">
          </p>

          <!--Ingredients-->
            <div>
              <label for="ingredients">Ingredients</label>
              <input type="text" id="ingredients" v-model="newIngredient" placeholder="Add ingredient" class="w3-input w3-border w3-round-large">
              <button type="button" @click="addIngredient" class="w3-button w3-green w3-round-large">Add</button>
              <div>
                <ul>
                  <li v-for="(ingredient, index) in item.ingredients" :key="index">
                    {{ ingredient }}
                    <button type="button" @click="removeIngredient(index)" class="w3-button w3-red w3-round-large w3-small">Remove</button>
                  </li>
                </ul>
              </div>
            </div>

          <!--Nutrition-->
          <div>
            <label for="nutrition">Nutrition</label> <br>
            <div class="w3-row">
              <input type="number" id="calories" v-model="item.nutrition.calories" placeholder="Calories" class="w3-input w3-border w3-round-large w3-col s3">
              <input type="number" id="fat" v-model="item.nutrition.fat" placeholder="Fat" class="w3-input w3-border w3-round-large w3-col s3">
              <input type="number" id="protein" v-model="item.nutrition.protein" placeholder="Protein" class="w3-input w3-border w3-round-large w3-col s3">
              <input type="number" id="carbs" v-model="item.nutrition.carbs" placeholder="Carbs" class="w3-input w3-border w3-round-large w3-col s3">
            </div>
          </div>


          <!--Available-->
          <p>
            <label for="available">Available </label>
            <input type="checkbox" id="available" v-model="item.available" class="w3-check">
          </p>

          <!--Available Hours-->
          <p>
            <label for="availableHours">Available Hours</label><br>
            <input type="time" id="start" v-model="item.availableHours.start" placeholder="Start time (e.g., 09:00)" class="w3-input w3-border w3-round-large w3-half">
            <input type="time" id="end" v-model="item.availableHours.end" placeholder="End time (e.g., 18:00)" class="w3-input w3-border w3-round-large w3-half">
          </p>

          <!--Discount-->
          <p>
            <label for="discount">Discount</label><br>
            <input type="number" id="discountPercentage" v-model="item.discount.percentage" placeholder="Discount percentage"  class="w3-input w3-border w3-round-large w3-half">
            <input type="datetime-local" id="discountValidUntil" v-model="item.discount.validUntil" placeholder="Valid until"  class="w3-input w3-border w3-round-large w3-half">
          </p>

          <!--Price-->
          <p>
            <label for="price">Price</label>
            <input type="number" id="price" v-model="item.price" class="w3-input w3-border w3-round-large">
          </p>

          <!-- Image Upload -->

          <p>
            <label for="image">Image</label>
            <input type="file" name="" id="image" class="w3-input w3-border w3-round-large" @change="handleImageUpload" accept="image/*">
          </p>

          <!--Delivery Time-->
          <p>
            <label for="deliveryTime">Delivery Time</label>
            <input type="number" id="deliveryTime" v-model="item.deliveryTime" required class="w3-input w3-border w3-round-large" placeholder="Delivery time in minutes">
          </p>

          <!--Description-->
          <p>
            <label for="description">Description</label>
            <input type="text" id="description" v-model="item.description" required class="w3-input w3-border w3-round-large" placeholder="Description">
          </p>

          <!--Submit Button-->
          <p>
            <button type="submit" class="w3-button w3-green w3-round-large">Submit</button>
          </p>

        </form>

      </div>
      <div class="w3-container w3-hide-large w3-border w3-border-green w3-round-large w3-pale-green w3-round">
        <h2>Add New Items</h2>

        <form @submit.prevent="submitItemForm" class="w3-form">
          <!--Name-->
          <p>
            <label for="name">Name</label>
            <input type="text" id="name" v-model="item.name" required class="w3-input w3-border w3-round-large">
          </p>

          <!--Type-->
          <p>
            <label for="type">Type</label>
            <select name="type" id="type" v-model="item.type" required class="w3-input w3-border w3-round-large">
              <option disabled value="">Please select a type</option>
              <option value="Dinner">Dinner</option>
              <option value="Drink">Drink</option>
              <option value="Dessert">Dessert</option>
            </select>
          </p>

          <!--Stock-->
          <div>
            <label for="stock">Stock</label>
            <input type="number" id="stock" v-model="item.stock" required class="w3-input w3-border w3-round-large">
          </div>


          <!--Ingredients-->
          <div>
            <label for="ingredients">Ingredients</label>
            <input type="text" id="ingredients" v-model="newIngredient" placeholder="Add ingredient" class="w3-input w3-border w3-round-large">
            <button type="button" @click="addIngredient" class="w3-button w3-green w3-round-large">Add</button>
            <ul>
              <li v-for="(ingredient, index) in item.ingredients" :key="index">
                {{ ingredient }}
                <button type="button" @click="removeIngredient(index)" class="w3-button w3-red w3-round-large w3-small">Remove</button>
              </li>
            </ul>
          </div>


          <!--Nutrition-->
          <div>
            <label for="nutrition">Nutrition</label> <br>
            <div class="w3-row">
              <input type="number" id="calories" v-model="item.nutrition.calories" placeholder="Calories" class="w3-input w3-border w3-round-large w3-col s3">
              <input type="number" id="fat" v-model="item.nutrition.fat" placeholder="Fat" class="w3-input w3-border w3-round-large w3-col s3">
              <input type="number" id="protein" v-model="item.nutrition.protein" placeholder="Protein" class="w3-input w3-border w3-round-large w3-col s3">
              <input type="number" id="carbs" v-model="item.nutrition.carbs" placeholder="Carbs" class="w3-input w3-border w3-round-large w3-col s3">
            </div>
          </div>


          <!--Available-->
          <p>
            <label for="available">Available </label>
            <input type="checkbox" id="available" v-model="item.available" class="w3-check">
          </p>

          <!--Available Hours-->
          <p>
            <label for="availableHours">Available Hours</label><br>
            <input type="time" id="start" v-model="item.availableHours.start" placeholder="Start time (e.g., 09:00)" class="w3-input w3-border w3-round-large w3-half">
            <input type="time" id="end" v-model="item.availableHours.end" placeholder="End time (e.g., 18:00)" class="w3-input w3-border w3-round-large w3-half">
          </p>

          <!--Discount-->
          <p>
            <label for="discount">Discount</label><br>
            <input type="number" id="discountPercentage" v-model="item.discount.percentage" placeholder="Discount percentage"  class="w3-input w3-border w3-round-large w3-half">
            <input type="datetime-local" id="discountValidUntil" v-model="item.discount.validUntil" placeholder="Valid until"  class="w3-input w3-border w3-round-large w3-half">
          </p>

          <!--Price-->
          <p>
            <label for="price">Price</label>
            <input type="number" id="price" v-model="item.price" class="w3-input w3-border w3-round-large">
          </p>

          <!-- Image Upload -->

          <p>
            <label for="image">Image</label>
            <input type="file" name="" id="image" class="w3-input w3-border w3-round-large" @change="handleImageUpload" accept="image/*">
          </p>

          <!--Delivery Time-->
          <p>
            <label for="deliveryTime">Delivery Time</label>
            <input type="number" id="deliveryTime" v-model="item.deliveryTime" required class="w3-input w3-border w3-round-large" placeholder="Delivery time in minutes">
          </p>

          <!--Deion-->
          <p>
            <label for="deion">Deion</label>
            <input type="text" id="deion" v-model="item.deion" required class="w3-input w3-border w3-round-large" placeholder="Description">
          </p>

          <!--Submit Button-->
          <p>
            <button type="submit" class="w3-button w3-green w3-round-large">Submit</button>
          </p>

        </form>

      </div>

    </div>
  </template>

  <style scoped>
  .w3-button.active {
    background-color: red;
    color: white;
  }
  </style>
