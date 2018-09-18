import React from 'react'
import { Card, CardBody, CardHeader, Button } from 'reactstrap'
import ModalImagen from './ModalImagen'
import { connect } from 'react-redux'
import * as actions from '../../../../actions/albumEventoactions'
import ImagenSelecter from '../../../../utils/ImagenSelecter'
import { handleImageUpload } from '../../../../utils/Imagen'
import api from '../../../../api'

/*  ༼ つ ◕_ ◕ ༽つ Bore was here */

class AlbumImagenes extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      imagenes: this.props.imagenes,
      modalOpen: false,
      imagenSelected: null,
      url: null, // Agrego esto para facilitar el manejo del modal
      isOwner: null
    }
    this.renderImagenes = this.renderImagenes.bind(this)
    this.handlePressImagen = this.handlePressImagen.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.handleAddImage = this.handleAddImage.bind(this)
  }

  async componentDidMount() {
    const eventoId = this.props.match.params.eventoId
    const response = await api.get(`actividades/consulta_eventos/${eventoId}/`)
    const props = await {
      evento: response.data.nombre,
      eventoId: response.data.id,
      ongId: response.data.organizacion.id,
      ong: response.data.organizacion.nombre,
      ownerId: this.props.ownerId // #Negrada by Gonza
    }
    await this.props.uploadProps(props)
    this.props.fetchImagenes(eventoId)

  }

  handlePressImagen(imagen) {
    this.setState({
      imagenSelected: imagen,
      url: imagen.url
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
          <Button key={eventoImagen.id} outline onClick={() => this.handlePressImagen(eventoImagen)}>
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
    
    const imagenPicker = (
      <div className='container' style={{ width: '100%', paddingBottom: 20 }}>
        <div className='row'>
        <div style={{ marginTop: 10, marginRight: 10 }} className='sm'><p className='font-weight-bold' >Añadir imagen:</p></div>
        <ImagenSelecter className='sm' callback={this.handleAddImage} />
        </div>
        <div classname='row' style={{ backgroundColor: 'lightGray', height: 2 }}></div>
      </div>
    )

    return (
      <div>
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Album de {this.props.evento} - {this.props.ong}
          </CardHeader>
          <CardBody style={{ display: 'flex', flexWrap: 'wrap' }}>
            <p style={{ fontSize: 20 }} className='font-weight-bold' >{this.props.evento} - {this.props.ong}</p>
            {/* Si es el owner del album le habilito para añadir imagenes */}
            {this.props.isOwner ? imagenPicker : null}
            {this.renderImagenes()}
          </CardBody>
        </Card>
        <ModalImagen
          open={this.state.modalOpen}
          imagen={this.state.imagenSelected}
          url={this.state.url}
          toggle={this.toggleModal}
          isOwner={this.props.isOwner}
          remove={this.props.removeImagen}
        />
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
  error: state.albumEvento.error,
  ownerId: state.auth.user.id,
  isOwner: state.albumEvento.props.isOwner
})

const mapDispatchToProps = dispatch => ({
  fetchImagenes: eventoId => dispatch(actions.fetchEventoImagenes(eventoId)),
  addImagen: imagen => dispatch(actions.addEventoImagen(imagen)),
  removeImagen: imagen => dispatch(actions.deleteEventoImagen(imagen)),
  uploadProps: props => dispatch(actions.getAlbumProps(props))
})

export default connect(mapStateToProps, mapDispatchToProps)(AlbumImagenes)