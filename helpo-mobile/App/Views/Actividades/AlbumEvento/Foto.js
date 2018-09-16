import React from 'react'
import { TouchableOpacity, Image } from 'react-native'

/*
imagen
width
height(*)
titulo
 */

 /*
 Este componenente renderiza la Foto/Boton
 en el componente GridRow, y cuando se presiona te 
 lleva al detalle de la imagen
 */

class Foto extends React.Component {

  render() {
    return (
      <TouchableOpacity 
        onPress={() => this.props.navigation.navigate('DetalleImagen', { imagen: this.props.imagen, titulo: this.props.titulo})}>
        <Image
        style={{ height: 120, width: this.props.width, resizeMode: 'stretch' }}
        source={{ uri: this.props.imagen.url}}
        />
      </TouchableOpacity>
    )
  }
}

export default Foto