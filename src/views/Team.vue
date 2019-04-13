<template>
  <v-container fluid>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <template v-slot:activator="{ on }">
        <v-btn color="blue" dark class="mb-2" v-on="on">Add Team</v-btn>
      </template>
      <v-card>
        <v-form ref="form" v-model="valid">
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field label="Team Name" v-model="teamName" :rules="nameRules" outline></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-card class="imageUploader">
                    <div class="imageUploaderDiv" v-if="!imagePath">
                      <v-icon x-large class="imageUploaderIcon" @click="pickFile">mdi-image-plus</v-icon>
                      <input
                        type="file"
                        ref="image"
                        accept="image/*"
                        @change="filePicked"
                        style="display: none"
                      >
                      <div class="error" v-if="fileError">*{{ fileError }}</div>
                    </div>
                    <div class="imageUploaderDiv" v-else>
                      <div class="box">
                        <v-icon class="icon-error" @click="deleteImage">mdi-close</v-icon>
                        <img :src="imagePath" style="height: 100px; width: 100px">
                      </div>
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue" :disabled="!valid" v-if="isUpdate !== 1" @click="addTeam">Submit</v-btn>
            <v-btn color="blue" v-if="isUpdate === 1" @click="updateTeam">Update</v-btn>
            <v-btn color="blue" @click="resetTeamDialog">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card class="text-xs-center dialog-delete">
        <v-card-text>Are you sure you want to delete?</v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="deleteTeam">Yes</v-btn>
          <v-btn color="blue darken-1" flat @click="deleteDialog = false;deleteTeamId = 0;">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table :headers="headers" :items="teams" class="elevation-5 tournamentTable">
      <template v-slot:items="props">
        <td class="text-xs-center">
          <img :src="thumbnailPath+props.item.teamLogo" alt>
        </td>
        <td class="text-xs-center">{{ props.item.teamName }}</td>
        <td class="text-xs-center">
          <v-icon @click="updateTeamDialog(props.item)">mdi-square-edit-outline</v-icon>
          <v-icon @click.stop="deleteTeamDialog(props.item.id)">mdi-trash-can-outline</v-icon>
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
import axios from "axios";
export default {
  data: () => ({
    headers: [
      { text: "Logo", align: "center", sortable: false },
      { text: "Team", align: "center", sortable: false },
      { text: "Actions", align: "center", sortable: false }
    ],
    valid: true,
    dialog: false,
    deleteDialog: false,
    teamName: "",
    teamLogo: "",
    deleteTeamId: 0,
    selectedTeam: {},
    imagePath: "",
    imageFile: "",
    fileError: "",
    isUpdate: 0,
    nameRules: [v => !!v || "Team name is required"]
  }),

  created() {
    this.$store.dispatch("team/getTeams", {
      offset: 0,
      limit: 100,
      column: "id",
      direction: "desc"
    });
  },

  computed: {
    formTitle() {
      return this.isUpdate === 1 ? "Update Team" : "Team";
    },
    teams() {
      return this.$store.state.team.teams;
    },
    thumbnailPath() {
      return this.$store.state.app.thumbnailPath;
    }
  },

  methods: {
    pickFile() {
      this.$refs.image.click();
    },

    filePicked(event) {
      const files = event.target.files;
      // console.log(files)
      if (files[0]) {
        if (files[0].type.split("/")[0] === "image") {
          const fr = new FileReader();
          fr.readAsDataURL(files[0]);
          fr.addEventListener("load", () => {
            this.imagePath = fr.result;
            this.imageFile = files[0];
          });
        } else {
          this.$refs.image.value = "";
          this.fileError = "Please choose image only";
        }
      }
    },

    addTeam() {
      if (this.$refs.form.validate()) {
        let formData = new FormData();
        formData.append("teamName", this.teamName);
        if (this.imageFile) {
          formData.append("teamLogo", this.imageFile);
        }
        // for (var value of formData.values()) {
        //   console.log(value);
        // }
        this.$store.dispatch("team/postTeam", {
          formData,
          offset: 0,
          limit: 100,
          column: "id",
          direction: "desc"
        });
        this.resetTeamDialog();
      }
    },

    deleteTeamDialog(id) {
      this.deleteDialog = true;
      this.deleteTeamId = id;
    },

    deleteTeam() {
      let id = this.deleteTeamId;
      this.$store.dispatch("team/deleteTeam", {
        id,
        offset: 0,
        limit: 100,
        column: "id",
        direction: "desc"
      });
      this.deleteDialog = false;
    },

    updateTeamDialog(item) {
      this.isUpdate = 1;
      this.selectedTeam = item;
      this.teamName = item.teamName;
      this.teamLogo = item.teamLogo;
      if (item.teamLogo !== "defaultTeamLogo.png") {
        this.imagePath = this.thumbnailPath + item.teamLogo;
      }
      this.dialog = true;
    },

    updateTeam() {
      if (this.$refs.form.validate()) {
        let formData = new FormData();
        formData.append("teamName", this.teamName);
        if (this.imagePath === "") {
          formData.append("teamLogo", "defaultTeamLogo.png");
        } else if (this.imageFile) {
          formData.append("teamLogo", this.imageFile);
        } else {
          formData.append("teamLogo", this.teamLogo);
        }
        let id = this.selectedTeam.id;
        this.$store.dispatch("team/putTeam", {
          id,
          formData,
          offset: 0,
          limit: 100,
          column: "id",
          direction: "desc"
        });
        this.resetTeamDialog();
      }
    },

    resetTeamDialog() {
      this.teamName = "";
      this.imageFile = "";
      this.imagePath = "";
      this.isUpdate = 0;
      this.selectedTeam = {};
      this.$refs.form.reset();
      this.dialog = false;
    },

    deleteImage() {
      this.imagePath = "";
      this.imageFile = "";
    }
  }
};
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
  background: white;
  padding: 2px;
  border-radius: 100%;
  font-size: 14px;
}
</style>
