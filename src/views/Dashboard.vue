<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout wrap>
      <v-flex
        md12
        sm12
        lg12
      >
        <v-parallax
          src="./img/backgroundTheme.jpg"
        />
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <material-stats-card
          color="green"
          icon="mdi-trophy-variant"
          title="Tournaments"
          value="4"
          sub-icon="mdi-trophy-variant"
          sub-text="Last 24 Hours"
        />
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <material-stats-card
          color="orange"
          icon="mdi-account-group"
          title="Teams"
          value="12"
          sub-icon="mdi-account-group"
          sub-text="Get More Space..."
        />
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <material-stats-card
          color="red"
          icon="mdi-run"
          title="Players"
          value="25"
          sub-icon="mdi-run"
          sub-text="Tracked from Github"
        />
      </v-flex>
      <v-flex
        sm6
        xs12
        md6
        lg3
      >
        <material-stats-card
          color="info"
          icon="mdi-account"
          title="Users"
          value="25"
          sub-icon="mdi-account"
          sub-text="Just Updated"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {}
}
</script>
