import React from 'react'
import { Container } from 'native-base'
import ContainerHeader from '../../../Components/ContainerHeader'
import { ScrollView, Image, Dimensions } from 'react-native'

/*
imagen
removeImagen
*/

class DetalleImagen extends React.Component {
  render() {
    const imagen = this.props.navigation.state.params.imagen
    const deviceWidth = Dimensions.get('window').width;
    const deviceHeight = Dimensions.get('window').height;
    return (
      <Container>
        <ContainerHeader backgroundColor='#1f1f1f' titulo='Test' goBack={() => null}/>
        <ScrollView contentContainerStyle={{ 
              backgroundColor: '#1f1f1f',
              height: '100%' ,
              justifyContent: 'center' ,
              alignItems: 'center'}}>
          <Image
            source={{ uri: imagen.url }}
            style={{ 
              resizeMode: 'contain', 
              width: deviceWidth, 
              height: 400,
              resizeMode: 'cover',
              justifyContent: 'center'
            }}
            
          />
        </ScrollView>
      </Container>
    )
  }
}

export default DetalleImagen