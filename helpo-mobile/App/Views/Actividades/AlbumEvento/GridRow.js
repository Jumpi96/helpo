import React from 'react'
import { View, Dimensions } from 'react-native'
import Foto from './Foto'

/*
imagenes [1-3]
*/

class GridRow extends React.Component {
  render() {
    const deviceWidth = Dimensions.get('window').width;
    const fotoWidth = deviceWidth / 3
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        {this.props.imagenes.map(imagen => (
          <Foto imagen={imagen} width={fotoWidth}/>
        ))}
      </View>
    )
  }
}

export default GridRow