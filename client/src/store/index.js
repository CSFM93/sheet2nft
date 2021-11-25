import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)


export const store = new Vuex.Store({
  state() {
    return {
      user: {},
      projects: [],
      project: {},
      item: {},
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setProjects(state, payload) {
      state.projects = JSON.parse(JSON.stringify(payload))
    },
    setProject(state, payload) {
      state.project = JSON.parse(JSON.stringify(payload))
    },
    setItem(state, payload) {
      state.item = JSON.parse(JSON.stringify(payload))
    },
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  },)],

})

