import { combineReducers } from 'redux';
import * as types from '../actions/actionTypes'

export function imagenes(state = [], action) {
  switch( action.type ) {
    case types.FETCH_ALBUM_EVENTO_IMAGENES_SUCCESS:
      return action.imagenes
    default:
      return state
  }
}

export function loading(state = false, action) {
  switch( action.type ) {
    case types.FETCH_ALBUM_EVENTO_IMAGENES_LOADING:
      return true
    case types.FETCH_ALBUM_EVENTO_IMAGENES_SUCCESS:
      return false
    case types.FETCH_ALBUM_EVENTO_IMAGENES_FAILURE:
      return false
    default:
      return state
  } 
}

export function error(state = null, action) {
  switch( action.type ) {
    case types.FETCH_ALBUM_EVENTO_IMAGENES_FAILURE:
      return action.error
    default:
      return state
  }
}

export function props(state = {}, action) {
  switch( action.type ) {
    case types.GET_ALBUM_EVENTO_PROPS:
      return action.props
    default:
      return state
  }
}

export const albumEvento = combineReducers({
  props,
  imagenes,
  loading,
  error
})