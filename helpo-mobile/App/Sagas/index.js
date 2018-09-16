import { takeLatest, all, take } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { GithubTypes } from '../Redux/GithubRedux'
import { ConsultarColabsTypes } from '../Redux/ConsultarColabsRedux'
import { AlbumEventoTypes } from '../Redux/AlbumEventoRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { getUserAvatar } from './GithubSagas'
import { getConsultarColabs, updateColaboracion, updateParticipacion } from './ConsultarColabsSagas'
import { fetchImagenesAlbumEvento, uploadImagenAlbumEvento, deleteImagenAlbumEvento } from './AlbumEventoSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action
    takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api),

    takeLatest(ConsultarColabsTypes.CONSULTAR_COLABS_REQUEST, getConsultarColabs),
    takeLatest(ConsultarColabsTypes.CONSULTAR_COLABS_CHANGE_COL, updateColaboracion),
    takeLatest(ConsultarColabsTypes.CONSULTAR_COLABS_CHANGE_PAR, updateParticipacion),
    takeLatest(AlbumEventoTypes.ALBUM_FETCH_IMAGENES, fetchImagenesAlbumEvento),
    takeLatest(AlbumEventoTypes.ALBUM_UPLOAD_IMAGE, uploadImagenAlbumEvento),
    takeLatest(AlbumEventoTypes.ALBUM_REMOVE_IMAGE, deleteImagenAlbumEvento)
  ])
}
