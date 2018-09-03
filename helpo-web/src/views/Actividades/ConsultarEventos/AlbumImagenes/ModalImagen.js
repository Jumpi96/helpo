import React from 'react'
import { Modal } from 'reactstrap'

class ModalImagen extends React.Component {

  render() {
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <img
          src={this.props.imagen}
          alt='Foto'
          width='500'
          height='500'          
          />
      </Modal>
    )
  }
}

export default ModalImagen