import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  albumFetchImagenes: ['evento'],
  albumFetchSuccess: ['imagenes'],
  albumFetchFailure: null,
  albumAddImage: ['imagen'],
  albumUploadImage: ['url', 'eventoId'],
  albumRemoveImage: ['imagen'],
  albumUploadProps: ['props']
})

export const AlbumEventoTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  imagenes: [],
  fetching: null,
  error: null,
  props: {}
})

/* ------------- Selectors ------------- */

export const AlbumEventoSelectors = {
  getData: state => state.data
}

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state) =>
  state.merge({ fetching: true })

// Actualiza varios props de albumEvento
export const props = (state, action) => {
  const props = action.props
  const isOwner = props.ongId === props.ownerId ? true : false
  props.isOwner = isOwner
  return state.merge({ props })
}

// successful api lookup
export const success = (state, action) => {
  const { imagenes } = action
  return state.merge({ fetching: false, error: null, imagenes })
}

// Add imagen to album
export const add = (state, action) =>
  state.merge({ imagenes: [...state.imagenes, action.imagen] })

// Remove imagen from album
export const remove = (state, action) => {
  const index = state.imagenes.indexOf(action.imagen)
  return state.merge({ 
    imagenes: [...state.imagenes.slice(0, index), ...state.imagenes.slice(index+1, state.length)]
   })
}

// Something went wrong somewhere.
export const failure = state =>
  state.merge({ fetching: false, error: true, imagenes: [] })


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ALBUM_FETCH_IMAGENES]: request,
  [Types.ALBUM_FETCH_SUCCESS]: success,
  [Types.ALBUM_ADD_IMAGE]: add,
  [Types.ALBUM_FETCH_FAILURE]: failure,
  [Types.ALBUM_UPLOAD_PROPS]: props,
  [Types.ALBUM_REMOVE_IMAGE]: remove
})
