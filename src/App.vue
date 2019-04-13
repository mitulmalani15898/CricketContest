<template>
  <v-app>
    <core-toolbar v-if="!isAuthPage"/>
    <core-drawer v-if="!isAuthPage"/>
    <core-view/>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      isAuthPage: true
    };
  },
  watch: {
    $route(to) {
      if (to.path === "/login" || to.path === "/signup") {
        this.isAuthPage = true;
      } else {
        this.isAuthPage = false;
      }
    }
  }
};
</script>


<style lang="scss">
@import "@/styles/index.scss";

/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
</style>
