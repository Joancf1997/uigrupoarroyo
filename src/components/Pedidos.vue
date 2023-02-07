<template>
  <v-container> 
    <ErrorAlert ref="ErrorAlert"> </ErrorAlert>
    <SuccessAlert ref="SuccessAlert"> </SuccessAlert>
    <WarningAlert ref="WarningAlert"></WarningAlert>
    <div v-if="!verDetalle"> 
      <v-row class="root">
        <v-col cols=12 class="mb-15">
          <v-btn
            class="ma-2 agregarProceso"
            outlined
            color="green"
            @click="crearNuevo = true; verDetalle = true; restartVal();"
          >
            Nuevo Pedido
          </v-btn>
        </v-col>
        <v-col cols=3>
          <v-progress-circular
            :rotate="360"
            :size="100"
            :width="15"
            :value="porcentajeEntregados"
            color="green"
          > 
            {{ pedidosEntregados }}
          </v-progress-circular>
          <br>
          <div class="tt2"> {{ totalPedidos }} Pedidos</div>
        </v-col>
        <v-col cols=3>
          <v-progress-circular
            :rotate="360"
            :size="100"
            :width="15"
            :value="porcentajeCobros"
            color="green"
          >
           Q {{ cobrosRealizados }}
          </v-progress-circular>
          <div class="tt2">Total:  Q {{ totalCobros }}</div>
        </v-col>
        <v-col cols=3 class="moneda">
          {{ totalTransferencia }} <br>
          <div class="tt2">Transferencia</div>
        </v-col>
        <v-col cols=3 class="moneda">
          {{ totalEfectivo }} <br>
          <div class="tt2">Efectivo</div>
        </v-col>
        <v-col cols=12 class="mt-10">
          <v-card>
            <v-card-title>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="Picker in menu"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
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
                  <v-autocomplete
                    v-model="proceso.cliente"
                    :items="clientes"
                    label="Cliente"
                    item-text="nombre"
                    item-value="_id"
                    return-object
                  >
                 </v-autocomplete>
                </v-col>
                <v-col lg=4 cols="12">
                  <v-autocomplete
                    v-model="proceso.repartidor"
                    :items="repartidores"
                    label="Repartidor"
                    item-text="nombre"
                    item-value="_id"
                    return-object
                  >
                 </v-autocomplete>
                </v-col>
                <v-col lg=2 cols="12">
                  <v-menu
                    ref="menu2"
                    v-model="menu2"
                    :close-on-content-click="false"
                    :return-value.sync="date2"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date2"
                        label="Fecha Entrega"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date2"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="menu2 = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu2.save(date2)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col lg=2 cols="12">
                  <v-select
                    v-model="proceso.estado"
                    :items="['Ingresado', 'Entregado', 'Cancelado']"
                    label="Estado"
                  ></v-select>
                </v-col>
                <v-col lg=12 class="mt-12">
                  <v-data-table
                    :headers="headersDetalle"
                    :items="proceso.detalle"
                    sort-by="calories"
                    class="elevation-1"
                  >
                    <template v-slot:top>
                      <v-toolbar
                        flat
                      >
                        <v-toolbar-title>Detalle del pedido</v-toolbar-title>
                        <v-divider
                          class="mx-4"
                          inset
                          vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog
                          v-model="dialog"
                          max-width="1000px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              color="black"
                              dark
                              class="mb-2"
                              v-bind="attrs"
                              v-on="on"
                            >
                              Nuevo Item
                            </v-btn>
                          </template>
                          <v-card>
                            <v-card-title>
                              <span class="text-h5">Nuevo Item</span>
                            </v-card-title>

                            <v-card-text>
                              <v-container>
                                <v-row>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                  >
                                    <v-autocomplete
                                        v-model="editedItem.nombreRecibe"
                                        :items="clientes"
                                        label="Quien recibe"
                                        item-text="nombre"
                                        item-value="nombre"
                                        return-object
                                        @change="clienteSeleccionada()"
                                      >
                                    </v-autocomplete>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                    md="2"
                                  >
                                    <v-text-field
                                      v-model="editedItem.ceRecibe"
                                      label="Celular"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                    md="6"
                                  >
                                    <v-text-field
                                      v-model="editedItem.direccionRecibe"
                                      label="Direccion"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                    md="2"
                                  >
                                    <v-autocomplete
                                      v-model="editedItem.zona"
                                      :items="zonas"
                                      label="Zona"
                                      item-text="zona"
                                      item-value="_id"
                                      return-object
                                      @change="zonaSeleccionada()"
                                    >
                                    </v-autocomplete>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                    md="2"
                                  >
                                    <v-text-field
                                      v-model="editedItem.costoEnvio"
                                      label="Costo Envio"
                                      @change="calculoTotal()"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                    md="2"
                                  >
                                    <v-text-field
                                      v-model="editedItem.cobroPersonaRecibe"
                                      label="Costo paquete"
                                      @change="calculoTotal()"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                    md="6"
                                  >
                                    <v-text-field
                                      v-model="editedItem.tipoProducto"
                                      label="Tipo Producto"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                  >
                                    <v-select
                                      v-model="editedItem.tipoPago"
                                      :items="['Efectivo', 'Transferencia']"
                                      label="Tipo de pago"
                                    ></v-select>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                    md="2"
                                  >
                                    <v-text-field
                                      v-model="editedItem.totalEnvio"
                                      label="Total Envio"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                    md="4"
                                  >                                 
                                    <v-container
                                      class="px-0"
                                      fluid
                                    >
                                      <v-switch
                                        v-model="editedItem.pagaPersonaEnvia"
                                        :label="editedItem.pagaPersonaEnvia ? `Paga Quien Envia` : `Paga Quien Recibe`"
                                      ></v-switch>
                                    </v-container>
                                  </v-col>
                                  <v-col
                                    cols="12"
                                    sm="6"
                                    md="2"
                                  >                    
                                    <v-container
                                      class="px-0"
                                      fluid
                                    >
                                      <v-checkbox
                                        v-model="editedItem.entregado"
                                        :label="editedItem.entregado ? `Entregado` : `Recibido`"
                                      ></v-checkbox>
                                    </v-container>
                                  </v-col> 
                                </v-row>
                              </v-container>
                            </v-card-text>

                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
                                color="red darken-1"
                                text
                                @click="close"
                              >
                                Cancelar
                              </v-btn>
                              <v-btn
                                color="green darken-1"
                                text
                                @click="save"
                              >
                                Agregar
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="300px">
                          <v-card>
                            <v-card-title class="text-h5">Eliminar este articulo?</v-card-title>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="red darken-1" text @click="closeDelete">Cancel</v-btn>
                              <v-btn color="green darken-1" text @click="deleteItemConfirm">OK</v-btn>
                              <v-spacer></v-spacer>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-toolbar>
                    </template>
                    <template v-slot:item.entregado="{ item }">
                      <v-checkbox
                        v-model="item.entregado"
                      ></v-checkbox>
                    </template>                    
                    <template v-slot:item.actions="{ item }">
                      <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item)"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon
                        small
                        @click="deleteItem(item)"
                      >
                        mdi-delete
                      </v-icon>
                    </template>
                  </v-data-table>
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
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd ;

  export default {
    data () {
      return {
        verDetalle: false,
        crearNuevo: false,
        search: '',
        procesos: [],
        cargandoTabla: true,
        menu: false, 
        date: today,
        menu2: false, 
        date2: today,
        headers: [
          {text: 'Nombre', value: 'cliente.nombre'},
          {text: 'Celular', value: 'cliente.cel'},
          {text: 'Dirección', value: 'cliente.direccion'},
          {text: 'Total', value: 'totalPedido'},
          {text: 'Acciones', value: 'actions', sortable: false },
        ],
        proceso: {
          _id: "",
          repartidor: "", 
          cliente: "",
          fechaEntrega: "",
          estado: "Ingresado", 
          totalPedido: 0, 
          comisionTotal: 0,
          detalle: []
        }, 
        inputRules: [
          v => !!v || 'Campo requerido required',
        ],

        // Detalle del pedido
        clientes: [],
        repartidores: [],
        zonas: [],

        // Table de detalle 
        dialog: false,
        dialogDelete: false,
        headersDetalle: [
          { text: 'Entregado', value: 'entregado' },
          { text: 'Quien Recibe', value: 'nombreRecibe.nombre' },
          { text: 'Celular', value: 'ceRecibe' },
          { text: 'Donde Recibe', value: 'direccionRecibe' },
          { text: 'Quien Paga', value: 'pagaPersonaEnvia'},
          { text: 'Cobro Paquete', value: 'cobroPersonaRecibe'},
          { text: 'Producto', value: 'tipoProducto'},
          { text: 'Cobro Total', value: 'totalEnvio'},
          { text: 'Actions', value: 'actions', sortable: false },
        ],
        desserts: [],
        editedIndex: -1,
        editedItem: {
          nombreRecibe: "", 
          ceRecibe: "", 
          direccionRecibe: "", 
          zona: "", 
          costoEnvio: 0, 
          pagaPersonaEnvia: true,
          cobroPersonaRecibe: 0, 
          tipoProducto: "",
          totalEnvio: 0,
          entregado: false, 
          tipoPago: ""
        },
        defaultItem: {
          nombreRecibe: "", 
          ceRecibe: "", 
          direccionRecibe: "", 
          zona: "", 
          costoEnvio: 0, 
          pagaPersonaEnvia: true,
          cobroPersonaRecibe: 0, 
          tipoProducto: "",
          totalEnvio: 0,
          entregado: false, 
          tipoPago: ""
        },

        // Graficas
        totalPedidos: 0,
        pedidosEntregados: 0,
        porcentajeEntregados: 0,
        cobrosRealizados: 0,
        totalCobros: 0,
        porcentajeCobros: 0,
        totalTransferencia: 0,
        totalEfectivo: 0
      }
    },
    methods: {
      calculoTotal(){ 
        this.editedItem.totalEnvio = parseFloat(this.editedItem.costoEnvio) + parseFloat(this.editedItem.cobroPersonaRecibe)
      },
      clienteSeleccionada(){ 
        this.editedItem.ceRecibe = this.editedItem.nombreRecibe.cel
        this.editedItem.direccionRecibe = this.editedItem.nombreRecibe.direccion
      },
      zonaSeleccionada(){ 
        this.editedItem.costoEnvio = this.editedItem.zona.tarifa
        this.calculoTotal()
      },
      editItem (item) {
        this.editedIndex = this.proceso.detalle.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.proceso.detalle.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        this.proceso.detalle.splice(this.editedIndex, 1)
        this.closeDelete()
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      listadoZonas(){
        api.get('tarifas')
        .then((response) => {
          if(response.status == 200) { 
            this.zonas = response.data.Tarifas;
          }
        })
        .catch((error) => {
          this.$refs.ErrorAlert.showMessage(error.response.data.message);
        });
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.proceso.detalle[this.editedIndex], this.editedItem)
        } else {
          this.proceso.detalle.push(this.editedItem)
        }
        this.close()
      },
      listadoRepartidores(){
        api.get('repartidores')
        .then((response) => {
          if(response.status == 200) { 
            this.repartidores = response.data.listado;
          }
        })
        .catch((error) => {
          this.$refs.ErrorAlert.showMessage(error.response.data.message);
        });
      },
      listadoClientes(){
        api.get('clientes')
        .then((response) => {
          if(response.status == 200) { 
            this.clientes = response.data.listado;
          }
        })
        .catch((error) => {
          this.$refs.ErrorAlert.showMessage(error.response.data.message);
        });
      },
      actualizarGraficas(){ 
        this.totalPedidos = this.procesos.length
        this.procesos.forEach(pedido => { 
          this.pedidosEntregados += (pedido.estado == "Entregado")
          this.totalCobros += pedido.detalle.reduce( function(a, b){
                                    return a + b.totalEnvio;
                                }, 0);
          this.cobrosRealizados += pedido.detalle.reduce( function(a, b){
                                    if(b.entregado){ 
                                      return a + b.totalEnvio;
                                    } else { 
                                      return a + 0
                                    }
                                }, 0);
          this.totalEfectivo += pedido.detalle.reduce( function(a, b){
                                    if(b.tipoPago == "Efectivo"){ 
                                      return a + b.totalEnvio;
                                    } else { 
                                      return a + 0
                                    }
                                }, 0);
          this.totalTransferencia += pedido.detalle.reduce( function(a, b){
                                    if(b.tipoPago == "Transferencia"){ 
                                      return a + b.totalEnvio;
                                    } else { 
                                      return a + 0
                                    }
                                }, 0);
        })
        this.porcentajeCobros = (this.cobrosRealizados * 100) / this.totalCobros
        this.porcentajeEntregados = (this.pedidosEntregados * 100) / this.totalPedidos
      },
      leerDatos(){
        this.totalPedidos =  0,
        this.pedidosEntregados =  0,
        this.porcentajeEntregados =  0,
        this.cobrosRealizados =  0,
        this.totalCobros =  0,
        this.porcentajeCobros =  0,
        this.totalTransferencia =  0,
        this.totalEfectivo =  0
        api.get('pedidos')
        .then((response) => {
          if(response.status == 200) { 
            this.restartVal();
            this.procesos = response.data.listado;
            this.cargandoTabla = false
            this.actualizarGraficas()
          }
        })
        .catch((error) => {
          this.$refs.ErrorAlert.showMessage(error.response.data.message);
        });
      },
      eliminar(){ 
        const idItem = { _id: this.proceso._id }
        api.delete('pedidos', {data: idItem})
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
        this.proceso.totalPedido = this.proceso.detalle.reduce( function(a, b){
                                        return a + b.totalEnvio;
                                    }, 0);
        this.proceso.comisionTotal = this.proceso.detalle.reduce( function(a, b){
                                        return a + b.costoEnvio;
                                    }, 0);
        if(this.$refs.form.validate()){
          api.put('pedidos', this.proceso)
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
          this.proceso.detalle.forEach(item => { 
            this.proceso.totalPedido += item.totalEnvio
            this.proceso.comisionTotal += item.costoEnvio
          })
          const {repartidor, cliente, fechaEntrega, estado, totalPedido, comisionTotal, detalle} = this.proceso
          const dataProceso = {repartidor, cliente, fechaEntrega, estado, totalPedido, comisionTotal, detalle}
          api.post('pedidos', dataProceso)
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
          repartidor: "", 
          cliente: "",
          fechaEntrega: "",
          estado: "Ingresado", 
          totalPedido: 0, 
          comisionTotal: 0,
          detalle: []
        }
      },
      viewItem(item){ 
        this.proceso = item;
        this.verDetalle = true;
      }
    },
    created() { 
      this.leerDatos();
      this.listadoClientes();
      this.listadoRepartidores();
      this.listadoZonas();
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
.tt{ 
  font-weight: bold;
  float: left;
  margin-right: 15px;
}
.tt2{ 
  font-weight: bold;
  margin-top: 15px;
}
.moneda {
  align-self: flex-end;
}
</style>