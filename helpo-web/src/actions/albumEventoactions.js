import * as types from './actionTypes';

export function getAlbumProps(props) {
  
  return {
    type: types.GET_ALBUM_EVENTO_PROPS,
    props: props
  }
}