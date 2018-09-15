import React from 'react'
import { View, Dimensions } from 'react-native'
import Foto from './Foto'

/*
imagenes [1-3]
titulo
*/

/*
Renderiza una de las filas en la grilla de imagenes
del album (Filas de 1 a 3 imagenes)
*/

class GridRow extends React.Component {
  render() {
    const deviceWidth = Dimensions.get('window').width;
    const fotoWidth = deviceWidth / 3
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        {this.props.imagenes.map(imagen => (
          <Foto 
            key={imagen.id} 
            titulo={this.props.titulo} 
            imagen={imagen} 
            width={fotoWidth} 
            navigation={this.props.navigation}/>
        ))}
      </View>
    )
  }
}

export default GridRow