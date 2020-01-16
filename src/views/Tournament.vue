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
          Add Tournament
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
              <v-layout
                row
                wrap
              >
                <v-flex
                  xs12
                  sm12
                  md12
                >
                  <v-text-field
                    v-model="tournamentName"
                    label="Tournament Name"
                    :rules="nameRules"
                    outline
                  />
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    v-model="tournamentDescription"
                    outline
                    auto-grow
                    rows="1"
                    name="input-7-3"
                    label="Tournament Description"
                    :rules="descriptionRules"
                  />
                </v-flex>
                <v-flex xs12>
                  <v-card class="imageUploader">
                    <div
                      v-if="!imagePath"
                      class="imageUploaderDiv"
                    >
                      <v-icon
                        x-large
                        class="imageUploaderIcon"
                        @click="pickFile"
                      >
                        mdi-image-plus
                      </v-icon>
                      <input
                        ref="image"
                        type="file"
                        accept="image/*"
                        style="display: none"
                        @change="filePicked"
                      >
                      <div
                        v-if="fileError"
                        class="error"
                      >
                        *{{ fileError }}
                      </div>
                    </div>
                    <div
                      v-else
                      class="imageUploaderDiv"
                    >
                      <div class="box">
                        <v-icon
                          class="icon-error"
                          @click="deleteImage"
                        >
                          mdi-close
                        </v-icon>
                        <img
                          :src="imagePath"
                          style="height: 100px; width: 100px"
                        >
                      </div>
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              v-if="isUpdate !== 1"
              color="blue"
              :disabled="!valid"
              @click="addTournament"
            >
              Submit
            </v-btn>
            <v-btn
              v-if="isUpdate === 1"
              color="blue"
              @click="updateTournament"
            >
              Update
            </v-btn>
            <v-btn
              color="blue"
              @click="resetTournamentDialog"
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
            @click="deleteTournament"
          >
            Yes
          </v-btn>
          <v-btn
            color="blue darken-1"
            flat
            @click="deleteDialog = false;deleteTournamentId = 0;"
          >
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="teamDialog"
      persistent
      scrollable
      max-width="450"
    >
      <v-card>
        <v-card-title
          color="blue"
        >
          <span class="headline">{{ selectedTournament.tournamentName }}</span>
        </v-card-title>
        <v-card-text>
          <div v-if="teams && !teams.length">
            <center>
              <span class="headline">No teams found in {{ selectedTournament.tournamentName }}</span>
            </center>
          </div>
          <v-card-actions style="justify-content: flex-end">
            <v-btn
              color="blue"
              @click="addTeamDialog"
            >
              Add Teams
            </v-btn>
          </v-card-actions>
          <div v-if="teams && teams.length">
            <v-checkbox
              v-model="selectAll"
              color="blue"
              :label="selectAll ? 'Deselect All' : 'Select All'"
              :indeterminate.sync="example"
              @change="select"
            />
            <v-card style="padding-bottom: 20px; border: 1px solid black">
              <v-list-tile
                v-for="team in teams"
                :key="team.id"
              >
                <v-list-tile-content>
                  <v-checkbox
                    :key="team.id"
                    v-model="selectedTeamsIdsToDelete"
                    outline
                    color="blue"
                    :label="team.teamName"
                    :value="team.id"
                  />
                </v-list-tile-content>
              </v-list-tile>
            </v-card>
          </div>
          <hr>
          <v-card-actions>
            <v-spacer />
            <v-btn
              v-if="selectedTeamsIdsToDelete && selectedTeamsIdsToDelete.length"
              color="red"
              dark
              @click="deleteTeams"
            >
              Delete
              <v-icon right>
                mdi-trash-can-outline
              </v-icon>
            </v-btn>
            <v-btn
              color="blue"
              @click="teamDialog=false;"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="addTeamsDialog"
      persistent
      scrollable
      max-width="450"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ selectedTournament.tournamentName }}</span>
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedTeamsIdsToAdd"
            outline
            label="Select Teams"
            :items="teamsToAdd"
            item-text="teamName"
            item-value="id"
            chips
            deletable-chips
            multiple
          />
        </v-card-text>
        <v-card-actions style="justify-content: flex-end">
          <v-btn
            color="blue"
            :disabled="!selectedTeamsIdsToAdd.length"
            @click="addTeams"
          >
            Add
          </v-btn>
          <v-btn
            color="blue"
            @click="addTeamsDialog = false; teamDialog = true; selectedTeamsIdsToAdd = []"
          >
            Cancel
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
          {{ props.item.tournamentDescription }}
        </td>
        <td class="text-xs-center">
          <v-btn
            color="blue"
            @click="showTeamDialog(props.item)"
          >
            Teams
          </v-btn>
        </td>
        <td class="text-xs-center">
          <v-icon @click="updateTournamentDialog(props.item)">
            mdi-square-edit-outline
          </v-icon>
          <v-icon @click.stop="deleteTournamentDialog(props.item.id)">
            mdi-trash-can-outline
          </v-icon>
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
import _ from 'lodash'

