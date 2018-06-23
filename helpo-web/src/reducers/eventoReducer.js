import * as types from '../actions/actionTypes';  
import initialState from './initialState';

export default function eventoReducer(state = initialState.eventos, action) {  
  switch(action.type) {
    case types.LOAD_EVENTOS_SUCCESS:
      return action.eventos;
    default: 
      return state;
  }
}