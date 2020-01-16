import axios from 'axios'

export default {
  register (userData) {
    return axios.post('auth/signup', userData)
  },

  login (userData) {
    return axios.post('auth/login', userData)
  }
}
