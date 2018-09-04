import * as types from './actionTypes';
import api from '../api'

export function fetchEventoImagenes(eventoId) {
    return function(dispatch) {
      dispatch(fetchImagenesLoading())
      api.get(`/actividades/imagenes/${eventoId}`)
      .then( response => {
        dispatch(fetchImagenesSuccess(response.data))
      })
      .catch( error => {
        dispatch(fetchImagenesFailure(error))
      })
    }
}

export function fetchImagenesSuccess(imagenes) {
  return {
    type: types.FETCH_ALBUM_EVENTO_IMAGENES_SUCCESS,
    imagenes: imagenes
  }
}

export function fetchImagenesLoading() {
  return {
    type: types.FETCH_ALBUM_EVENTO_IMAGENES_LOADING
  }
}

export function fetchImagenesFailure(error) {
  return {
    type: types.FETCH_ALBUM_EVENTO_IMAGENES_FAILURE,
    error: error
  }
}

export function addEventoImagen(imagen) {
  return {
    type: types.ALBUM_EVENTO_ADD_IMAGEN,
    imagen: imagen
  }
}

export function getAlbumProps(props) {
  
  return {
    type: types.GET_ALBUM_EVENTO_PROPS,
    props: props
  }
}