<template>
  <v-toolbar
    id="core-toolbar"
    flat
    prominent
    style="background:#2c2c2c;"
  >
    <div class="v-toolbar-title">
      <v-toolbar-title class="white--text font-weight-light">
        <v-btn
          v-if="responsive"
          class="default v-btn--simple"
          light
          icon
          @click.stop="onClickBtn"
        >
          <v-icon color="white">
            mdi-view-list
          </v-icon>
        </v-btn>
        {{ title }}
      </v-toolbar-title>
    </div>

    <v-spacer />
    <v-toolbar-items>
      <v-flex
        align-center
        layout
        py-2
      >
        <router-link
          v-ripple
          class="toolbar-items"
          to="/"
        >
          <v-icon color="white">
            mdi-view-dashboard
          </v-icon>
        </router-link>
      </v-flex>
      <v-flex
        align-center
        layout
        py-2
      >
        <v-icon
          color="white"
          @click="logOut"
        >
          mdi-logout
        </v-icon>
      </v-flex>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data: () => ({
    title: null,
    responsive: false
  }),
  watch: {
    $route (to, from) {
      this.title = to.name
    }
  },

  created () {
    this.title = this.$route.name
  },

  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },

  methods: {
    ...mapMutations('app', ['setDrawer', 'toggleDrawer']),
    onClickBtn () {
      this.setDrawer(!this.$store.state.app.drawer)
    },
    logOut () {
      this.$store.dispatch('logout')
    },
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    }
  }
}
</script>

<style>
#core-toolbar a {
  text-decoration: none;
}
</style>
