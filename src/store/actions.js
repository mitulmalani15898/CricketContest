// https://vuex.vuejs.org/en/actions.html

import authService from '@/service/auth'
import router from '@/router/index'

export default {
  register ({ commit, dispatch }, userData) {
    return new Promise((resolve, reject) => {
      authService.register(userData)
        .then(res => {
          dispatch('login', {
            email: userData.email,
            password: userData.password
          })
          commit('clearAuthError')
          resolve(res)
        })
        .catch(err => commit('setAuthError', err.response.data.error))
    })
  },

  login ({ commit }, authData) {
    return new Promise((resolve, reject) => {
      authService.login(authData)
        .then(res => {
          commit('authenticatedUser', {
            token: res.data.user.token,
            role: res.data.user.role,
            userId: res.data.user.id
          })
          commit('clearAuthError')
          localStorage.setItem('token', res.data.user.token)
          localStorage.setItem('role', res.data.user.role)
          router.replace('/dashboard')
          resolve(res)
        })
        .catch(err => commit('setAuthError', err.response.data.error))
    })
  },

  logout ({ commit }) {
    commit('clearAuthData')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    router.replace('/login')
  }
}
