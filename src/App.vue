<template>
  <v-app>
    <Login v-if="!userLogin" v-on:UserLogin="userLogin = true"/>
    <Home v-if="userLogin" v-on:UserLogout="userLogin = false"/>
  </v-app>
</template>

<script>
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'

export default({
  data(){ 
    return { 
      userLogin: (JSON.parse(window.localStorage.getItem('userAuth'))) ? true : false
    }
  },
  components: { 
    Login,
    Home
  }
})
</script>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
