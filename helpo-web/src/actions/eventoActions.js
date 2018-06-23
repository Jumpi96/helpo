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

export function loadEventosSuccess(eventos) {  
  return {type: types.LOAD_EVENTOS_SUCCESS, eventos};
}