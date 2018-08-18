import * as types from '../actions/actionTypes'
import initialState from './initialState';
import { combineReducers } from 'redux';

export function consultarColaboracionesData( state = initialState.consultarColaboraciones, action ) {
  switch( action.type ) {
    case types.LOAD_CONSULTAR_COLABORACIONES_SUCCESS:
      return action.consultarColaboraciones
    default:
      return state
  }
}

export function consultarColaboracionesLoaded( state = false, action ) {
  switch( action.type ) {
    case types.CONSULTAR_COLABORACIONES_HAS_LOADED:
      return action.hasLoaded
    default:
      return state
  }
}

export function consultarColaboracionesHasError( state = false, action ) {
  switch( action.type ) {
    case types.CONSULTAR_COLABORACIONES_HAS_ERROR:
      return action.hasErrors
    default:
      return state
  }
}

/*export function consultarColaboracionesChangeValue( state, action) {
  switch( action.type ) {
    case types.CHANGE_COLABORACION_ENTREGA:
      return { ...state, }
    case types.CHANGE_COLABORACION_PARTICIPACION
    default:
      return state
  }
}*/

export const consultarColaboraciones = combineReducers({
  consultarColaboracionesData,
  consultarColaboracionesLoaded,
  consultarColaboracionesHasError
})