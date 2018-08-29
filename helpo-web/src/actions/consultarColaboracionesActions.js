import * as types from './actionTypes';
import EventoApi from '../api/eventoApi'

export function fetchDetalleColaboraciones(eventoId) {
  return function( dispatch ) {
    dispatch(consultarColaboracioneshasLoaded(false))
    EventoApi.getColaboracionesParticipaciones(eventoId)
    .then( data => {    
      dispatch(consultarColaboracionesFetchDataSuccess(data))
      dispatch(consultarColaboracioneshasLoaded(true))
    })    
    .catch( error => {
      dispatch(consultarColaboracionesHasError(true))      
      throw(error)
    })
  }
}

export function consultarColaboracioneshasLoaded(bool) {
  return {
    type: types.CONSULTAR_COLABORACIONES_HAS_LOADED,
    hasLoaded: bool,
  }
}

export function consultarColaboracionesHasError(bool) {
  return {
    type: types.CONSULTAR_COLABORACIONES_HAS_ERROR,
    hasErrors: bool,
  }
}

export function consultarColaboracionesFetchDataSuccess(consultarColaboraciones) {
  return {
    type: types.LOAD_CONSULTAR_COLABORACIONES_SUCCESS,
    consultarColaboraciones
  }
}

export function consultarColaboracionesSentSuccess(bool) {
  return {
    type: types.SEND_CONSULTAR_COLABORACIONES_SUCCESFUL,
    wasSuccesful: bool
  }
}

export function consultarColaboracionesHadError(bool) {
  return {
    type: types.SEND_CONSULTAR_COLABORACIONES_HAD_ERROR,
    hadError: bool
  }
}

export function consultarColaboracionesChangeParticipacion(bool, participacionId) {
  return {
    type: types.CHANGE_COLABORACION_PARTICIPACION,
    participacion: participacionId,
    value: bool
  }
}

export function consultarColaboracionesChangeColaboracion(bool, colaboracionId) {
  return {
    type: types.CHANGE_COLABORACION_ENTREGA,
    colaboracion: colaboracionId,
    value: bool
  }
}

export function consultarColaboracionesSendDataSuccessful(bool) {
  return {
    type: types.SEND_CONSULTAR_COLABORACIONES_SUCCESFUL,
    success: bool
  }
}

export function consultarColaboracionesSendDataHadError(bool) {
  return {
    type: types.SEND_CONSULTAR_COLABORACIONES_HAD_ERROR,
    hadError: bool
  }
}

//export function consultarColaboracionesSendData()
