import * as types from './actionTypes';
import eventoApi from '../api/eventoApi';

export function loadEventos() {  
  return function(dispatch) {
    return eventoApi.getAllEventos().then(eventos => {
      dispatch(loadEventosSuccess(eventos));
    }).catch(error => {
      throw(error);
    });
  };
}

export function loadEventosOrganizacion() {  
  return function(dispatch) {
    return eventoApi.getEventosOrganizacion().then(eventos => {
      dispatch(loadEventosOrganizacionSuccess(eventos));
    }).catch(error => {
      throw(error);
    });
  };
}

export function loadEventosConColaboraciones() {  
  return function(dispatch) {
    return eventoApi.getEventosConColaboraciones().then(eventos => {
      dispatch(loadEventosConColaboracionesSuccess(eventos));
    }).catch(error => {
      throw(error);
    });
  };
}

export function loadEventosProximos() {  
  return function(dispatch) {
    return eventoApi.getEventosProximos().then(eventos => {
      dispatch(loadEventosProximosSuccess(eventos));
      return eventos;
    }).catch(error => {
      throw(error);
    });
  };
}

export function updateEvento(evento) {  
  return function(dispatch) {
    return eventoApi.updateEvento(evento).then(responseEvento => {
      dispatch(updateEventoSuccess(responseEvento));
    }).catch(error => {
      throw(error);
    });
  };
}

export function loadEventosSuccess(eventos) {  
  return {type: types.LOAD_EVENTOS_SUCCESS, eventos};
}

export function loadEventosProximosSuccess(eventos) {  
  return {type: types.LOAD_EVENTOS_PROXIMOS_SUCCESS, eventos};
}

export function loadEventosOrganizacionSuccess(eventos) {  
  return {type: types.LOAD_EVENTOS_ORGANIZACION_SUCCESS, eventos};
}

export function loadEventosConColaboracionesSuccess(eventos) {  
  return {type: types.LOAD_EVENTOS_CON_COLABORACIONES_SUCCESS, eventos};
}

export function updateEventoSuccess(evento) {  
  return {type: types.UPDATE_EVENTOS_SUCCESS, evento};
}
