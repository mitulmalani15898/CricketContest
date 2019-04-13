import axios from 'axios';

export default {
  postTournamentTeam(tournamentDetails) {
    return axios.post('api/tournamentteam', tournamentDetails)
  },

  deleteTournamentTeam(tournamentId, teamId) {
    return axios.delete('api/tournamentteam/' + tournamentId + '/' + teamId + '/' + localStorage.getItem('role'))
  }
}