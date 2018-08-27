import * as types from '../actions/actionTypes'
import { combineReducers } from 'redux';

export function consultarColaboracionesData( state = {}, action ) {
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

/*
En entregados y participaciones se va  guardar un objeto donde
KEY = id de colaboracion o participacion
VALUE = True o False dependiendo de como cambio
La idea de estos estados de redux es para que sea facil mandar los cambios a la api
*/
export function entregados( state = {}, action ) {
  switch( action.type ) {
    case types.CHANGE_COLABORACION_ENTREGA:
      return { ...state, [action.colaboracion]: action.value}
    default:
      return state
  }
}

export function participaciones( state = {}, action ) {
  switch( action.type ) {
    case types.CHANGE_COLABORACION_PARTICIPACION:
      return { ...state, [action.participacion]: action.value}
    default:
      return state
  }
}

export function sentDataSuccess( state = false, action) {
  switch( action.type ) {
    case types.SEND_CONSULTAR_COLABORACIONES_SUCCESFUL:
      return action.success
    default:
      return state
  }
}

export function sentDataHadError( state = false, action) {
  switch( action.type) {
    case types.SEND_CONSULTAR_COLABORACIONES_HAD_ERROR:
      return true
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
  consultarColaboracionesHasError,
  participaciones,
  entregados,
  sentDataSuccess,
  sentDataHadError
})