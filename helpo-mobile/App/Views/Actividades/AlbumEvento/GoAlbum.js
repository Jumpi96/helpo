import React from 'react'
import { ListItem, Body, Text } from 'native-base'
import { View } from 'react-native'

/*
Renderiza un ListItem que al preisonarlo te lleva 
al album del evento ingresado por id.

Solo se renderiza si se ingresa un True en visible

props:
  eventoId
  visible
  navigation
*/

class GoAlbum extends React.Component {  

  render() {
    return (
      <View>
        {this.props.visible ?
        <ListItem 
          button 
          onPress={() => this.props.navigation.navigate('AlbumEvento', {
            eventoId: this.props.eventoId})}>
          <Body>
            <Text>Ver Album</Text>
          </Body>
        </ListItem>
        : undefined}
      </View>      
    )
  }
}
export default GoAlbum
