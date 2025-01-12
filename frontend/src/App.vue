<script>

</script>

<template>
  <p class="w3-panel w3-leftbar w3-border-green w3-pale-red w3-round-large">
    Es handelt sich um eine einfache Vue.js-Anwendung, die die Funktionalität eines Restaurants veranschaulicht.
  </p>
  <div id="app">
    <div>
      <h1 class="w3-light-grey w3-center w3-padding-32">Vue.js Restaurant Daschboard - Order System</h1>
      <div class="w3-bar">
        <router-link to="/" class="w3-button w3-green w3-round-large w3-bar-item">home</router-link>
        <router-link to="/restaurants" class="w3-button w3-green w3-round-large w3-bar-item">Restaurant Daschboard</router-link>
        <router-link to="/restaurantsOrder" class="w3-button w3-green w3-round-large w3-bar-item">Restaurant Order</router-link>
      </div>

    </div>
    <div class="w3-container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style></style>