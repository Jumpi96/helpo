import React from 'react'
import Album from './Album'
import { connect } from 'react-redux'
import AlbumEventoActions from '../../../Redux/AlbumEventoRedux'
import api from '../../../api'

/*
eventoId
*/

/*
Busca toda la informacion desde la Api, prepara las props
y se las pasa al componente Album que renderiza el album en si
*/

class AlbumEvento extends React.Component {

  async componentDidMount() {
    //this.props.fetchImagenes(this.props.eventoId)
    const eventoId = this.props.navigation.state.params.eventoId
    const response = await api.get(`actividades/consulta_eventos/${eventoId}/`)
    const props = await {
      evento: response.data.nombre,
      eventoId: response.data.id,
      ongId: response.data.organizacion.id,
      ong: response.data.organizacion.nombre,
      ownerId: this.props.ownerId // #Negrada by Gonza
    }
    this.props.uploadProps(props)
    this.props.fetchImagenes(eventoId)
  }

  render() {
    return (
      <Album 
        imagenes={this.props.imagenes} 
        navigation={this.props.navigation}
        titulo={this.props.evento}
      />
    )
  }
}

const mapStateToProps = state => ({
  imagenes: state.albumEvento.imagenes,
  fetching: state.albumEvento.fetching,
  // error =  true o false
  error: state.albumEvento.error,
  ong: state.albumEvento.props.ong,
  ongId: state.albumEvento.props.ongId,
  evento: state.albumEvento.props.evento,
  eventoId: state.albumEvento.props.eventoId,
  ownerId: state.auth.user.id,
  isOwner: state.albumEvento.props.isOwner
})

const mapDispatchToProps = dispatch => ({
  fetchImagenes: eventoId => dispatch(AlbumEventoActions.albumFetchImagenes(eventoId)),
  uploadProps: props => dispatch(AlbumEventoActions.albumUploadProps(props))
})

export default connect(mapStateToProps, mapDispatchToProps)(AlbumEvento)