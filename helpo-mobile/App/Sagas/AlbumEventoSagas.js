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
import AlbumEventoActions from '../Redux/AlbumEventoRedux'
import api from '../api'

export function * fetchImagenesAlbumEvento(action) {
  // fetch the event images from the event of eventoId
  // evento == eventoId
  const { evento } = action
  const apiCall = id => api.get(`/actividades/imagenes/${id}`)
  // Calls apiCall and it passes eventoId as a parameter
  const response = yield call(apiCall, evento)
  if (response) {
    //If the fetch was succesful
    yield put(AlbumEventoActions.albumFetchSuccess(response.data))
  } else {
    yield put(AlbumEventoActions.albumFetchFailure())
  }
}

export function * uploadImagenAlbumEvento(action) {
  // upload imagen (url) to api
  const { url, eventoId } = action
  const postData = { url: url, evento: eventoId }
  const apiCall = postData => api.post('/actividades/imagenes/', postData)
  // Calls apiCall and it passes postData as a parameter
  const response = yield call(apiCall, postData)
  if (response) {
    yield put(AlbumEventoActions.albumAddImage(response.data))
  } else {
    yield put(AlbumEventoActions.albumFetchFailure())
  }
}

export function * deleteImagenAlbumEvento(action) {
    // upload imagen (url) to api
    const { imagen } = action
    const imagenId = imagen.id 
    const apiCall = imagenId => api.delete(`/actividades/imagen/${imagenId}/`)
    // Calls apiCall and it passes postData as a parameter
    const response = yield call(apiCall, imagenId)
    if (response) {
      // No hago nada porq la borro de redux sea exitoso o no
    } else {
      yield put(AlbumEventoActions.albumFetchFailure())
    }
}

