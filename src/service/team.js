import axios from 'axios'

export default {
  getAllTeams() {
    return axios.get('api/team');
  },

  getTeams(offset, limit, column, direction) {
    return axios.get('api/team/' + offset + '/' + limit + '/' + column + '/' + direction);
  },

  postTeam(formData) {
    return axios.post('api/team', formData);
  },

  putTeam(id, formData) {
    return axios.put('api/team/' + id, formData);
  },

  deleteTeam(id) {
    return axios.delete('api/team/' + id);
  }
}