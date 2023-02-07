<template>
  <v-container class="login">
    <ErrorAlert ref="ErrorAlert"> </ErrorAlert>
    <v-row class="login"  align="center" justify="center">
      <v-col cols="10" xl=4 lg="4" md="6" sm="6" xs="6">
        <h1 class="mt-9">{{ nombreEmpresa }}</h1>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="username"
            label="Name"
            required
            :rules="inputRules"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            :rules="inputRules"
            required
          ></v-text-field>

          <v-btn
            :disabled="!valid"
            class="mr-4"
            @click="validate"
          >
            Ingresar
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import api from "../boot/axios"
import ErrorAlert from "@/components/ErrorAlert.vue"

export default ({
  data() {
    return {
      // login data
      nombreEmpresa: process.env.VUE_APP_EMPRESA,
      username: "",
      password: "",
      valid: true,
      inputRules: [
        v => !!v || 'Campo requerido required',
      ],
      // errror message
      errorMessage: "",
      errorMessageFlag: false
    }
  },
  methods: { 
    validate () {
      if(this.$refs.form.validate()) this.login();
    },
    login(){ 
      const usuario = {
        usuario: this.username,
        password: this.password
      };
      api.post('login',usuario)
      .then((response) => {
        if(response.status == 200) { 
          window.localStorage.setItem('userAuth', JSON.stringify(response.data));
          if(response.data.permisos.length > 0){
            this.$router.push({path: response.data.permisos[0].url});  
            this.$emit('UserLogin')
          } else { 
            this.$refs.ErrorAlert.showMessage("El usuario no tiene permisos asignados");
          }
        }
      })
      .catch((error) => {
        this.$refs.ErrorAlert.showMessage(error.response.data);
        this.username = "";
        this.password = "";
      });
    },
    // Alertas de Validacion
    errMessage(message){
      this.errorMessage = message;
      this.errorMessageFlag = true;
      setTimeout(() => {
        this.errorMessageFlag = false;
      }, 4000) 
    }
  },
  components: { 
    ErrorAlert
  }
})
</script>

<style scoped>
.login{ 
  height: 100%;
}

</style>
