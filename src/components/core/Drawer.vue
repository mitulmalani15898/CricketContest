<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    app
    dark
    floating
    persistent
    mobile-break-point="991"
    width="260"
  >
    <v-img height="100%">
      <v-layout
        class="fill-height"
        tag="v-list"
        column
      >
        <v-list-tile avatar>
          <v-list-tile-avatar color="white">
            <v-img
              :src="logo"
              height="40"
              contain
            />
          </v-list-tile-avatar>
          <v-list-tile-title class="title">
            Cricket Contest
          </v-list-tile-title>
        </v-list-tile>
        <v-divider />
        <v-list-tile
          v-for="(link, i) in links"
          :key="i"
          :to="link.to"
          :active-class="color"
          avatar
          class="v-list-item"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title v-text="link.text" />
        </v-list-tile>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapMutations, mapState } from 'vuex'

export default {
  data: () => ({
    logo: './img/cricketLogo.png',
    links: [
      {
        to: '/dashboard',
        icon: 'mdi-view-dashboard',
        text: 'Dashboard'
      },
      {
        to: '/tournament',
        icon: 'mdi-tournament',
        text: 'Tournaments'
      },
      {
        to: '/team',
        icon: 'mdi-account-group',
        text: 'Teams'
      },
      {
        to: '/player',
        icon: 'mdi-account',
        text: 'Players'
      },
      {
        to: '/tournamentTeamPlayer',
        icon: 'mdi-format-size',
        text: 'Tournament Team Players'
      },
      {
        to: '/maps',
        icon: 'mdi-trophy',
        text: 'Tournament Matches'
      },
      {
        to: '/notifications',
        icon: 'mdi-star-circle',
        text: 'Tournament Points'
      },
      {
        to: '/notifications',
        icon: 'mdi-numeric',
        text: 'Match Player Score'
      }
    ],
    responsive: false
  }),
  computed: {
    ...mapState('app', ['image', 'color']),
    inputValue: {
      get () {
        return this.$store.state.app.drawer
      },
      set (val) {
        this.setDrawer(val)
      }
    },
    items () {
      return this.$t('Layout.View.items')
    }
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

<style lang="scss">
#app-drawer {
  .v-list__tile {
    border-radius: 4px;

    &--buy {
      margin-top: auto;
      margin-bottom: 17px;
    }
  }

  .v-image__image--contain {
    top: 0px;
    height: 100%;
  }

  .search-input {
    margin-bottom: 30px !important;
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
