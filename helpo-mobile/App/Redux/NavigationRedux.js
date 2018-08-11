import AppNavigationNoAuth from '../Navigation/AppNavigationNoAuth'

export const reducer = (state, action) => {
  const newState = AppNavigationNoAuth.router.getStateForAction(action, state)
  return newState || state
}
