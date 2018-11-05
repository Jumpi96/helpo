import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  verAntiguasChange: ['value']
})

export const FiltroActividadesTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  verAntiguas: false
})

/* ------------- Selectors ------------- */

export const FiltroActividadesSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// Change verAntigas value
export const verAntiguas = (state, action) =>
  state.merge({ verAntiguas: action.value })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.VER_ANTIGUAS_CHANGE]: verAntiguas,
})
