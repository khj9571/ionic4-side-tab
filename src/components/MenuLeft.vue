<template>
  <ion-menu type="overlay" side="start" contentId="menu-content">
    
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <!-- <ion-label>START MENU CONTENTS</ion-label> -->
      <el-row class="tac">
        <el-col :span="24">
          <!-- <h5>Custom colors</h5> -->
          <el-menu
            default-active="2"
            :default-openeds="['1']"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            @select="onMenuSelected"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>Navigator One</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-1" :route="{ name:'menu1'}">Menu1</el-menu-item>
                <el-menu-item index="1-2" :route="{ name:'menu2'}">Menu2</el-menu-item>
                <el-menu-item index="1-3" :route="{ name:'menu3'}">Menu3</el-menu-item>
              </el-menu-item-group>

              <!-- <el-menu-item-group title="Group One">
                <el-menu-item index="1-1">item one</el-menu-item>
                <el-menu-item index="1-2">item one</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group Two">
                <el-menu-item index="1-3">item three</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">item four</template>
                <el-menu-item index="1-4-1">item one</el-menu-item>
              </el-submenu> -->
            </el-submenu>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span>Navigator Two</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span>Navigator Three</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-setting"></i>
              <span>Navigator Four</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </ion-content>
  </ion-menu>
</template>


<script>
export default {
  name: "menu-left",
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    onMenuSelected() {
      this.closeStart()
      
    }
  },
};
</script>

<style>
</style>
