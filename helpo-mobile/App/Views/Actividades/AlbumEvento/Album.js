import React from 'react'
import { Container, Text, Fab, Icon } from 'native-base'
import ContainerHeader from '../../../Components/ContainerHeader'
import { FlatList } from 'react-native'
import GridRow from './GridRow'
import ImagePicker from 'react-native-image-picker'
import { handleImageUpload } from '../../../Services/Imagen'
import { connect } from 'react-redux'
import AlbumEventoActions from '../../../Redux/AlbumEventoRedux'


/*
titulo
imagenes
goBack
uploadImagen
removeImagen(*)
*/

class Album extends React.Component {

  constructor(props) {
    super(props)
    this.transformImagenesArray = this.transformImagenesArray.bind(this)
    this.addImagen = this.addImagen.bind(this)
  }

  async addImagen() {
    // Llamo al imagePicker y hago todo el procesamiento de cargar una imagen
    //Options for the image picker
    const options = {
      title: 'Seleccionar Imagen',
    };
    ImagePicker.showImagePicker(options, async (response) => {
      // Paso la data de la imagen a Imagen para subirla a imgur
      const url = await handleImageUpload(response.data)
      this.props.uploadImagen(url, 20)
    })
  }

  transformImagenesArray(imagenes) {
    /*
    Divide un array de imagenes en arrays de length 3
    y los devuelve dentro de otro array
    (array de arrays(3)) 
    */ 
    const imgArray = []
    let tmpArray = []
    for (imagen of imagenes) {
      tmpArray.push(imagen)      
      if (tmpArray.length === 3) {
        imgArray.push(tmpArray)
        tmpArray = []
      }
    }
    //Si al final no queda vacio tmpArray lo meto al imgArray
    if (tmpArray.length !== 0) { imgArray.push(tmpArray) }
    return imgArray
  }

  renderItem = ({item}) => {
    //item debe ser un array de 1-3 imagenes
    return <GridRow titulo={this.props.titulo} imagenes={item} navigation={this.props.navigation}/>
  }
  
  render() {
    const imagenes = this.props.imagenes
    const header = this.props.titulo
    return (
      <Container>
        <ContainerHeader titulo={this.props.titulo} goBack={() => null}/>
        {this.props.imagenes.length !== 0
        ? <FlatList data={this.transformImagenesArray(imagenes)} renderItem={this.renderItem} />
        : <Text>No hay fotito</Text>}
        <Fab style={{ backgroundColor: 'green' }} onPress={this.addImagen}>
          <Icon color='white' type='Entypo' name='plus'/>
        </Fab>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  uploadImagen: (url, eventoId) => dispatch(AlbumEventoActions.albumUploadImage(url, eventoId))
})

export default connect(null, mapDispatchToProps)(Album)