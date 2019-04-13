import axios from 'axios'

export default {
  getPlayers(offset, limit, column, direction) {
    return axios.get('api/player/' + + offset + '/' + limit + '/' + column + '/' + direction)
  },

  postPlayer(formData) {
    return axios.post('/api/player', formData)
  },

  putPlayer(id, formData) {
    return axios.put('/api/player/' + id, formData)
  },

  deletePlayer(id) {
    return axios.delete('api/player/' + id)
  }
}