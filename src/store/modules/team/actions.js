import teamService from '@/service/team'

export default {
  getAllTeams({ commit }) {
    teamService.getAllTeams()
      .then(res => commit('setAllTeams', res.data))
      .catch(err => err.response.data.error)
  },

  getTeams({ commit }, payload) {
    teamService.getTeams(payload.offset, payload.limit, payload.column, payload.direction)
      .then(res => {
        commit('setTeams', res.data);
        commit('setTotalTeams', res.data.length);
      })
      .catch(err => err.response.data.error)
  },

  postTeam({ dispatch }, { formData, offset, limit, column, direction }) {
    teamService.postTeam(formData)
      .then(res => dispatch('getTeams', { offset, limit, column, direction }))
      .catch(err => err.response.data.error)
  },

  putTeam({ dispatch }, { id, formData, offset, limit, column, direction }) {
    teamService.putTeam(id, formData)
      .then(res => dispatch('getTeams', { offset, limit, column, direction }))
      .catch(err => err.response.data.error)
  },

  deleteTeam({ dispatch }, { id, offset, limit, column, direction }) {
    teamService.deleteTeam(id)
      .then(res => dispatch('getTeams', { offset, limit, column, direction }))
      .catch(err => err.response.data.error)
  }
}