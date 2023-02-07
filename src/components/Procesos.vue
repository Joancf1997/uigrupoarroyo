<template>
  <v-container> 
    <ErrorAlert ref="ErrorAlert"> </ErrorAlert>
    <SuccessAlert ref="SuccessAlert"> </SuccessAlert>
    <WarningAlert ref="WarningAlert"></WarningAlert>
    <div v-if="!verDetalle"> 
      <v-row class="root">
        <v-col cols=12>
          <v-btn
            class="ma-2 agregarProceso"
            outlined
            color="green"
            @click="crearNuevo = true; verDetalle = true; restartVal();"
          >
            Nuevo proceso
          </v-btn>
        </v-col>
        <v-col cols=12>
          <v-card>
            <v-card-title>
              Procesos del sistema
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="procesos"
              :search="search"
              :loading="cargandoTabla"
              :items-per-page="-1"
              loading-text="Cargando datos..."
            >


            <template v-slot:item.icono="{ item }">
              <v-icon
                small
                @click="viewItem(item)"
              >
                {{item.icono}}
              </v-icon>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                @click="viewItem(item)"
              >
                mdi-eye-arrow-right-outline
              </v-icon>
            </template>
            </v-data-table>
          </v-card>
        </v-col>  
      </v-row>
    </div>
    <div v-if="verDetalle"> 
      <v-row class="root">
        <v-col cols=12>
          <v-btn
            class="ma-2 agregarProceso"
            outlined
            color="blue"
            @click="verDetalle = false; crearNuevo = false"
          >
            Regresar
          </v-btn>
          <v-btn
            v-if="!crearNuevo"
            class="ma-2 btn2"
            outlined
            color="red"
            @click="eliminar()"
          >
            Eliminar
          </v-btn>
          <v-btn
            v-if="!crearNuevo"
            class="ma-2 btn2"
            outlined
            color="green"
            @click="modificar()"
          >
            Guardar
          </v-btn>
          <v-btn
            v-if="crearNuevo"
            class="ma-2 btn2"
            outlined
            color="green"
            @click="Nuevo()"
          >
            Crear
          </v-btn>
        </v-col>
        <v-col col=12>
          <v-form
            ref="form"
            lazy-validation
          >
            <v-container>
              <v-row>
                <v-col lg=4 cols="12">
                  <v-text-field label="Nombre" v-model="proceso.nombre" :rules="inputRules"></v-text-field>
                </v-col>
                <v-col lg=4 cols="12">
                  <v-text-field label="Url path" v-model="proceso.url" :rules="inputRules"></v-text-field>
                </v-col>
                <v-col lg=4 cols="12">
                  <v-text-field label="Icono" v-model="proceso.icono" :rules="inputRules"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import api from "../boot/axios"
import ErrorAlert from "@/components/ErrorAlert.vue"
import SuccessAlert from "@/components/SuccessAlert.vue"
import WarningAlert from "@/components/WarningAlert.vue"

  export default {
    data () {
      return {
        verDetalle: false,
        crearNuevo: false,
        search: '',
        procesos: [],
        cargandoTabla: true,
        headers: [
          {text: 'Icono', value: 'icono'},
          {text: 'Nombre', value: 'nombre'},
          {text: 'Path', value: 'url'},
          { text: 'Acciones', value: 'actions', sortable: false },
        ],
        proceso: {
          _id: "",
          nombre: "", 
          icono: "",
          url: "",
        }, 
        inputRules: [
          v => !!v || 'Campo requerido required',
        ],
      }
    },
    methods: {
      leerDatos(){
        api.get('procesos')
        .then((response) => {
          if(response.status == 200) { 
            this.restartVal();
            this.procesos = response.data.procesos;
            this.cargandoTabla = false
          }
        })
        .catch((error) => {
          this.$refs.ErrorAlert.showMessage(error.response.data.message);
        });
      },
      eliminar(){ 
        const idItem = { _id: this.proceso._id }
        api.delete('procesos', {data: idItem})
        .then((response) => {
          if(response.status == 200) { 
            this.restartVal();
            this.$refs.SuccessAlert.showMessage(response.data.message);
            this.leerDatos()
            this.verDetalle = false
          }
        })
        .catch((error) => {
          this.$refs.ErrorAlert.showMessage(error.response.data.message);
        });
      },
      modificar(){ 
        if(this.$refs.form.validate()){
          api.put('procesos', this.proceso)
          .then((response) => {
            if(response.status == 200) { 
              this.restartVal();
              this.$refs.SuccessAlert.showMessage(response.data.message);
              this.leerDatos()
              this.verDetalle = false
            }
          })
          .catch((error) => {
            this.$refs.ErrorAlert.showMessage(error.response.data.message);
          });
        } else { 
          this.$refs.WarningAlert.showMessage("Ingrese los campos obligatorios");
        }
      },
      Nuevo(){ 
        if(this.$refs.form.validate()){
          const {nombre, icono, url} = this.proceso
          const dataProceso = {nombre, icono, url}
          api.post('procesos', dataProceso)
          .then((response) => {
            if(response.status == 200) { 
              this.restartVal();
              this.$refs.SuccessAlert.showMessage(response.data.message);
              this.leerDatos()
              this.verDetalle = false;
              this.crearNuevo = false;
            }
          })
          .catch((error) => {
            this.$refs.ErrorAlert.showMessage(error.response.data.message);
          });
        } else { 
          this.$refs.WarningAlert.showMessage("Ingrese los campos obligatorios");
        }
      },
      restartVal(){ 
        this.proceso = {
          _id: "",
          nombre: "", 
          icono: "",
          url: "",
        }
      },
      viewItem(item){ 
        this.proceso = item;
        this.verDetalle = true;
      }
    },
    created() { 
      this.leerDatos()
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
.agregarProceso{ 
  float:left;
}
.btn2{ 
  float:right;
}
</style>