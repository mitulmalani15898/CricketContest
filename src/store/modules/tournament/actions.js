import tournamentService from '@/service/tournament'

export default {
  getTournaments ({ commit }, payload) {
    tournamentService.getTournaments(payload.offset, payload.limit, payload.column, payload.direction)
      .then(res => {
        commit('setTotalTournaments', res.data.length)
        commit('setTournaments', res.data)
      })
      .catch(err => err.response.data.error)
  },

  postTournament ({ dispatch }, { formData, offset, limit, column, direction }) {
    tournamentService.postTournament(formData)
      .then(res => dispatch('getTournaments', { offset, limit, column, direction }))
      .catch(err => err.response.data.error)
  },

  putTournament ({ dispatch }, { id, formData, offset, limit, column, direction }) {
    tournamentService.putTournament(id, formData)
      .then(res => dispatch('getTournaments', { offset, limit, column, direction }))
      .catch(err => err.response.data.error)
  },

  deleteTournament ({ dispatch }, { id, offset, limit, column, direction }) {
    tournamentService.deleteTournament(id)
      .then(res => dispatch('getTournaments', { offset, limit, column, direction }))
      .catch(err => err.response.data.error)
  },

  getTournamentById ({ commit }, id) {
    tournamentService.getTournamentById(id)
      .then(res => commit('tournamentTeam/setTournamentTeams', res.data.Teams, { root: true }))
      .catch(err => err.response.data.error)
  }
}
