import React from 'react'
import { Container, Fab, Icon } from 'native-base'
import ContainerHeader from '../../../Components/ContainerHeader'
import { ScrollView, Image, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import AlbumEventoActions from '../../../Redux/AlbumEventoRedux'

/*
imagen
removeImagen
titulo
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
    const goBack = () => this.props.navigation.goBack()
    const imagen = this.props.navigation.state.params.imagen
    const titulo = this.props.navigation.state.params.titulo
    const deviceWidth = Dimensions.get('window').width;
    Image.getSize(imagen.url, (width, height) => this.setState({width, height}))
    return (
      <Container>
        <ContainerHeader backgroundColor='#1f1f1f' titulo={titulo} goBack={goBack}/>
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
        {/* Si usuario isOwner, dejo agregar foto */}
        {this.props.isOwner ? 
        (<Fab style={{ backgroundColor: 'red' }} onPress={() => {this.props.removeImagen(imagen); goBack()}}>
          <Icon color='white' type='Entypo' name='cross'/>
         </Fab>)
        : undefined }        
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  isOwner: state.albumEvento.props.isOwner
})

const mapDispatchToProps = dispatch => ({
  removeImagen: imagen => dispatch(AlbumEventoActions.albumRemoveImage(imagen))
})

export default connect(mapStateToProps, mapDispatchToProps)(DetalleImagen)