import { combineReducers } from 'redux';
import * as types from '../actions/actionTypes'

export function items(state = [], action) {
  switch (action.type) {
    case types.FETCH_SUSCRIPCIONES_SUCCESS:
      return action.suscripciones
    case types.FETCH_SUSCRIPCIONES_FAILED:
      return state
    case types.CREATE_SUSCRIPCION_SUCCESS:
      return [...state, action.suscripcion]
    case types.DELETE_SUSCRIPCION_SUCCESS:
      const index = state.indexOf(action.suscripcion)
      return [...state.slice(0, index), ...state.slice(index + 1, state.length)]
    default:
      return state
  }
}

export function loading(state = true, action) {
  switch (action.type) {
    case types.FETCH_SUSCRIPCIONES_SUCCESS:
      return false
    case types.FETCH_SUSCRIPCIONES_FAILED:
      return false
    default:
      return state
  }
}

export const suscripciones = combineReducers({
  items,
  loading
})