import React from 'react'
import { Card, CardBody, CardHeader, Button } from 'reactstrap'
import ModalImagen from './ModalImagen'
import { connect } from 'react-redux'
import * as actions from '../../../../actions/albumEventoactions'
import ImagenSelecter from '../../../../utils/ImagenSelecter'
import { handleImageUpload } from '../../../../utils/Imagen'
import api from '../../../../api'

/* TODO: Por ahora solo anda el album si se ingresa desde el ButtonGoAlbum
         Desirable, armar un redux llamada api que busque la info q hace falta
         Probablemente deje de ser desirable y pase a ser mandatory ༼ つ ◕_ ◕ ༽つ */

class AlbumImagenes extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      imagenes: this.props.imagenes,
      modalOpen: false,
      imagenSelected: null,
      isOwner: false
    }
    this.renderImagenes = this.renderImagenes.bind(this)
    this.handlePressImagen = this.handlePressImagen.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.handleAddImage = this.handleAddImage.bind(this)
  }

  componentDidMount() {
    this.props.fetchImagenes(this.props.eventoId)
  }

  handlePressImagen(url) {
    this.setState({
      imagenSelected: url
    })
    this.toggleModal()
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    })
  }

  async handleAddImage(imageData) {
    // Sube imagen a Imgur, despues la sube api helpo y por ultimo al redux
    const url = await handleImageUpload(imageData)
    try {
      const postData = { url: url, evento: this.props.eventoId }
      const postUrl = '/actividades/imagenes/'
      const response = await api.post(postUrl, postData)
      await this.props.addImagen(response.data)      
    }
    catch (error) {

    }
  }

  renderImagenes() {
    const eventoImagenes = this.props.imagenes
    if (eventoImagenes.length === 0) {
      return (
        <div>
          <p className='text-muted' >No hay imagenes para este album</p>
        </div>
      )
    } else {

      const images = eventoImagenes.map(eventoImagen => (
        <div key={eventoImagen.id} style={{ padding: 5 }}>
          <Button key={eventoImagen.id} outline onClick={() => this.handlePressImagen(eventoImagen.url)}>
            <img
              key={eventoImagen.id}
              src={eventoImagen.url}
              alt='Foto'
              width='200'
              height='200'
            />
          </Button>
        </div>
      ))
      return images
    }

  }

  render() {
    return (
      <div>
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Album de {this.props.evento} - {this.props.ong}
          </CardHeader>
          <CardBody style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ width: '100%', paddingBottom: 20 }}>
              <p className='text-bold' >Añadir imagen: </p>
              <ImagenSelecter callback={this.handleAddImage} />
            </div>
            {this.renderImagenes()}
          </CardBody>
        </Card>
        <ModalImagen open={this.state.modalOpen} imagen={this.state.imagenSelected} toggle={this.toggleModal} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ong: state.albumEvento.props.ong,
  ongId: state.albumEvento.props.ongId,
  evento: state.albumEvento.props.evento,
  eventoId: state.albumEvento.props.eventoId,
  imagenes: state.albumEvento.imagenes,
  loading: state.albumEvento.loading,
  error: state.albumEvento.error
})

const mapDispatchToProps = dispatch => ({
  fetchImagenes: eventoId => dispatch(actions.fetchEventoImagenes(eventoId)),
  addImagen: imagen => dispatch(actions.addEventoImagen(imagen))
})

export default connect(mapStateToProps, mapDispatchToProps)(AlbumImagenes)