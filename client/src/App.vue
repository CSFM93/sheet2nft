<template>
  <v-app>
    <component v-bind:is="layout">
      <router-view></router-view>
    </component>
  </v-app>
</template>



<script>
export default {
  name: "Home",
  computed: {
    layout() {
      //  console.log("meta", this.$route.meta.layout);
      return this.$route.meta.layout;
    },
  },
  created() {
    this.$vuetify.theme.light = true;
  },
  methods: {
    navigateTo(route) {
      if (this.$route.name !== route) {
        this.$router.push({ name: "login" }).catch((error) => {
          //  console.log(error);
        });
      }
    },
  },
};
</script>
