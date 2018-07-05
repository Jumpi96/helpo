import * as types from './actionTypes';  
import rubroEventoApi from '../api/rubroEventoApi';

export function loadRubrosEvento() {  
  return function(dispatch) {
    return rubroEventoApi.getAllRubrosEvento().then(rubrosEvento => {
      dispatch(loadRubrosEventoSuccess(rubrosEvento));
    }).catch(error => {
      throw(error);
    });
  };
}

export function loadRubrosEventoSuccess(rubrosEvento) {  
  return {type: types.LOAD_RUBROS_EVENTO_SUCCESS, rubrosEvento};
}