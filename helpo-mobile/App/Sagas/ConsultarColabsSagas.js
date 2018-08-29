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
import ConsultarColabsActions from '../Redux/ConsultarColabsRedux'
import eventoApi from '../Redux/api/eventoApi'
import api from '../api'

export function * getConsultarColabs (action) {
  const { eventoId } = action
  // get current data from Store
  // make the call to the api
  const response = yield call(eventoApi.getColaboracionesParticipaciones, eventoId)

  // success?
  if (response) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(ConsultarColabsActions.consultarColabsSuccess(response))
  } else {
    yield put(ConsultarColabsActions.consultarColabsFailure())
  }
}

export function * updateColaboracion(action) {
  const { id, value, eventoId } = action
  const patchData = { entregado: value }
  const response = api.patch(`/actividades/colaboraciones/${id}/`, patchData)

  if(response) {
    yield put(ConsultarColabsActions.consultarColabsRequest(eventoId))
  } else {
    yield put(ConsultarColabsActions.consultarColabsFailure())
  }
}

export function * updateParticipacion(action) {
  const { id, value, eventoId } = action
  const patchData = { participo: value }
  const response = api.patch(`/actividades/participaciones/${id}/`, patchData)

  if(response) {
    yield put(ConsultarColabsActions.consultarColabsRequest(eventoId))
  } else {
    yield put(ConsultarColabsActions.consultarColabsFailure())
  }
}
