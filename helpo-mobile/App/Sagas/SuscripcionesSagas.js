/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put } from 'redux-saga/effects'
import SuscripcionesActions from '../Redux/SuscripcionesRedux'
import api from '../api'

/*{{}}*/
export function * fetchSuscripciones(action) {
  // Fetchear la suscripciones de un user
  // usuario == usuarioId
  const { usuario } = action
  const apiCall = id => api.get(`/user/suscripciones/${id}/`)
  const response = yield call(apiCall, usuario)
  if (response) {
    // If fetch was succesful
    const suscripciones = response.data
    yield put(SuscripcionesActions.suscripcionesFetchSuccess(suscripciones))
  }
  else {
    yield put(SuscripcionesActions.suscripcionesFetchFailed())
  }
}

export function * createSuscripcion(action) {
  // Postea una nueva suscripcion en la api
  // usuario: userId
  // organizacion: organizacionId
  const { usuario, organizacion } = action
  const postData = {
    usuario: usuario,
    organizacion: organizacion
  }
  const apiCall = postData => api.post('/user/suscripciones/', postData)
  const response = yield call(apiCall, postData)
  if (response) {
    // If post was succesful
    yield put(SuscripcionesActions.suscripcionesFetch(usuario))
  }
  else {
    yield put(SuscripcionesActions.suscripcionesCreateFailed())
  }
}

export function * deleteSuscripcion(action) {
  // Deletea una suscripcion en la api
  const { suscripcion } = action
  const apiCall = id => api.delete(`/user/suscripcion/${id}/`)
  const response = yield call(apiCall, suscripcion.id)
  if (response) {
    // If delete was succesful
    yield put(SuscripcionesActions.suscripcionesDeleteSuccess(suscripcion))
  }
  else {
    yield put(SuscripcionesActions.suscripcionesDeleteFailed())
  }
}