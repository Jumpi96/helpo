import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  consultarColabsRequest: ['eventoId'],
  consultarColabsSuccess: ['data'],
  consultarColabsFailure: null,
  consultarColabsDetalleCol: ['data'],
  consultarColabsChangeCol: ['id', 'value', 'eventoId'],
  consultarColabsChangePar: ['id', 'value', 'eventoId'],
})

export const ConsultarColabsTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  fetching: null,
  payload: null,
  error: null,
  detalle: null
})

/* ------------- Selectors ------------- */

export const ConsultarColabsSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({ fetching: true })

// successful api lookup
export const success = (state, action) => {
  const { data } = action
  return state.merge({ fetching: false, error: null, data })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, data: null })

// Cargar datos de detalle colaboración

export const detalle = (state, action) => {
  const { data } = action
  return state.merge({ detalle: data })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CONSULTAR_COLABS_REQUEST]: request,
  [Types.CONSULTAR_COLABS_SUCCESS]: success,
  [Types.CONSULTAR_COLABS_FAILURE]: failure,
  [Types.CONSULTAR_COLABS_DETALLE_COL]: detalle,
})
