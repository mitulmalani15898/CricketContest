import playerService from '@/service/player'

export default {
  getPlayers({ commit }, payload) {
    playerService.getPlayers(payload.offset, payload.limit, payload.column, payload.direction)
      .then(res => {
        commit('setTotalPlayers', res.data.length);
        commit('setPlayers', res.data);
      })
      .catch(err => err.response.data.error)
  },

  postPlayer({ dispatch }, { formData, offset, limit, column, direction }) {
    playerService.postPlayer(formData)
      .then(res => dispatch('getPlayers', { offset, limit, column, direction }))
      .catch(err => err.response.data.error);
  },

  putPlayer({ dispatch }, { id, formData, offset, limit, column, direction }) {
    playerService.putPlayer(id, formData)
      .then(res => dispatch('getPlayers', { offset, limit, column, direction }))
      .catch(err => err.response.data.error);
  },

  deletePlayer({ dispatch }, { id, offset, limit, column, direction }) {
    playerService.deletePlayer(id)
      .then(res => dispatch('getPlayers', { offset, limit, column, direction }))
      .catch(err => err.response.data.error);
  }
}