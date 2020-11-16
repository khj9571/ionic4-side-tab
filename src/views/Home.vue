<template>
  <div class="ion-page" main>
    <ion-header>
      <ion-toolbar>
        <span @click="openStart" slot="start">
          <MdMenuIcon w="40px" h="40px" />
        </span>
        <ion-title>Menu - Basic</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button @click="openStart">Open Start Menu</ion-button>
      <ion-button @click="openEnd">Open End Menu</ion-button>
      <ion-icon @click="onClick" name="call-outline"></ion-icon>
    </ion-content>
  </div>
</template>

<script>
// import { map } from "ionicons/icons";
// import { addIcons } from "ionicons";
// addIcons({
//   "ios-map": map.ios,
//   "md-map": map.md
// });

import AlertIcon from "vue-ionicons/dist/ios-alert.vue";
import MdMenuIcon from "vue-ionicons/dist/md-menu.vue";
export default {
  components: {
    AlertIcon,
    MdMenuIcon,
  },
  methods: {
    onClick() {
      alert("a");
    },

    openStart() {
      document.querySelector("ion-menu-controller").open("start");
    },
    openEnd() {
      document.querySelector("ion-menu-controller").open("end");
    },
  },
};
</script>