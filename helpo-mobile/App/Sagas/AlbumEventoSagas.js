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


