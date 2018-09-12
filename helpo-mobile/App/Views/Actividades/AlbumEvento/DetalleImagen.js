import React from 'react'
import { Container, Fab, Icon } from 'native-base'
import ContainerHeader from '../../../Components/ContainerHeader'
import { ScrollView, Image, Dimensions } from 'react-native'

/*
imagen
removeImagen
*/

class DetalleImagen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      height: 0,
    }
  }
  
  render() {
    const imagen = this.props.navigation.state.params.imagen
    const deviceWidth = Dimensions.get('window').width;
    Image.getSize(imagen.url, (width, height) => this.setState({width, height}))
    return (
      <Container>
        <ContainerHeader backgroundColor='#1f1f1f' titulo='Test' goBack={() => null}/>
        <ScrollView contentContainerStyle={{ 
              flex: 1,
              backgroundColor: '#1f1f1f',
              height: '100%' ,
              width: deviceWidth,
              justifyContent: 'center' ,
              alignItems: 'center'}}
              maximumZoomScale={3}>
          <Image
            source={{ uri: imagen.url, width: deviceWidth, height: this.state.height }}
            style={{ 
              resizeMode: 'contain'
            }}
            
          />
        </ScrollView>
        <Fab style={{ backgroundColor: 'red' }} onPress={this.props.removeImagen}>
          <Icon color='white' type='Entypo' name='cross'/>
        </Fab>
      </Container>
    )
  }
}


export default DetalleImagen