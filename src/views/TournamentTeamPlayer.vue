<template>
  <v-container fluid>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="blue"
          dark
          class="mb-2"
          v-on="on"
        >
          Add Team Player
        </v-btn>
      </template>
      <v-card>
        <v-form
          ref="form"
          v-model="valid"
        >
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex
                  xs12
                  sm12
                  d-flex
                >
                  <v-select
                    v-model="selectedTournamentId"
                    :items="tournamentNames"
                    label="Select Tournament"
                    :value="tournamentIds"
                    outline
                  />
                </v-flex>
                <template v-if="selectedTournamentId">
                  <v-flex
                    xs12
                    sm12
                    d-flex
                  >
                    <v-select
                      v-model="selectedTournamentTeamId"
                      :items="tournamentTeamNames"
                      label="Select Team"
                      :value="tournamentTeamIds"
                      outline
                    />
                  </v-flex>
                </template>
                <template v-if="selectedTournamentTeamId">
                  <v-flex
                    xs12
                    sm12
                    d-flex
                  >
                    <v-select
                      v-model="selectedPlayers"
                      label="Select Players"
                      outline
                    />
                  </v-flex>
                </template>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              v-if="isUpdate !== 1"
              color="blue"
              :disabled="!valid"
            >
              Submit
            </v-btn>
            <v-btn
              v-if="isUpdate === 1"
              color="blue"
            >
              Update
            </v-btn>
            <v-btn
              color="blue"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="deleteDialog"
      max-width="290"
    >
      <v-card class="text-xs-center dialog-delete">
        <v-card-text>Are you sure you want to delete?</v-card-text>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            flat
          >
            Yes
          </v-btn>
          <v-btn
            color="blue darken-1"
            flat
          >
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      :headers="headers"
      :items="tournaments"
      class="elevation-5 tournamentTable"
    >
      <template v-slot:items="props">
        <td class="text-xs-center">
          <img
            :src="thumbnailPath + props.item.tournamentBanner"
            alt="banner"
          >
        </td>
        <td class="text-xs-center">
          {{ props.item.tournamentName }}
        </td>
        <td class="text-xs-center">
          <v-btn color="blue">
            Show Teams
          </v-btn>
        </td>
      </template>
      <template v-slot:no-data>
        <center>
          <span color="blue">No Data</span>
        </center>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    headers: [
      { text: 'Banner', align: 'center', sortable: false },
      { text: 'Tournament', align: 'center', sortable: false },
      { text: 'Team', align: 'center', sortable: false }
    ],
    valid: true,
    dialog: false,
    deleteDialog: false,
    selectedTournamentId: 0,
    selectedTournamentTeamId: 0,
    selectedPlayers: [],
    isUpdate: 0
  }),

  computed: {
    formTitle () {
      return this.isUpdate === 1 ? 'Update Team Player' : 'Team Player'
    },
    tournaments () {
      return this.$store.state.tournament.tournaments
    },
    tournamentNames () {
      const names = []
      const tournaments = this.$store.state.tournament.tournaments
      tournaments.forEach(tournament => names.push(tournament.tournamentName))
      return names
    },
    tournamentIds () {
      const Ids = []
      const tournaments = this.$store.state.tournament.tournaments
      tournaments.forEach(tournament => Ids.push(tournament.id))
      return Ids
    },
    // tournamentTeamNames () {
    //   const tournament = this.$store.state.tournament.tournaments
    //   // console.log(this.selectedTournamentId)
    //   const selectedTournament = tournament.filter(
    //     tournament => this.selectedTournamentId === tournament.tournamentName
    //   )
    //   console.log(selectedTournament)
    //   // return selectedTournament.Teams
    //   // this.$store.dispatch('tournament/getTournamentById', id)
    // },
    tournamentTeamIds () {
      return ''
    },
    thumbnailPath () {
      return this.$store.state.app.thumbnailPath
    }
  },

  created () {
    this.$store.dispatch('tournament/getTournaments', {
      offset: 0,
      limit: 100,
      column: 'id',
      direction: 'desc'
    })
  },

  methods: {
    //
  }
}
</script>

<style scoped>
.tournamentTable >>> thead {
  background-color: #2c2c2c;
  line-height: 2;
}
.tournamentTable >>> th.column.text-xs-center,
th.column.text-xs-center.sortable:hover {
  font-size: 15px;
  color: white !important;
}
.text-xs-center.dialog-delete >>> .v-card__actions {
  display: block;
}
.v-card__title {
  color: white;
  background-color: #2196f3;
}
.imageUploader {
  height: 130px;
  border: 1px solid black;
}
.imageUploaderDiv {
  text-align: center;
}
.imageUploaderIcon {
  margin: 30px auto;
  display: inline-block;
}
.box {
  position: relative;
  height: 100px;
  width: 100px;
  margin: 15px auto;
}
.icon-error {
  position: absolute;
  right: 5px;
  top: 5px;
  background: rgb(255, 255, 255);
  padding: 2px;
  border-radius: 100%;
  font-size: 14px;
}
</style>
