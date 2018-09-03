import React from 'react'
import { Card, CardBody, CardHeader, Button } from 'reactstrap'
import ModalImagen from './ModalImagen'
import { connect } from 'react-redux'
import * as actions from '../../../../actions/albumEventoactions'

/* TODO: Por ahora solo anda el album si se ingresa desde el ButtonGoAlbum
         Desirable, armar un redux llamada api que busque la info q hace falta
         Probablemente deje de ser desirable y pase a ser mandatory ༼ つ ◕_ ◕ ༽つ */

const imagenes = [
  'https://i.imgur.com/vt1Bu3m.jpg',
  'https://i.imgur.com/dma96XC.jpg',
  'https://i.imgur.com/oPGJUzw.jpg',
  'https://i.imgur.com/z6iTu7s.jpg',
  'https://i.imgur.com/AF5NX5B.jpg',
  'https://i.imgur.com/1vH49b6.jpg',
  'https://i.imgur.com/bPiPoDI.jpg',
  'https://i.imgur.com/lSXuUuD.jpg'
]

class AlbumImagenes extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      imagenes: [],
      modalOpen: false,
      imagenSelected: null,
    }
    this.renderImagenes = this.renderImagenes.bind(this)
    this.handlePressImagen = this.handlePressImagen.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
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

  renderImagenes() {
    const urls = this.props.imagenes
    if(urls.length === 0) {
      return (
        <div>
          <p>No hay imagenes para este album</p>
        </div>
      )
    } else {

      const images = urls.map( url => (
        <div style={{ padding: 5 }}>
          <Button outline onClick={() => this.handlePressImagen(url)}>
          <img
            src={url}
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
            {this.renderImagenes()}
          </CardBody>
        </Card>
        <ModalImagen open={this.state.modalOpen} imagen={this.state.imagenSelected} toggle={this.toggleModal}/>
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
  fetchImagenes: eventoId => dispatch(actions.fetchEventoImagenes(eventoId)) 
})

export default connect(mapStateToProps, mapDispatchToProps)(AlbumImagenes)