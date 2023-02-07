import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  linkExactActiveClass: "link-seleccionado",
  mode: 'history',
  routes: [
    {path: '/Login', name: 'Login', component: Login},
    {path: '/home', name: 'home', component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue'), meta: {requiresAuth: true}}, 
    {path: '/Procesos', name: 'Procesos', component: () => import(/* webpackChunkName: "Procesos" */ '../components/Procesos.vue'), meta: {requiresAuth: true}},
    {path: '/Usuarios', name: 'Usuarios', component: () => import(/* webpackChunkName: "Usuarios" */ '../components/Usuarios.vue'), meta: {requiresAuth: true}},
    {path: '/Permisos', name: 'Permisos', component: () => import(/* webpackChunkName: "Permisos" */ '../components/Permisos.vue'), meta: {requiresAuth: true}},
    {path: '/Tarifas', name: 'Tarifas', component: () => import(/* webpackChunkName: "Tarifas" */ '../components/Tarifas.vue'), meta: {requiresAuth: true}},
    {path: '/Clientes', name: 'Clientes', component: () => import(/* webpackChunkName: "Clientes" */ '../components/Clientes.vue'), meta: {requiresAuth: true}},
    {path: '/Repartidores', name: 'Repartidores', component: () => import(/* webpackChunkName: "Repartidores" */ '../components/Repartidores.vue'), meta: {requiresAuth: true}},
    {path: '/Pedidos', name: 'Pedidos', component: () => import(/* webpackChunkName: "Pedidos" */ '../components/Pedidos.vue'), meta: {requiresAuth: true}},
    {path: '/404', name: '404', component: () => import(/* webpackChunkName: "404" */ '../components/404.vue'), meta: {requiresAuth: false}},
  ]
});

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(Buffer.from(base64, "base64").toString("ascii").split("").map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

// Guard the routes 
router.beforeEach((to, from, next) => {
  var procesosGuardados = JSON.parse(window.localStorage.getItem('userAuth'))
  // Validar token existente
  if (procesosGuardados) {
    const jwtPayload = parseJwt(JSON.parse(window.localStorage.getItem('userAuth')).token);
    if (jwtPayload.exp < Date.now()/1000) {
      window.localStorage.removeItem('userAuth')
      next({name: "Login"});
      window.location.reload();
    }
  } else {
    if(to.name != "Login"){ 
      next({name: "Login"});
      window.location.reload();
      return;
    }
  }

  // Validar rutas 
  if(to.matched.some(record => record.meta.requiresAuth)){
    const procesos = procesosGuardados.permisos
    var valido = procesos.find(p => p.url == to.path)
    if(valido == undefined){ 
      next({name: '404'})
    } 
    next()
  }else{ 
    next()
  }
})

export default router
