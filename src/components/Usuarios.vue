<template>
  <v-container> 
    <ErrorAlert ref="ErrorAlert"> </ErrorAlert>
    <SuccessAlert ref="SuccessAlert"> </SuccessAlert>
    <WarningAlert ref="WarningAlert"></WarningAlert>


    <div v-if="!verDetalle" > 
      <v-row class="root">
        <v-col cols=12>
          <v-btn
            class="ma-2 agregarProceso"
            outlined
            color="green"
            @click="crearNuevo = true; verDetalle = true; restartVal();"
          >
            Nuevo Usuario
          </v-btn>
        </v-col>
        <v-col cols=12>
          <v-card>
            <v-card-title>
              Usuarios del sistema
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
              :items="usuarios"
              :search="search"
              :loading="cargandoTabla"
              :items-per-page="-1"
              loading-text="Cargando datos..."
            >
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
      <v-row>
        <v-col cols=12>
          <v-btn
            class="ma-2 agregarProceso"
            outlined
            color="blue"
            @click="regresarTablaGeneral()"
          >
            Regresar
          </v-btn>
        </v-col>
        <v-col col=12>
          <v-form
            ref="form"
            lazy-validation
          >
            <v-container>
              <v-row>
                <v-col cols="12" class="title1 text-left">
                    <h2> Datos Personales </h2>
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
                <v-col lg=4 cols="12">
                  <v-text-field label="Nombre" v-model="usuario.nombre" :rules="inputRules"></v-text-field>
                </v-col>
                <v-col lg=4 cols="12">
                  <v-text-field label="Email" v-model="usuario.email" :rules="inputRules"></v-text-field>
                </v-col>
                <v-col lg=4 cols="12">
                  <v-text-field label="Número de teléfono" v-model="usuario.cel"  :rules="inputRules"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>

          <v-form
            ref="form2"
            lazy-validation
          >
            <v-container>
              <v-row>
                <v-col cols="12" class="title1 text-left mt-6">
                  <h2> Datos del sistema </h2>
                  <v-btn
                    v-if="!crearNuevo"
                    class="ma-2 float-right"
                    outlined
                    color="green"
                    @click="modificarCredenciales()"
                  >
                    Modificar Credenciales
                  </v-btn>
                </v-col>
                <v-col lg=6 cols="12">
                  <v-text-field label="Username" v-model="usuario.username" :rules="inputRules"></v-text-field>
                </v-col>
                <v-col lg=6 cols="12">
                  <v-text-field v-if="crearNuevo" placeholder="Password" label="*****"  v-model="usuario.password" :rules="inputRules"></v-text-field>
                  <v-text-field  v-if="!crearNuevo" placeholder="Password" label="*****" v-model="usuario.password" ></v-text-field>
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
        usuarios: [],
        sitiosUsuario:[],
        cargandoTabla: true,
        headers: [
          {text: 'Nombre', value: 'nombre'},
          {text: 'email', value: 'email'},
          {text: 'Username', value: 'username'},
          { text: 'Acciones', value: 'actions', sortable: false },
        ],
        usuario: {
          nombre: "",
          email: "",
          username: "", 
          password: "",  
          sitios: [],
          cel: "",
          permisos: [],
        }, 
        inputRules: [
          v => !!v || 'Campo requerido required',
        ],
        // Dialos nuevo sitio 
        sitios: [],
        dialogSitios: false,
        show: false,
        sitioNuevo: "",
        contadoresSitio: [],
        contadoresSitioDetalle: []
      }
    },
    methods: {
      leerDatos(){
        api.get('usuarios')
        .then((response) => {
          if(response.status == 200) { 
            this.restartVal();
            this.usuarios = response.data.usuarios;
            this.cargandoTabla = false
          }
        })
        .catch((error) => {
          this.$refs.ErrorAlert.showMessage(error.response.data.message);
        });
      },
      eliminar(){ 
        const idItem = { _id: this.usuario._id }
        api.delete('usuarios', {data: idItem})
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
          api.put('usuarios', this.usuario)
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
      modificarCredenciales(){ 
        if(this.$refs.form2.validate()){
          api.put('credencialesUsuario', this.usuario)
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
        if(this.$refs.form.validate() && this.$refs.form2.validate()){
          api.post('usuarios', this.usuario)
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
        this.usuario = {
          nombre: "",
          email: "",
          username: "", 
          password: "",  
          sitios: [],
          cel: "",
          permisos: [],
        }
      },
      viewItem(item){ 
        this.sitios = []
        this.usuario = item;
        this.verDetalle = true;
      },
      regresarTablaGeneral(){ 
        this.verDetalle = false; 
        this.crearNuevo = false;
        this.usuario = {}
        this.sitiosUsuario = []
      }
    },
    created() { 
      this.leerDatos();
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