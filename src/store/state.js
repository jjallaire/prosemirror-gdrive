


export function noUser() {
  return {
    id: null,
    name: null,
    email: null
  };
}

export function initialState() {
  return {
    initialized: false,
    user: noUser()
  };
}
