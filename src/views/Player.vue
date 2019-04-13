<template>
  <v-container fluid>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <template v-slot:activator="{ on }">
        <v-btn color="blue" dark class="mb-2" v-on="on">Add Player</v-btn>
      </template>
      <v-card>
        <v-form ref="form" v-model="valid">
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md6>
                  <v-text-field
                    label="First Name"
                    :rules="firstNameRules"
                    v-model="firstName"
                    outline
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field label="Last Name" :rules="lastNameRules" v-model="lastName" outline></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-menu
                    v-model="datePicker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template slot="activator">
                      <v-text-field
                        v-model="dob"
                        :rules="dobRules"
                        label="Date of Birth"
                        outline
                        readonly
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      color="primary"
                      v-model="dob"
                      @input="datePicker = false"
                      class="dob"
                    ></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-radio-group v-model="gender" label="Gender : " row>
                    <v-radio label="Male" color="blue" value="1"></v-radio>
                    <v-radio label="Female" color="blue" value="2"></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    outline
                    auto-grow
                    rows="1"
                    :rules="descriptionRules"
                    name="input-7-3"
                    v-model="description"
                    label="Player Description"
                  ></v-textarea>
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
            <v-btn color="blue" :disabled="!valid" v-if="isUpdate !== 1" @click="addPlayer">Submit</v-btn>
            <v-btn color="blue" v-if="isUpdate === 1" @click="updatePlayer">Update</v-btn>
            <v-btn color="blue" @click="resetPlayerDialog">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card class="text-xs-center dialog-delete">
        <v-card-text>Are you sure you want to delete?</v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="deletePlayer">Yes</v-btn>
          <v-btn color="blue darken-1" flat @click="deleteDialog = false;deletePlayerId = 0;">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table :headers="headers" :items="players" class="elevation-5 tournamentTable">
      <template v-slot:items="props">
        <td class="text-xs-center">
          <img :src="thumbnailPath + props.item.playerImage" alt>
        </td>
        <td class="text-xs-center">{{ props.item.firstName +" "+ props.item.lastName }}</td>
        <td class="text-xs-center">{{ getAge(props.item.dob)}}</td>
        <td class="text-xs-center">{{ props.item.gender === 1 ? 'Male' : 'Female' }}</td>
        <td class="text-xs-center">{{ props.item.description }}</td>
        <td class="text-xs-center">
          <v-icon @click.stop="updatePlayerDialog(props.item)">mdi-square-edit-outline</v-icon>
          <v-icon @click.stop="deletePlayerDialog(props.item.id)">mdi-trash-can-outline</v-icon>
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
      { text: "Avatar", align: "center", sortable: false },
      { text: "Name", align: "center", sortable: false },
      { text: "Age", align: "center", sortable: false },
      { text: "Gender", align: "center", sortable: false },
      { text: "Description", align: "center", sortable: false },
      { text: "Actions", align: "center", sortable: false }
    ],
    valid: true,
    dialog: false,
    deleteDialog: false,
    firstName: "",
    lastName: "",
    dob: "",
    gender: "1",
    description: "",
    playerImage: "",
    deletePlayerId: 0,
    selectedPlayer: {},
    imagePath: "",
    imageFile: "",
    fileError: "",
    isUpdate: 0,
    datePicker: false,
    firstNameRules: [v => !!v || "First Name is required"],
    dobRules: [v => !!v || "Date of Birth is required"],
    lastNameRules: [v => !!v || "Last Name is required"],
    descriptionRules: [v => !!v || "Description is required"]
  }),

  created() {
    this.$store.dispatch("player/getPlayers", {
      offset: 0,
      limit: 100,
      column: "id",
      direction: "desc"
    });
  },

  computed: {
    formTitle() {
      return this.isUpdate === 1 ? "Update Player" : "Player";
    },
    players() {
      return this.$store.state.player.players;
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

    addPlayer() {
      if (this.$refs.form.validate()) {
        let formData = new FormData();
        formData.append("firstName", this.firstName);
        formData.append("lastName", this.lastName);
        formData.append("gender", this.gender);
        formData.append("dob", this.dob);
        formData.append("description", this.description);
        if (this.imageFile) {
          formData.append("playerImage", this.imageFile);
        }
        this.$store.dispatch("player/postPlayer", {
          formData,
          offset: 0,
          limit: 100,
          column: "id",
          direction: "desc"
        });
        this.resetPlayerDialog();
      }
    },

    deletePlayerDialog(id) {
      this.deletePlayerId = id;
      this.deleteDialog = true;
    },

    deletePlayer() {
      let id = this.deletePlayerId;
      this.$store.dispatch("player/deletePlayer", {
        id,
        offset: 0,
        limit: 100,
        column: "id",
        direction: "desc"
      });
      this.deleteDialog = false;
    },

    updatePlayerDialog(item) {
      this.isUpdate = 1;
      this.selectedPlayer = item;
      this.firstName = item.firstName;
      this.lastName = item.lastName;
      this.dob = item.dob;
      this.description = item.description;
      this.gender = item.gender.toString();
      this.playerImage = item.playerImage;
      if (item.playerImage !== "defaultPlayerImage.png") {
        this.imagePath = this.thumbnailPath + item.playerImage;
      }
      this.dialog = true;
    },

    updatePlayer() {
      if (this.$refs.form.validate()) {
        let formData = new FormData();
        formData.append("firstName", this.firstName);
        formData.append("lastName", this.lastName);
        formData.append("description", this.description);
        formData.append("dob", this.dob);
        formData.append("gender", this.gender);
        if (this.imagePath === "") {
          formData.append("playerImage", "defaultPlayerImage.png");
        } else if (this.imageFile) {
          formData.append("playerImage", this.imageFile);
        } else {
          formData.append("playerImage", this.playerImage);
        }
        let id = this.selectedPlayer.id;
        this.$store.dispatch("player/putPlayer", {
          id,
          formData,
          offset: 0,
          limit: 100,
          column: "id",
          direction: "desc"
        });
        this.resetPlayerDialog();
      }
    },

    resetPlayerDialog() {
      this.firstName = "";
      this.lastName = "";
      this.description = "";
      this.dob = "";
      this.imagePath = "";
      this.imageFile = "";
      this.isUpdate = 0;
      this.selectedPlayer = {};
      this.$refs.form.reset();
      this.dialog = false;
    },

    deleteImage() {
      this.imagePath = "";
      this.imageFile = "";
    },

    getAge(dob) {
      var birthdate = new Date(dob);
      var current = new Date();
      var diff = current - birthdate; // This is the difference in milliseconds
      return Math.floor(diff / 31557600000);
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
.dob >>> .v-btn__content {
  color: black;
}
.dob >>> .v-btn.primary {
  background-color: #2196f3 !important;
  left: 10px;
  top: 5px;
  border-radius: 50%;
}
.dob >>> .v-btn--outline {
  border: none;
}
</style>