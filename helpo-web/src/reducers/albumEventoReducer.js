import initialState from './initialState';
import { combineReducers } from 'redux';
import * as types from '../actions/actionTypes'

export function props(state = {}, action) {
  switch( action.type ) {
    case types.GET_ALBUM_EVENTO_PROPS:
      return action.props
    default:
      return state
  }
}

export const albumEvento = combineReducers({
  props
})