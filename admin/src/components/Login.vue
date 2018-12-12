
<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-10">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Welcome to "The Dashboard"</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-img :src="require('@/assets/logo.png')" height="100" contain></v-img>
              <v-card-text>
                <v-form v-model="valid">
                  <v-text-field
                    prepend-icon="person"
                    v-model="login.email"
                    label="E-mail"
                    :rules="emailRules"
                    required
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="lock"
                    v-model="login.password"
                    name="password"
                    label="Password"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="auth" :disabled="!valid">Login</v-btn>
              </v-card-actions>
            </v-card>
            <div class="loading-overlay" v-if="loading">
              <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
            </div>
            <v-snackbar v-model="operationReturned" left>{{response}}</v-snackbar>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
const axios = require("axios");


export default {
  name: "Login",
  data() {
    return {
      loading: false,
      response: null,
      operationStatus: null,
      operationReturned: false,
      valid: false,
      login: {
        email: "",
        password: ""
      },
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ]
    };
  },
  methods: {
    auth() {
      this.loading = true;
      this.response = null;
      this.operationStatus = null;
      const serverUrl =
        process.env.NODE_ENV === "production"
          ? "/auth"
          : "http://localhost:3030/auth";
      axios
        .get(serverUrl, {
          params: {
            user: this.login.email,
            password: this.login.password
          }
        })
        .then(
          response => {
            this.operationReturned = true;
            this.loading = false;
            if (response.status == 200) {
              this.$store.dispatch('setCredentials', {user: this.login.email, pass: this.login.password})
              this.$router.push("/dashboard");
            } else {
              this.operationStatus = "failure";
              this.response = response;
            }
          },
          err => {
            this.loading = false;
            this.operationReturned = true;
            this.operationStatus = "failure";
            if (err.response && err.response.status === 403) {
              this.response = 'Wrong credentials';
            } else {
              this.response = `Error. Did you run admin/server.js? ${err.toString()}`;
            }
          }
        );
    }
  }
};
</script>

<style lang="scss">
.loading-overlay {
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>