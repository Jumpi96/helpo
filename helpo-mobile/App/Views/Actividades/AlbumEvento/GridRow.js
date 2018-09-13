import React from 'react'
import { View, Dimensions } from 'react-native'
import Foto from './Foto'

/*
imagenes [1-3]
titulo
*/

class GridRow extends React.Component {
  render() {
    const deviceWidth = Dimensions.get('window').width;
    const fotoWidth = deviceWidth / 3
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        {this.props.imagenes.map(imagen => (
          <Foto titulo={this.props.titulo} imagen={imagen} width={fotoWidth} navigation={this.props.navigation}/>
        ))}
      </View>
    )
  }
}

export default GridRow