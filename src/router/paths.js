/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
  {
    // Relative to /src/views
    path: '/login',
    view: 'Login'
  },
  {
    path: '/signup',
    view: 'Signup'
  },
  {
    path: '/dashboard',
    view: 'Dashboard',
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_user: false
    }
  },
  {
    path: '/tournament',
    name: 'Tournament',
    view: 'Tournament',
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_user: false
    }
  },
  {
    path: '/team',
    name: 'Team',
    view: 'Team',
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_user: false
    }
  },
  {
    path: '/player',
    name: 'Player',
    view: 'Player',
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_user: false
    }
  },
  {
    path: '/tournamentTeamPlayer',
    name: 'Tournament Team Player',
    view: 'TournamentTeamPlayer',
    meta: {
      requiresAuth: true,
      is_admin: true,
      is_user: false
    }
  },
  {
    path: '/userDashboard',
    name: 'User Dashboard',
    view: 'UserProfile',
    meta: {
      requiresAuth: true,
      is_admin: false,
      is_user: true
    }
  }
]
