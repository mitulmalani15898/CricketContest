<template>
  <div class="main">
    <div class="login-box">
      <h2>Register</h2>
      <form @submit.prevent="signUp">
        <div class="textbox">
          <center>
            <div
              v-if="authError"
              style="color:red; font-size:15px; margin-bottom:10px;"
            >{{authError}}</div>
          </center>
          <input
            type="text"
            placeholder="First Name"
            name="fname"
            v-model="user.firstname"
            @input="validateInputs"
          >
        </div>
        <center>
          <span v-if="errors.firstnameValid" style="color:red; font-size:15px;">{{errors.firstname}}</span>
        </center>
        <div class="textbox">
          <input
            type="text"
            placeholder="Last Name"
            name="lname"
            v-model="user.lastname"
            @input="validateInputs"
          >
        </div>
        <center>
          <span v-if="errors.lastnameValid" style="color:red; font-size:15px;">{{errors.lastname}}</span>
        </center>
        <div>
          <div class="custom-control-inline">
            <input
              type="radio"
              name="gender"
              value="1"
              class="custom-control-input"
              v-model="user.gender"
            >
            <span>Male</span>
          </div>
          <div class="custom-control-inline">
            <input
              type="radio"
              name="gender"
              value="2"
              class="custom-control-input"
              v-model="user.gender"
            >
            <span>Female</span>
          </div>
        </div>
        <div class="textbox">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            v-model="user.email"
            @input="validateInputs"
          >
        </div>
        <center>
          <span v-if="errors.emailValid" style="color:red; font-size:15px;">{{errors.email}}</span>
        </center>
        <div class="textbox">
          <input
            type="password"
            name="password"
            placeholder="Password"
            v-model="user.password"
            @input="validateInputs"
          >
        </div>
        <center>
          <span v-if="errors.passwordValid" style="color:red; font-size:15px;">{{errors.password}}</span>
        </center>
        <div class="textbox">
          <input
            type="password"
            placeholder="Confirm Password"
            name="cpassword"
            v-model="user.cpassword"
            @input="validateInputs"
          >
        </div>
        <center>
          <span v-if="errors.cpasswordValid" style="color:red; font-size:15px;">{{errors.cpassword}}</span>
        </center>
        <input type="submit" class="btn" value="Register">
      </form>
      <center>Already registered?
        <router-link style="color:#2196f3;" to="/login">Login</router-link>
      </center>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      user: {
        firstname: "",
        lastname: "",
        gender: 1,
        email: "",
        password: "",
        cpassword: ""
      },
      errors: {
        firstname: "",
        firstnameValid: false,
        lastname: "",
        lastnameValid: false,
        email: "",
        emailValid: false,
        password: "",
        passwordValid: false,
        cpassword: "",
        cpasswordValid: false
      }
    };
  },

  computed: {
    authError() {
      return this.$store.state.authError;
    }
  },

  methods: {
    validateInputs(event) {
      let name = event.target.name;
      let value = event.target.value;
      if (name === "fname") {
        if (!value.match(/^[a-zA-Z]+$/)) {
          this.errors.firstname = "Only Characters are allowed.";
          this.errors.firstnameValid = true;
        } else {
          this.errors.firstname = "";
          this.errors.firstnameValid = false;
        }
      }
      if (name === "lname") {
        if (!value.match(/^[a-zA-Z]+$/)) {
          this.errors.lastname = "Only Characters are allowed.";
          this.errors.lastnameValid = true;
        } else {
          this.errors.lastname = "";
          this.errors.lastnameValid = false;
        }
      }
      if (name === "email") {
        if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
          this.errors.email = "Please Provide Valid Email Address.";
          this.errors.emailValid = true;
        } else {
          this.errors.email = "";
          this.errors.emailValid = false;
        }
      }
      if (name === "password") {
        if (
          !value.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
        ) {
          this.errors.password =
            "Password Must Contain at least 1 number and 1 special Character.";
          this.errors.passwordValid = true;
        } else {
          if (value.length < 6) {
            this.errors.password =
              "Password should contain minimum 6 characters.";
            this.errors.passwordValid = true;
          } else {
            this.errors.password = "";
            this.errors.passwordValid = false;
          }
        }
      }
      if (name === "cpassword") {
        if (value !== this.user.password) {
          //check here
          this.errors.cpassword = "Password and Confirm Password Must be Same.";
          this.errors.cpasswordValid = true;
        } else {
          this.errors.cpassword = "";
          this.errors.cpasswordValid = false;
        }
      }
    },

    signUp() {
      if (this.user.firstname === "") {
        this.errors.firstname = "Please Fill up First Name.";
        this.errors.firstnameValid = true;
        return;
      }
      if (this.user.lastname === "") {
        this.errors.lastname = "Please Fill up Last Name.";
        this.errors.lastnameValid = true;
        return;
      }
      if (this.user.email === "") {
        this.errors.email = "Please Fill up Email Address.";
        this.errors.emailValid = true;
        return;
      }
      if (this.user.password === "") {
        this.errors.password = "Please Fill up Password.";
        this.errors.passwordValid = true;
        return;
      }
      if (this.user.cpassword === "") {
        this.errors.cpassword = "Please Fill up Confirm Password.";
        this.errors.cpasswordValid = true;
        return;
      }
      if (this.user.password !== this.user.cpassword) {
        this.errors.cpassword = "Password and Confirm Password Must be Same.";
        this.errors.cpasswordValid = true;
        return;
      }
      if (
        this.errors.firstname === "" &&
        this.errors.lastname === "" &&
        this.errors.email === "" &&
        this.errors.password === "" &&
        this.errors.cpassword === ""
      ) {
        let user = {
          firstName: this.user.firstname,
          lastName: this.user.lastname,
          gender: this.user.gender,
          email: this.user.email,
          password: this.user.password
        };
        this.$store.dispatch("register", user);
      }
    }
  }
};
</script>

<style>
.main {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-size: cover;
}
.login-box {
  width: 405px;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  border: 3px solid #2196f3;
  padding: 2rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 0.5rem 0.5rem rgba(0, 0, 0, 0.1);
}
.login-box h2 {
  float: left;
  font-size: 40px;
  border-bottom: 6px solid #2196f3;
  margin-bottom: 30px;
  padding: 0;
}
.custom-control-inline {
  display: inline;
  margin-left: 10px;
}
span {
  font-size: 18px;
  margin: 0 10px;
  color: #6d7175;
}
.textbox {
  width: 100%;
  overflow: hidden;
  font-size: 20px;
  padding: 8px 0;
  margin: 8px 0;
  border-bottom: 1px solid #2196f3;
}
.textbox input {
  border: none;
  outline: none;
  background: none;
  font-size: 18px;
  width: 80%;
  float: left;
  margin: 0 10px;
}
.btn {
  width: 100%;
  background: #2196f3;
  border: 2px solid #2196f3;
  padding: 5px;
  font-size: 18px;
  margin: 12px 0;
}
</style>
