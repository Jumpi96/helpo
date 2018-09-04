import React from 'react'
import { Button, Modal } from 'reactstrap'

class ModalImagen extends React.Component {

  constructor(props) {
    super(props)
    this.removeImagen = this.removeImagen.bind(this)
  }

  //Borra la imagen y cierra modal
  removeImagen() {
    this.props.remove(this.props.imagen)
    this.props.toggle()
  }

  render() {
    
    const imageRemove = (
      <Button 
        style={{ width: 100 }} 
        color='danger'
        onClick={() => this.removeImagen()}
        >
          Remover
      </Button>
    )

    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>     
        <div style={{ backgroundColor: 'gray' }} >   
          {/* Si es el owner del album habilito para remover la imagen */}
          {this.props.isOwner ? imageRemove : undefined}
          <img
            src={this.props.url}
            alt='Foto'
            width='500'
            height='500'          
            />
          </div>
      </Modal>
    )
  }
}

export default ModalImagen