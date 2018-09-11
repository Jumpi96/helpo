import React from 'react'
import { TouchableOpacity, Image } from 'react-native'

/*
imagen
width
height(*)
 */

class Foto extends React.Component {

  render() {
    return (
      <TouchableOpacity 
        onPress={() => this.props.navigation.navigate('DetalleImagen', { imagen: this.props.imagen})}>
        <Image
        style={{ height: 120, width: this.props.width }}
        source={{ uri: this.props.imagen.url}}
        />
      </TouchableOpacity>
    )
  }
}

export default Foto