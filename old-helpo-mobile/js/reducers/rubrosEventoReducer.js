import * as types from '../actions/actionTypes';  
import initialState from './initialState';

export default function courseReducer(state = initialState.rubrosEvento, action) {  
  switch(action.type) {
    case types.LOAD_RUBROS_EVENTO_SUCCESS:
      return action.rubrosEvento; 
    default: 
      return state;
  }
}