import React from 'react'
import { TouchableOpacity, Image } from 'react-native'

/*
imagen
width
height(*)
 */

class Foto extends React.Component {

  render() {
    console.tron.log(this.props)
    return (
      <TouchableOpacity>
        <Image
        style={{ height: 120, width: this.props.width }}
        source={{ uri: this.props.imagen.url}}
        />
      </TouchableOpacity>
    )
  }
}

export default Foto