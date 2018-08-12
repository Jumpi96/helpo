import * as types from './actionTypes';
import EventoApi from '../api/eventoApi'

export function fetchDetalleColaboraciones(eventoId) {
  return function(dispatch) {
    dispatch(misColaboracioneshasLoaded(false))
    EventoApi.getColaboracionesParticipaciones(eventoId)
    .then( data => {
      dispatch(misColaboracioneshasLoaded(true))
      dispatch(misColaboracionesFetchDataSuccess(data))
    })    
    .catch( error => {
      dispatch(misColaboracionesHasError(true))      
      throw(error)
    })
  }
}

export function misColaboracioneshasLoaded(bool) {
  return {
    type: types.DETALLE_MIS_COLABORACIONES_HAS_LOADED,
    hasLoaded: bool,
  }
}

export function misColaboracionesHasError(bool) {
  return {
    type: types.DETALLE_MIS_COLABORACIONES_HAS_ERROR,
    hasErrors: bool,
  }
}

export function misColaboracionesFetchDataSuccess(misColaboraciones) {
  return {
    type: types.LOAD_DETALLE_MIS_COLABORACIONES_SUCCESS,
    misColaboraciones
  }
}
