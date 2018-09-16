import { combineReducers } from 'redux';
import * as types from '../actions/actionTypes'

export function imagenes(state = [], action) {
  switch( action.type ) {
    case types.FETCH_ALBUM_EVENTO_IMAGENES_SUCCESS:
      return action.imagenes
    case types.ALBUM_EVENTO_ADD_IMAGEN:
      return [...state, action.imagen]
    case types.ALBUM_EVENTO_REMOVE_IMAGEN:      
      const index = state.indexOf(action.imagen)
      return [...state.slice(0, index), ...state.slice(index+1, state.length)]
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
    const props = action.props
    const isOwner = props.ongId === props.ownerId ? true : false
    props.isOwner = isOwner      
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