import tournamentTeamService from '@/service/tournamentTeam'

export default {
  postTournamentTeam({ dispatch }, payload) {
    let teamIds = payload.teamIds;
    teamIds.forEach(teamId => {
      tournamentTeamService.postTournamentTeam({ tournamentId: payload.tournamentId, teamId: teamId })
        .then(res => {
          if (teamIds.indexOf(teamId) === (teamIds.length - 1)) {
            dispatch('tournament/getTournamentById', payload.tournamentId, { root: true });
            dispatch('tournament/getTournaments', {
              offset: payload.offset,
              limit: payload.limit,
              column: payload.column,
              direction: payload.direction,
            }, { root: true });
          }
        })
    })
  },

  deleteTournamentTeam({ dispatch }, payload) {
    let teamIds = payload.teamIds;
    teamIds.forEach(teamId => {
      tournamentTeamService.deleteTournamentTeam(payload.tournamentId, teamId)
        .then(res => {
          if (teamIds.indexOf(teamId) === (teamIds.length - 1)) {
            dispatch('tournament/getTournamentById', payload.tournamentId, { root: true });
            dispatch('tournament/getTournaments', {
              offset: payload.offset,
              limit: payload.limit,
              column: payload.column,
              direction: payload.direction,
            }, { root: true });
          }
        })
    })
  }
}
