

export default {

  initialized: (state) => state.initialized,

  authorized: (state) => state.user !== null,

  user: (state) => state.user,

  recent_files: (state) => state.recent_files

}
