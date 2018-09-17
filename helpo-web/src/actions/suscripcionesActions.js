import * as types from './actionTypes';
import api from '../api'

export function fetchSuscripciones(userId) {
  return function (dispatch) {
    api.get(`/user/suscripciones/${userId}/`)
      .then(response => {
        dispatch(fetchSuscripcionesSuccess(response.data))
      })
      .catch(error => {
        dispatch(fetchSuscripcionesFailed(error))
      })
  }
}

export function fetchSuscripcionesSuccess(suscripciones) {
  return {
    type: types.FETCH_SUSCRIPCIONES_SUCCESS,
    suscripciones: suscripciones
  }
}

export function fetchSuscripcionesFailed(error) {
  return {
    type: types.FETCH_SUSCRIPCIONES_FAILED,
    error: error
  }
}

export function createSuscripcion(userId, ongId) {
  return function (dispatch) {
    const postData = {
      usuario: userId,
      organizacion: ongId
    }
    api.post('/user/suscripciones/', postData)
      .then(response => {
        dispatch(fetchSuscripciones(userId))
      })
      .catch(error => {
        dispatch(createSuscripcionFailed(error))
      })
  }
}

export function createSuscripcionSuccess(suscripcion) {
  return {
    type: types.CREATE_SUSCRIPCION_SUCCESS,
    suscripcion: suscripcion
  }
}

export function createSuscripcionFailed(error) {
  return {
    type: types.CREATE_SUSCRIPCION_FAILED,
    error: error
  }
}

export function deleteSuscripcion(suscripcion) {
  return function (dispatch) {
    api.delete(`/user/suscripcion/${suscripcion.id}/`)
      .then(response => {
        dispatch(deleteSuscripcionSuccess(suscripcion))
      })
      .catch(error => {
        dispatch(deleteSuscripcionFailed(error))
      })
  }
}

export function deleteSuscripcionSuccess(suscripcion) {
  return {
    type: types.DELETE_SUSCRIPCION_SUCCESS,
    suscripcion: suscripcion
  }
}


export function deleteSuscripcionFailed(error) {
  return {
    type: types.DELETE_SUSCRIPCION_FAILED,
    error: error
  }
}