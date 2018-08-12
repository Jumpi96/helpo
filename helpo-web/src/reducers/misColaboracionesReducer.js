import * as types from '../actions/actionTypes'
import initialState from './initialState';
import { combineReducers } from 'redux';

export function misColaboracionesData( state = initialState.misColaboraciones, action ) {
  switch( action.type ) {
    case types.LOAD_MIS_COLABORACIONES_SUCCESS:
      return action.misColaboraciones
    default:
      return state
  }
}

export function misColaboracionesLoaded( state = false, action ) {
  switch( action.type ) {
    case types.MIS_COLABORACIONES_HAS_LOADED:
      return action.hasLoaded
    default:
      return state
  }
}

export function misColaboracionesHasError( state = false, action ) {
  switch( action.type ) {
    case types.MIS_COLABORACIONES_HAS_ERROR:
      return action.hasError
    default:
      return state
  }
}

export const misColaboraciones = combineReducers({
  misColaboracionesData,
  misColaboracionesLoaded,
  misColaboracionesHasError
})