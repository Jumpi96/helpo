import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadRubrosEventoSuccess: ['rubrosEvento'],
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  rubrosEvento: []
})

/* ------------- Selectors ------------- */

export const GithubSelectors = {}

/* ------------- Reducers ------------- */

export const requestRubrosEvento = (state, action) => {
  const { rubrosEvento } = action
  return state.merge({ rubrosEvento })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_RUBROS_EVENTO_SUCCESS]: requestRubrosEvento,
})
