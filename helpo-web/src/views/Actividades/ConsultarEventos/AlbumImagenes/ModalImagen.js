import React from 'react'
import { Button, Modal } from 'reactstrap'

class ModalImagen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      borrando: false
    }
    this.removeImagen = this.removeImagen.bind(this)    
  }

  //Borra la imagen y cierra modal
  removeImagen() {
    if (this.state.borrando) {
      this.props.remove(this.props.imagen)
      this.props.toggle()
    }
    else {
      this.setState({
        borrando: true
      })
    }    
  }

  render() {
    
    const imageRemove = (
    <div>
      <Button 
        style={{ width: 100 }} 
        color='danger'
        onClick={() => this.removeImagen()}
        >
          Remover
      </Button>
      {this.state.borrando 
      ? <p style={{ color: 'white'}}>
          Si realmente desea remover la imagen presione nuevamente el bot&oacute;n
        </p> 
      : null}
    </div>
    )

    return (
      <Modal 
        isOpen={this.props.open} 
        toggle={this.props.toggle} 
        onClosed={() => this.setState({ borrando: false })}>     
        <div style={{ backgroundColor: 'black' }} >   
          {/* Si es el owner del album habilito para remover la imagen */}
          {this.props.isOwner ? imageRemove : null}
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