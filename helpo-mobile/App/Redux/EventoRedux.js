import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadEventosSuccess: ['eventos'],
  loadEventosProximosSuccess: ['eventos'],
  loadEventosOrganizacionSuccess: ['eventos'],
  loadEventosConColaboracionesSuccess: ['eventos'],
  //updateEventos: null,
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  eventos: []
})

/* ------------- Selectors ------------- */

export const GithubSelectors = {}

/* ------------- Reducers ------------- */

export const requestEventos = (state, action) => {
  const { eventos } = action
  return state.merge({ eventos })
}
  

export const requestProximos = (state, action) => {
  const { eventos } = action
  return state.merge({ eventos })
}

export const requestOrganizacion = (state, action) => {
  const { eventos } = action
  return state.merge({ eventos })
}

export const requestColaboraciones = (state, action) => {
  const { eventos } = action
  return state.merge({ eventos })
}
/*
export const updateEvento = (state) => {
  const evento = action.data
  return [
    ...state.filter(evento => evento.id !== action.evento.id),
    Object.assign({}, evento),
  ];
}
*/

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_EVENTOS_SUCCESS]: requestEventos,
  [Types.LOAD_EVENTOS_PROXIMOS_SUCCESS]: requestProximos,
  [Types.LOAD_EVENTOS_ORGANIZACION_SUCCESS]: requestOrganizacion,
  [Types.LOAD_EVENTOS_CON_COLABORACIONES_SUCCESS]: requestColaboraciones,
  //[Types.UPDATE_EVENTOS_SUCCESS]: updateEvento,
})