export default {
  data: () => ({
    headers: [
      { text: 'Banner', align: 'center', sortable: false },
      { text: 'Tournament', align: 'center', sortable: false },
      { text: 'Description', align: 'center', sortable: false },
      { text: 'Teams', align: 'center', sortable: false },
      { text: 'Actions', align: 'center', sortable: false }
    ],
    valid: true,
    dialog: false,
    deleteDialog: false,
    teamDialog: false,
    addTeamsDialog: false,
    tournamentName: '',
    tournamentDescription: '',
    tournamentBanner: '',
    deleteTournamentId: 0,
    selectedTournament: {},
    imagePath: '',
    imageFile: '',
    fileError: '',
    isUpdate: 0,
    teams: [],
    teamsToAdd: [],
    selectedTeamsIdsToDelete: [],
    selectedTeamsIdsToAdd: [],
    selectAll: false,
    example: false,
    nameRules: [v => !!v || 'Tournament name is required'],
    descriptionRules: [v => !!v || 'Tournament Description is required']
  }),

  computed: {
    formTitle () {
      return this.isUpdate === 1 ? 'Update Tournament' : 'Tournament'
    },
    tournaments () {
      return this.$store.state.tournament.tournaments
    },
    allTeams () {
      return this.$store.state.team.allTeams
    },
    tournamentTeams () {
      return this.$store.state.tournamentTeam.tournamentTeams
    },
    thumbnailPath () {
      return this.$store.state.app.thumbnailPath
    }
  },

  watch: {
    tournamentTeams (val) {
      this.teams = this.tournamentTeams.length
        ? this.tournamentTeams.filter(team => !team.TournamentTeam.isDelete)
        : []
    },

    selectedTeamsIdsToDelete (value) {
      // this example is false when all selected or all not selected , true otherwise
      if (
        this.selectedTeamsIdsToDelete &&
        this.selectedTeamsIdsToDelete.length
      ) {
        if (this.selectedTeamsIdsToDelete.length === this.teams.length) {
          this.example = false
          this.selectAll = true
        } else {
          this.example = true
        }
      } else {
        this.example = false
        this.selectAll = false
      }
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
    pickFile () {
      this.$refs.image.click()
    },

    filePicked (event) {
      const files = event.target.files
      // console.log(files)
      if (files[0]) {
        if (files[0].type.split('/')[0] === 'image') {
          const fr = new FileReader()
          fr.readAsDataURL(files[0])
          fr.addEventListener('load', () => {
            this.imagePath = fr.result
            this.imageFile = files[0]
          })
        } else {
          this.$refs.image.value = ''
          this.fileError = 'Please choose image only'
        }
      }
    },

    addTournament () {
      if (this.$refs.form.validate()) {
        const formData = new FormData()
        formData.append('tournamentName', this.tournamentName)
        formData.append('tournamentDescription', this.tournamentDescription)
        if (this.imageFile) {
          formData.append('tournamentBanner', this.imageFile)
        }
        // for (var value of formData.values()) {
        //   console.log(value)
        // }
        this.$store.dispatch('tournament/postTournament', {
          formData,
          offset: 0,
          limit: 100,
          column: 'id',
          direction: 'desc'
        })
        this.resetTournamentDialog()
      }
    },

    updateTournamentDialog (item) {
      this.isUpdate = 1
      this.selectedTournament = item
      this.tournamentName = item.tournamentName
      this.tournamentDescription = item.tournamentDescription
      this.tournamentBanner = item.tournamentBanner
      if (item.tournamentBanner !== 'defaultTournament.png') {
        this.imagePath = this.thumbnailPath + item.tournamentBanner
      }
      this.dialog = true
    },

    updateTournament () {
      if (this.$refs.form.validate()) {
        const formData = new FormData()
        formData.append('tournamentName', this.tournamentName)
        formData.append('tournamentDescription', this.tournamentDescription)
        if (this.imagePath === '') {
          formData.append('tournamentBanner', 'defaultTournament.png')
        } else if (this.imageFile) {
          formData.append('tournamentBanner', this.imageFile)
        } else {
          formData.append('tournamentBanner', this.tournamentBanner)
        }
        const id = this.selectedTournament.id
        this.$store.dispatch('tournament/putTournament', {
          id,
          formData,
          offset: 0,
          limit: 100,
          column: 'id',
          direction: 'desc'
        })
        this.resetTournamentDialog()
      }
    },

    deleteTournamentDialog (id) {
      this.deleteDialog = true
      this.deleteTournamentId = id
    },

    deleteTournament () {
      const id = this.deleteTournamentId
      this.$store.dispatch('tournament/deleteTournament', {
        id,
        offset: 0,
        limit: 100,
        column: 'id',
        direction: 'desc'
      })
      this.deleteDialog = false
    },

    resetTournamentDialog () {
      this.tournamentName = ''
      this.tournamentDescription = ''
      this.imageFile = ''
      this.imagePath = ''
      this.isUpdate = 0
      this.selectedTournament = {}
      this.$refs.form.reset()
      this.dialog = false
    },

    deleteImage () {
      this.imagePath = ''
      this.imageFile = ''
    },

    showTeamDialog (item) {
      this.$store.commit('tournamentTeam/setTournamentTeams', item.Teams)
      this.$store.dispatch('team/getAllTeams')
      this.selectedTournament = item
      this.teamDialog = true
    },

    select () {
      this.selectedTeamsIdsToDelete = []
      if (this.selectAll) {
        this.teams.forEach(team => this.selectedTeamsIdsToDelete.push(team.id))
      }
    },

    addTeamDialog () {
      this.selectedTeamsIdsToAdd = []
      this.teamDialog = false
      this.addTeamsDialog = true
      this.teamsToAdd = _.differenceBy(this.allTeams, this.teams, 'id')
    },

    addTeams () {
      this.$store.dispatch('tournamentTeam/postTournamentTeam', {
        tournamentId: this.selectedTournament.id,
        teamIds: this.selectedTeamsIdsToAdd,
        offset: 0,
        limit: 100,
        column: 'id',
        direction: 'desc'
      })
      this.selectedTeamsIdsToAdd = []
      this.addTeamsDialog = false
      this.teamDialog = true
    },

    deleteTeams () {
      this.$store.dispatch('tournamentTeam/deleteTournamentTeam', {
        tournamentId: this.selectedTournament.id,
        teamIds: this.selectedTeamsIdsToDelete,
        offset: 0,
        limit: 100,
        column: 'id',
        direction: 'desc'
      })
      this.selectedTeamsIdsToDelete = []
      this.teamDialog = false
      this.addTeamsDialog = false
    }
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
.error {
  background-color: transparent !important;
  color: red;
  font-size: 14px;
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
  background: white;
  padding: 2px;
  border-radius: 100%;
  font-size: 14px;
}
</style>
