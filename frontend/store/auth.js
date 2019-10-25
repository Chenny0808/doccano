import Cookie from 'js-cookie'
import ApiService from '@/services/api.service'

export const state = () => ({
  token: null
})

export const mutations = {
  setToken(state, token) {
    state.token = token
  },
  clearToken(state) {
    state.token = null
  }
}

export const getters = {
  isAuthenticated(state) {
    return state.token != null
  }
}

export const actions = {
  authenticateUser({ commit }, authData) {
    const authUrl = 'http://127.0.0.1:8000/v1/auth-token'
    return this.$axios
      .$post(authUrl, authData)
      .then((result) => {
        commit('setToken', result.token)
        localStorage.setItem('token', result.token)
        Cookie.set('jwt', result.token)
        ApiService.setHeader(result.token)
      })
      .catch(e => alert(e))
  },
  initAuth({ commit, dispatch }, req) {
    let token
    if (req) {
      if (!req.headers.cookie) {
        return
      }
      const jwtCookie = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('jwt='))
      if (!jwtCookie) {
        return
      }
      token = jwtCookie.split('=')[1]
    } else {
      token = localStorage.getItem('token')
    }
    commit('setToken', token)
    ApiService.setHeader(token)
  },
  logout({ commit }) {
    commit('clearToken')
    Cookie.remove('jwt')
    if (process.client) {
      localStorage.removeItem('token')
    }
  }
}
