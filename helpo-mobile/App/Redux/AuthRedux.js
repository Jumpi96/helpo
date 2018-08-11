import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { AsyncStorage } from 'react-native';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  userLoad: null,
  userLoaded: ['user'],
  authenticationError: null
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  token: AsyncStorage.getItem('token'),
  isAuthenticated: null,
  isLoading: true,
  user: null,
  errors: {},
})

/* ------------- Selectors ------------- */

export const GithubSelectors = {}

/* ------------- Reducers ------------- */

// request the avatar for a user
export const request = (state, { username }) =>
  state.merge({ fetching: true, username, avatar: null })

// successful avatar lookup
export const success = (state, action) => {
  const { avatar } = action
  return state.merge({ fetching: false, error: null, avatar })
}

// failed to get the avatar
export const failure = (state) =>
  state.merge({ fetching: false, error: true, avatar: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_LOAD]: request,
  [Types.USER_LOADED]: success,
  [Types.AUTHENTICATION_ERROR]: failure
})
