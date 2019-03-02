

export default {

  initialized: (state) => state.initialized,

  authorized: (state) => state.user.id !== null,

  user: (state) => state.user
  
}
