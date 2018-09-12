import React from 'react'
import Album from './Album'
import { connect } from 'react-redux'
import AlbumEventoActions from '../../../Redux/AlbumEventoRedux'

const images = [
  {
    url: 'https://i.imgur.com/PhKRLNx.png',
    id: 1,
    evento: 25
  },
  {
    url: 'https://i.imgur.com/pNjuenD.jpg',
    id: 2,
    evento: 25
  },
  {
    url: 'https://i.imgur.com/4bbjY6m.jpg',
    id: 3,
    evento: 25
  },
  {
    url: 'https://i.imgur.com/CXKFlVb.jpg',
    id: 4,
    evento: 25
  },
  {
    url: 'https://i.imgur.com/CPERPkh.jpg',
    id: 5,
    evento: 25
  },
]
/*
eventoId
*/

class AlbumEvento extends React.Component {

  componentDidMount() {
    //this.props.fetchImagenes(this.props.eventoId)
    this.props.fetchImagenes(20)
  }

  render() {
    return (
      <Album imagenes={this.props.imagenes} navigation={this.props.navigation}/>
    )
  }
}

const mapStateToProps = state => ({
  imagenes: state.albumEvento.imagenes,
  fetching: state.albumEvento.fetching,
  // error =  true o false
  error: state.albumEvento.error
})

const mapDispatchToProps = dispatch => ({
  fetchImagenes: eventoId => dispatch(AlbumEventoActions.albumFetchImagenes(eventoId))
})

export default connect(mapStateToProps, mapDispatchToProps)(AlbumEvento)