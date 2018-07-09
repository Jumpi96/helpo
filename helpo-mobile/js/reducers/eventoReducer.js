import * as types from '../actions/actionTypes';  
import initialState from './initialState';

export default function eventoReducer(state = initialState.eventos, action) {  
  switch(action.type) {
    case types.LOAD_EVENTOS_SUCCESS:
      return action.eventos;
    case types.LOAD_EVENTOS_ORGANIZACION_SUCCESS:
      return action.eventos;
    case types.UPDATE_EVENTOS_SUCCESS:
      return [
        ...state.filter(evento => evento.id !== action.evento.id),
        Object.assign({}, action.evento)
      ]
    default: 
      return state;
  }
}
