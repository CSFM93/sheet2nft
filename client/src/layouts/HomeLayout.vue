<template>
  <div>
    <v-app-bar app color="white" flat>
      <v-toolbar-title
        @click="navigateTo('home')"
        class="primary--text"
        style="cursor: pointer"
        >Sheet2NFT</v-toolbar-title
      >
      <v-spacer></v-spacer>

      <div class="">
        <template v-if="isAuthenticated">
          <v-row>
            <p class="mt-2 mr-5">
              {{ ethAddress.substring(0, 4) }}...{{
                ethAddress.substring(37, 41)
              }}
            </p>
            <v-btn
              class="mr-5"
              plain
              @click="navigateTo('projects')"
              color="primary"
              >Projects</v-btn
            >
            <v-btn @click="logout" plain color="error">Sign out</v-btn>
          </v-row>
        </template>
        <template v-else>
          <v-btn
            @click="login"
            color="primary"
            :disabled="btnLoginLoading"
            :loading="btnLoginLoading"
            >Sign in</v-btn
          >
        </template>
      </div>
    </v-app-bar>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col>
            <slot />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-snackbar v-model="snackbar" :timeout="timeout" :color="snackbarColor">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-footer app flat height="55px" class="justify-end">
      <span>&copy; {{ new Date().getFullYear() }}</span>
      <span class="ml-4"> Powered by</span>
      <span
        class="ml-10"
        style="cursor: pointer"
        @click="openLink('https://www.google.com/sheets/about/')"
      >
        <img height="40px" src="/assets/images/googleSheets.jpeg"
      /></span>
      <span
        class="ml-10"
        style="cursor: pointer"
        @click="openLink('https://chain.link/')"
      >
        <img height="40px" src="/assets/images/chainlink.png"
      /></span>
      <span
        class="ml-10"
        style="cursor: pointer"
        @click="openLink('https://moralis.io/')"
      >
        <img height="40px" src="/assets/images/moralis.jpeg"
      /></span>
      <span
        class="ml-10"
        style="cursor: pointer"
        @click="openLink('https://web3.storage/')"
      >
        <img height="40px" src="/assets/images/web3storage.png"
      /></span>
    </v-footer>
  </div>
</template>

<script>
import { bus } from "../main";

import Moralis from "moralis";
export default {
  components: {},
  computed: {},

  created() {
    //  console.log("route this", this.$route.name);
    this.initialize();

    bus.$on("showNotification", (data) => {
      //  console.log(data);
      this.showNotification(data);
    });
  },
  data: () => ({
    drawer: null,
    routes: [
      { path: "home", title: "Dashboard", icon: "mdi-view-dashboard" },
      { path: "projects", title: "Projects", icon: "mdi-cog" },
      { path: "collections", title: "Collections", icon: "mdi-cog" },
      { path: "settings", title: "Settings", icon: "mdi-cog" },
    ],
    user: {},
    btnLoginLoading: false,
    isAuthenticated: false,
    ethAddress: "",
    snackbar: false,
    timeout: 2000,
    snackbarText: "",
    snackbarColor: "",
  }),

  methods: {
    navigateTo(route) {
      if (this.$route.name !== route) {
        this.$router.push({ name: route }).catch((error) => {
          //  console.log(error);
        });
      }
    },
    setUser(payload) {
      this.$store.commit("setUser", payload);
      // this.isAuthenticated =  true ;
      // //  console.log('isauth', this.isAuthenticated)
    },
    async login() {
      this.btnLoginLoading = true;
      //  console.log("is auth", this.isAuthenticated);
      const user = await Moralis.Web3.authenticate();
      this.setUser(user);
      this.ethAddress = user.get("ethAddress");
      this.isAuthenticated = Object.keys(user).length > 0;
      this.showNotification(["Login sucessfull", "success", 3000]);
      this.btnLoginLoading = true;
    },

    async logout() {
      await Moralis.User.logOut();
      this.isAuthenticated = false;
      this.setUser({});
      this.showNotification(["Logout sucessfull", "success", 3000]);
    },

    handleCurrentUser() {
      const user = Moralis.User.current();
      this.ethAddress = user.get("ethAddress");

      if (user) {
        this.setUser(user);
      }
    },
    async initialize() {
      this.user = await this.$store.state.user;
      this.isAuthenticated = Object.keys(this.user).length > 0;
      if (this.isAuthenticated) {
        this.handleCurrentUser();
      } else {
        //  console.log("user is not authenticated");
      }
      //  console.log("user: ", this.$store.state.user);
      //  console.log("user: ", this.isAuthenticated);
      //  console.log("ethAddress: ", this.ethAddress);
    },
    openLink(url) {
      window.open(url, "_blank");
    },
    showNotification(data) {
      this.snackbarText = data[0];
      this.snackbarColor = data[1];
      this.timeout = data[2];
      this.snackbar = true;
    },
  },
};
</script>
