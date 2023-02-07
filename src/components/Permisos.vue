<template>
  <v-container> 
    <ErrorAlert ref="ErrorAlert"> </ErrorAlert>
    <SuccessAlert ref="SuccessAlert"> </SuccessAlert>
    <WarningAlert ref="WarningAlert"></WarningAlert>
    <v-row class="root">
      <v-col lg=3 cols="12">
      </v-col>
      <v-col lg=4 cols="12">
        <v-autocomplete v-model="persona" :items="listadoPersonal" label="Usuario" item-text="nombre" item-value="_id" return-object @change="cargarPermisos()"></v-autocomplete>                
      </v-col>
      <v-col lg=2 cols="12">
        <v-btn
          class="ma-2"
          outlined
          color="green"
          @click="guardarPermisos()"
        >
          Guardar 
        </v-btn>
      </v-col>
      <v-col lg=2 cols="12">
      </v-col>
    </v-row>
    <v-row>
      <v-col lg=4 cols="12">
      </v-col>
      <v-col lg=3 cols="12">
        <ul id="example-1">
          <li v-for="proceso in listadoProcesos" :key="proceso.id">
            <v-checkbox
              v-model="procesosSeleccionados"
              :label="proceso.nombre"
              color="primary"
              :value="proceso"
              hide-details
            ></v-checkbox>
          </li>
        </ul>
      </v-col>
      <v-col cols=5>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import api from "../boot/axios"
import ErrorAlert from "@/components/ErrorAlert.vue"
import SuccessAlert from "@/components/SuccessAlert.vue"
import WarningAlert from "@/components/WarningAlert.vue"

export default {
  data(){ 
    return { 
      persona: {},
      listadoProcesos: [],
      listadoPersonal: [],
      procesosSeleccionados: []
    }
  },
  methods: {
    cargarPermisos(){ 
      this.procesosSeleccionados = []
      this.listadoProcesos.forEach(proceso => {
        if(this.persona.permisos.includes(proceso._id)){ 
          this.procesosSeleccionados.push(proceso)
        }
      });
    },
    guardarPermisos(){ 
      if(this.persona.nombre){ 
        var data = { 
          id: this.persona._id,
          permisos: this.procesosSeleccionados
        }
        api.post('permisosUsuario', data)
        .then((response) => {
          if(response.status == 200) { 
            this.$refs.SuccessAlert.showMessage(response.data.message);
            this.procesosSeleccionados = []
            this.persona = {}
            this.personalClinica()
          }
        })
        .catch((error) => {
          this.$refs.ErrorAlert.showMessage(error.response.data.message);
        });
      }
    },
    personalClinica(){ 
      api.get('usuarios')
      .then((response) => {
        if(response.status == 200) { 
          this.listadoPersonal = response.data.usuarios;
        }
      })
      .catch((error) => {
        this.$refs.ErrorAlert.showMessage(error.response.data.message);
      });
    },
    cargarProcesos(){ 
      api.get('procesos')
      .then((response) => {
        if(response.status == 200) { 
          this.listadoProcesos = response.data.procesos
        }
      })
      .catch((error) => {
        this.$refs.ErrorAlert.showMessage(error.response.data.message);
      });
    }, 
  },
  created(){ 
    this.cargarProcesos()
    this.personalClinica()
  },
  components: {
    ErrorAlert, 
    SuccessAlert,
    WarningAlert
  }
}
</script>

<style scoped>
.root{ 
  margin-top: 5%;
}
</style>