import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  suscripcionesFetch: ['usuario'],
  suscripcionesFetchSuccess: ['suscripciones'],
  suscripcionesFetchFailed: null,
  suscripcionesCreate: ['usuario', 'organizacion'],
  suscripcionesCreateFailed: null,
  suscripcionesDelete: ['suscripcion'],
  suscripcionesDeleteSuccess: ['suscripcion'],
  suscripcionesDeleteFailed: null
})

export const SuscripcionesTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  items: [],
  loading: true,
  error: false
})

/* ------------- Selectors ------------- */

export const SuscripcionesSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({ loading: true })

export const remove = (state, action) => {
  const index = state.items.indexOf(action.suscripcion)
  return state.merge({
    items: [...state.items.slice(0, index), ...state.items.slice(index + 1, state.items.length)]
  })
}

// successful api lookup
export const success = (state, action) => {
  const { suscripciones } = action
  return state.merge({ loading: false, error: null, items: suscripciones })
}


// Something went wrong somewhere.
export const failure = state =>
  state.merge({ loading: false, error: true })


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SUSCRIPCIONES_FETCH]: request,
  [Types.SUSCRIPCIONES_FETCH_SUCCESS]: success,
  [Types.SUSCRIPCIONES_FETCH_FAILED]: failure,
  [Types.SUSCRIPCIONES_CREATE_FAILED]: failure,
  [Types.SUSCRIPCIONES_DELETE_SUCCESS]: remove,
  [Types.SUSCRIPCIONES_DELETE_FAILED]: failure,
})
