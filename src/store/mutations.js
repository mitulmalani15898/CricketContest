// https://vuex.vuejs.org/en/mutations.html

export default {
  authenticatedUser (state, data) {
    (state.token = data.token);
    (state.role = data.role);
    (state.userId = data.userId)
  },

  clearAuthData (state) {
    (state.token = null);
    (state.role = null);
    (state.userId = null);
    (state.authError = null)
  },

  setAuthError (state, err) {
    state.authError = err
  },

  clearAuthError (state) {
    state.clearAuthError = null
  }
}
