<script>
import { useStore } from '@/stores/restaurantUse';
import { mapActions } from 'pinia';

    export default {
        data() {
            return {
                item: {}
            }
        },
        async mounted() {
            await this.updateAndFetchItem()
        },
        methods: {
            ...mapActions(useStore, ["fetchItem","updateItem"]),
            async updateAndFetchItem() {
                try {
                    this.item = await this.fetchItem(this.$route.params.itemId)

                } catch (e) {
                    console.error("Error fetching item", e)
                }
            }
        }
    }
</script>

<template>
    <div class="w3-container w3-margin-top">
      <router-link class="w3-button w3-green w3-round-large w3-left" to="/items"><i class="fa fa-arrow-left"></i></router-link>
    </div>
    <div class="w3-container">
        <div class="w3-container w3-margin-top">
            <h2>Item Details</h2>
        </div>
        <!-- Large Image -->
        <table class="w3-table w3-bordered  w3-striped w3-hoverable w3-hide-small w3-hide-medium " style="cursor: pointer;">
            <img v-if="item.imageUrl" :src="item.imageUrl" style="width: 300px; " alt="" class="">
            <tbody>
                <tr>
                    <th class="w3-third">Name</th>
                    <td class="w3-twothird">{{ item.name }}</td>
                </tr>
                <tr>
                    <th class="w3-third">Type</th>
                    <td class="w3-twothird">{{ item.type }}</td>
                </tr>
                <tr>
                    <th class="w3-third">Ingredients</th>
                    <td class="w3-twothird">
                        <!-- {{ item.ingredients.map(i => i.name).join(', ') }} -->
                          {{ item.ingredients }}
                    </td>
                </tr>
                <tr>
                    <th class="w3-third">Nutrition (Calories, Fat, Protein, Carbs)</th>
                    <td class="w3-twothird">
                        <!-- {{ item.ingredients.map(i => i.name).join(', ') }} -->
                          <ul class="w3-ul w3-border w3-round-large w3-row">
                            <li v-for="nutrition in item.nutrition" class="w3-col s3">
                                {{ nutrition }}
                            </li>
                          </ul>
                    </td>
                </tr>
                <tr>
                    <th class="w3-third">Available :</th>
                    <td class="w3-twothird">{{ item.available ? 'Yes' : 'No' }}</td>
                </tr>
                <tr>
                    <th class="w3-third">Available Hours:(Start - End)</th>
                    <td class="w3-twothird">
                        <!-- {{ item.ingredients.map(i => i.name).join(', ') }} -->
                          <ul class="w3-ul w3-border w3-round-large w3-row">
                            <li v-for="available in item.availableHours" class="w3-col s3">
                                {{ available }}
                            </li>
                          </ul>
                    </td>
                </tr>
                <tr>
                    <th class="w3-third">Reviews: </th>
                    <td class="w3-twothird">No Reviews</td>
                </tr>
                <tr>
                    <th class="w3-third">Discount:(Percentage-Valid Until)</th>
                    <td class="w3-twothird">
                          <ul class="w3-ul w3-border w3-round-large w3-row">
                            <li v-for="discount in item.discount" class="w3-col s3">
                                {{ discount }}
                            </li>
                          </ul>
                    </td>
                </tr>
                <tr>
                    <th class="w3-third">Price: </th>
                    <td class="w3-twothird">{{ item.price }} EUR</td>
                </tr>
                <tr>
                    <th class="w3-third">Delivery Time: </th>
                    <td class="w3-twothird">{{ item.deliveryTime }} Minutes</td>
                </tr>
                <tr>
                    <th class="w3-third">Description: </th>
                    <td class="w3-twothird">{{ item.description }}</td>
                </tr>
            </tbody>
        </table>




        <!-- Medium Image -->
        <table class="w3-table w3-bordered w3-striped w3-hoverable w3-hide-large w3-hide-small" style="cursor: pointer;">
            <img v-if="item.imageUrl" :src="item.imageUrl" style="width: 250px; " alt="" class="">
            <tbody>
                <tr>
                    <th class="w3-third">Name</th>
                    <td class="w3-twothird">{{ item.name }}</td>
                </tr>
                <tr>
                    <th class="w3-third">Type</th>
                    <td class="w3-twothird">{{ item.type }}</td>
                </tr>
                <tr>
                    <th class="w3-third">Ingredients</th>
                    <td class="w3-twothird">
                        <!-- {{ item.ingredients.map(i => i.name).join(', ') }} -->
                          {{ item.ingredients }}
                    </td>
                </tr>
                <tr>
                    <th class="w3-third">Nutrition (Calories, Fat, Protein, Carbs)</th>
                    <td class="w3-twothird">
                        <!-- {{ item.ingredients.map(i => i.name).join(', ') }} -->
                          <ul class="w3-ul w3-border w3-round-large w3-row">
                            <li v-for="nutrition in item.nutrition" class="w3-col s3">
                                {{ nutrition }}
                            </li>
                          </ul>
                    </td>
                </tr>
                <tr>
                    <th class="w3-third">Available :</th>
                    <td class="w3-twothird">{{ item.available ? 'Yes' : 'No' }}</td>
                </tr>
                <tr>
                    <th class="w3-third">Available Hours:(Start - End)</th>
                    <td class="w3-twothird">
                        <!-- {{ item.ingredients.map(i => i.name).join(', ') }} -->
                          <ul class="w3-ul w3-border w3-round-large w3-row">
                            <li v-for="available in item.availableHours" class="w3-col s3">
                                {{ available }}
                            </li>
                          </ul>
                    </td>
                </tr>
                <tr>
                    <th class="w3-third">Reviews: </th>
                    <td class="w3-twothird">No Reviews</td>
                </tr>
                <tr>
                    <th class="w3-third">Discount:(Percentage-Valid Until)</th>
                    <td class="w3-twothird">
                          <ul class="w3-ul w3-border w3-round-large w3-row">
                            <li v-for="discount in item.discount" class="w3-col s3">
                                {{ discount }}
                            </li>
                          </ul>
                    </td>
                </tr>
                <tr>
                    <th class="w3-third">Price: </th>
                    <td class="w3-twothird">{{ item.price }} EUR</td>
                </tr>
                <tr>
                    <th class="w3-third">Delivery Time: </th>
                    <td class="w3-twothird">{{ item.deliveryTime }} Minutes</td>
                </tr>
                <tr>
                    <th class="w3-third">Description: </th>
                    <td class="w3-twothird">{{ item.description }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Small Image -->
        <table class="w3-table w3-bordered w3-striped w3-hoverable w3-hide-large w3-hide-medium" style="cursor: pointer;">
            <img v-if="item.imageUrl" :src="item.imageUrl" style="width: 200px; " alt="" class="">
            <tbody>
                <tr>
                    <th class="w3-third">Name</th>
                    <td class="w3-twothird">{{ item.name }}</td>
                </tr>
                <tr>
                    <th class="w3-third">Type</th>
                    <td class="w3-twothird">{{ item.type }}</td>
                </tr>
                <tr>
                    <th class="w3-third">Ingredients</th>
                    <td class="w3-twothird">
                        <!-- {{ item.ingredients.map(i => i.name).join(', ') }} -->
                          {{ item.ingredients }}
                    </td>
                </tr>
                <tr>
                    <th class="w3-third">Nutrition (Calories, Fat, Protein, Carbs)</th>
                    <td class="w3-twothird">
                        <!-- {{ item.ingredients.map(i => i.name).join(', ') }} -->
                          <ul class="w3-ul w3-border w3-round-large w3-row">
                            <li v-for="nutrition in item.nutrition" class="w3-col s3">
                                {{ nutrition }}
                            </li>
                          </ul>
                    </td>
                </tr>
                <tr>
                    <th class="w3-third">Available :</th>
                    <td class="w3-twothird">{{ item.available ? 'Yes' : 'No' }}</td>
                </tr>
                <tr>
                    <th class="w3-third">Available Hours:(Start - End)</th>
                    <td class="w3-twothird">
                        <!-- {{ item.ingredients.map(i => i.name).join(', ') }} -->
                          <ul class="w3-ul w3-border w3-round-large w3-row">
                            <li v-for="available in item.availableHours" class="w3-col s3">
                                {{ available }}
                            </li>
                          </ul>
                    </td>
                </tr>
                <tr>
                    <th class="w3-third">Reviews: </th>
                    <td class="w3-twothird">No Reviews</td>
                </tr>
                <tr>
                    <th class="w3-third">Discount:(Percentage-Valid Until)</th>
                    <td class="w3-twothird">
                          <ul class="w3-ul w3-border w3-round-large w3-row">
                            <li v-for="discount in item.discount" class="w3-col s3">
                                {{ discount }}
                            </li>
                          </ul>
                    </td>
                </tr>
                <tr>
                    <th class="w3-third">Price: </th>
                    <td class="w3-twothird">{{ item.price }} EUR</td>
                </tr>
                <tr>
                    <th class="w3-third">Delivery Time: </th>
                    <td class="w3-twothird">{{ item.deliveryTime }} Minutes</td>
                </tr>
                <tr>
                    <th class="w3-third">Description: </th>
                    <td class="w3-twothird">{{ item.description }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>