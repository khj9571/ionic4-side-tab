<template>
  <div id="app">
    <ion-app>
      <menu-left/>
      <ion-vue-router id="menu-content" main />
    </ion-app>
    <ion-menu-controller></ion-menu-controller>
  </div>
</template>

<script>
import MenuLeft from "@/components/MenuLeft"

export default {
  name: "app",
  components:{
    MenuLeft
  }
};
</script>

<style lang="sass" scoped>

</style>