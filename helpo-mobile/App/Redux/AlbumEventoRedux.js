import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  albumFetchImagenes: ['evento'],
  albumFetchSuccess: ['imagenes'],
  albumFetchFailure: [],
  albumAddImage: ['imagen'],
  albumRemoveImage: ['imagen']
})

export const AlbumEventoTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  imagenes: [],
  fetching: null,
  error: null,
})

/* ------------- Selectors ------------- */

export const AlbumEventoSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({ fetching: true })

// successful api lookup
export const success = (state, action) => {
  const { imagenes } = action
  return state.merge({ fetching: false, error: null, imagenes })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, imagenes: [] })


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ALBUM_FETCH_IMAGENES]: request,
  [Types.ALBUM_FETCH_SUCCESS]: success,
  [Types.ALBUM_FETCH_FAILURE]: failure,
})
