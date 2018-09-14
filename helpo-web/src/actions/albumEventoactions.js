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

// Borra la imagen en la api
export function deleteEventoImagen(imagen) {
  return function(dispatch) {
    api.delete(`/actividades/imagen/${imagen.id}/`)
    .then( response => {
      dispatch(removeEventoImagen(imagen))
    })
    .catch( error => {
      //Ya se q no es esta accion, placeholder
      dispatch(fetchImagenesFailure(error))
    })
  }
}

// Saca la imagen del redux
export function removeEventoImagen(imagen) {
  return {
    type: types.ALBUM_EVENTO_REMOVE_IMAGEN,
    imagen: imagen
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