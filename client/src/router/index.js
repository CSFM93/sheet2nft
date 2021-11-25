import Vue from 'vue'
import VueRouter from 'vue-router'
import { store } from '../store'
import NProgress from 'nprogress'


const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};


Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'home',
    meta: { layout: "home-layout" },
    component: () => import(/* webpackChunkName: "editor" */ '../views/Home'),

  },
  {
    path: '/projects',
    name: 'projects',
    meta: { layout: "home-layout" },
    component: () => import(/* webpackChunkName: "editor" */ '../views/Projects'),
    beforeEnter: (to, from, next) => auth(to, from, next)

  },
  {
    path: '/project/:projectId',
    name: 'project',
    meta: { layout: "home-layout" },
    component: () => import(/* webpackChunkName: "editor" */ '../views/Project'),
    beforeEnter: (to, from, next) => auth(to, from, next)
  },
  {
    path: '/item/:itemId',
    name: 'item',
    meta: { layout: "home-layout" },
    component: () => import(/* webpackChunkName: "editor" */ '../views/Item'),
    beforeEnter: (to, from, next) => auth(to, from, next)
  },
]



const auth = (to, from, next) => {
  if (!Object.keys(store.state.user).length > 0) {
    next({
      name: "home", // back to safety
    })
  } else {
    next()
  }
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
