<template>
  <v-alert
    dense
    type="warning"
    class="errroMessage"
    v-if="flag"
  >
    <strong> Alerta: </strong> {{message}}
  </v-alert>
</template>

<script>
export default {
  data(){ 
    return { 
      flag: false,
      message: ""
    }
  },
  methods: { 
    showMessage(message){
      this.message = message;
      this.flag = true;
      setTimeout(() => {
        this.flag = false;
      }, 4000) 
    }
  }
}
</script>

<style scopped>
.errroMessage {
  position:absolute;
  top:0;
  right:0;
  margin: 1%;
  z-index: 9999;
}
</style>