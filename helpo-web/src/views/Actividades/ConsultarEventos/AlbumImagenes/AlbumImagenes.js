import React from 'react'
import { Card, CardBody, CardHeader, Button } from 'reactstrap'
import ModalImagen from './ModalImagen'

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
      imagenes: this.props.imagenes,
      modalOpen: false,
      imagenSelected: null
    }
    this.renderImagenes = this.renderImagenes.bind(this)
    this.handlePressImagen = this.handlePressImagen.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  componentDidMount() {
    this.setState({
      imagenes: imagenes
    })
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
    const urls = imagenes
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

  render() {
    return (
      <div>        
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Album de {this.props.evento} - {this.props.organizacion}
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

export default AlbumImagenes