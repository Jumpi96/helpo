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
      <TouchableHighlight>
        <Image
        style={{ height: 200, width: this.props.width }}
        source={this.props.imagen.url}
        />
      </TouchableHighlight>
    )
  }
}

export default Foto