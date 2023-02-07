<template>
  <v-app id="inspire">

    <ErrorAlert ref="ErrorAlert"> </ErrorAlert>

    <v-app-bar
      app
      color="black"
      dark
    >
      <div class="d-flex align-center" @click.stop="drawer = !drawer">
        <v-icon >mdi-menu</v-icon>
        <h2 class="ml-5"> {{ nombreEmpresa }} </h2>
      </div>

      <v-spacer></v-spacer>

      <v-btn @click="logout" text>
        <v-icon >mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      absolute
      temporary
    > 
      <v-sheet
        color="lighten-4"
        class="pa-4"
      >
      
      <!-- <v-img alt="Ayote Logo" class="shrink mr-2" contain src="../../public/proa_logo_completo.jpeg" transition="scale-transition" width="50" /> -->
      <h4 class="mt-10"> {{nombreUsuario}} </h4>
      </v-sheet>

      <v-divider></v-divider>

      <!-- Listado de procesos -->
      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.id"
          link
          class="itemLink"
          :to="link.url"
        >
          <v-list-item-icon >
            <v-icon>{{ link.icono }}</v-icon>
          </v-list-item-icon>

          <router-link :to="link.url" class="link"> {{ link.nombre }} </router-link>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- vista de menu principal -->
    <v-main>
      <v-container
        class="py-8 px-6"
        fluid
      >
        <v-row> 
          <v-col>
            <router-view/>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import api from "../boot/axios"
import ErrorAlert from "@/components/ErrorAlert.vue"

  export default {
    data () {
      return { 
        nombreEmpresa: process.env.VUE_APP_EMPRESA,
        nombreUsuario: '',
        drawer: true,
        links: []
      }
    }, 
    methods: {
      cargarProcesos(){ 
        var usuario = JSON.parse(localStorage.getItem('userAuth'));
        this.links = usuario.permisos
      }, 
      logout(){ 
        this.$emit('UserLogout')
        window.localStorage.removeItem('userAuth');
        this.$router.push({path: '/Login'});
      }
    },
    components: {
      ErrorAlert, 
    },
    created(){
      var usuario = JSON.parse(window.localStorage.getItem('userAuth'))
      this.nombreUsuario = usuario.nombre;
      this.cargarProcesos()
      this.drawer = true
    }
  }
</script>


<style scoped>
.itemLink{
  margin: 5px;
  border-radius: 4px;
}
.itemLink:hover {
  background: rgb(207, 207, 207);
}
.itemLink:active {
  background: rgba(50, 67, 104, 0.637);
}
.link{ 
  font-weight: normal;
  font-size: 1.2em;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.801)
}
.link-seleccionado{ 
  font-weight: bold;
  font-size: 1.35em;
  color: black
}
</style>