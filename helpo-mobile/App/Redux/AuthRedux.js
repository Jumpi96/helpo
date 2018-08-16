import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { AsyncStorage } from 'react-native';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  userLoad: null,
  userLoaded: ['user'],
  loginSuccessful: null,
  authenticationError: null,
  loginFailed: null,
  registrationFailed: null,
  logoutSuccessful: null,
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

export const request = (state) =>
  state.merge({ isLoading: true, errors: null })

export const success = (state, action) => {
  const { user } = action
  return state.merge({ isAuthenticated: true, isLoading: false, user, errors: null })
}

export const logged = (state, action) => {
  AsyncStorage.setItem('token', action.data.token);
  return state.merge({ user: action.data.user, isAuthenticated: true, isLoading: false, errors: null });
}

export const failure = (state) => {
  AsyncStorage.removeItem('token');
  return state.merge({ errors: null, user: null, isAuthenticated: false, isLoading: false });
}

export const failedLogin = (state) => {
  return state.merge ({ errors: { detail: 'Los datos ingresados no son correctos.' } })
}

export const failedSignup = (state) => {
  return state; 
}

export const loggedout = (state, action) => {
  AsyncStorage.removeItem('token');
  return state.merge({ errors: action.data, token: null, user: null, isAuthenticated: false, isLoading: false })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_LOAD]: request,
  [Types.USER_LOADED]: success,
  [Types.LOGIN_SUCCESSFUL]: logged,
  [Types.AUTHENTICATION_ERROR]: failure,
  [Types.LOGIN_FAILED]: failedLogin,
  [Types.REGISTRATION_FAILED]: failedSignup,
  [Types.LOGOUT_SUCCESSFUL]: loggedout,
})
