import React from 'react'
import { Button, Modal } from 'reactstrap'

class ModalImagen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      borrando: false,
      sizes: {
        height: 0,
        width: 0
      }
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

  setImageSizes(sizes) {
    console.log(sizes)
    this.setState({
      sizes: sizes
    })
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
    
    // I get the screen size and based on that, set the image size
    const screenw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const maxScreenw = screenw > 800 ? 800 : screenw

    return (
      <Modal 
        style={{ alignItems: 'center' ,justifyContent: 'center', display: 'flex'}}
        isOpen={this.props.open} 
        toggle={this.props.toggle} 
        onClosed={() => this.setState({ borrando: false })}>     
        <div style={{ alignItems: 'center' ,justifyContent: 'center', display: 'flex'}}>
        <div style={{ backgroundColor: 'black' }} >   
          {/* Si es el owner del album habilito para remover la imagen */}
          {this.props.isOwner ? imageRemove : null}
          <img
            style={{ width: maxScreenw, height: 'auto' }}
            src={this.props.url}
            alt='Foto'  
            />
          </div>
          </div>
      </Modal>
    )
  }
}

export default ModalImagen