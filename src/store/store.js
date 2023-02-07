import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    usuarioLogeado: false,
  },

  mutations: {
    setUserLog: (state, payload) => { 
      state.usuarioLogeado = payload
    }
  },

  actions: { 

  },

  getters: {
    usuarioLogeado: state => { 
      return state.usuarioLogeado;
    }
  }
})

export default store;