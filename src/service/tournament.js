import axios from 'axios'

export default {
  getTournaments (offset, limit, column, direction) {
    return axios.get('/api/tournament/' + offset + '/' + limit + '/' + column + '/' + direction)
  },

  postTournament (formdata) {
    return axios.post('api/tournament', formdata)
  },

  putTournament (id, formdata) {
    return axios.put('/api/tournament/' + id, formdata)
  },

  deleteTournament (id) {
    return axios.delete('/api/tournament/' + id)
  },

  getTournamentById (id) {
    return axios.get('/api/tournament/' + id)
  }
}
