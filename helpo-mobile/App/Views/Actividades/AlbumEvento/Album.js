import React from 'react'
import { Container, Text } from 'native-base'
import ContainerHeader from '../../../Components/ContainerHeader'
import { FlatList } from 'react-native'
import GridRow from './GridRow'


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
    return <GridRow imagenes={item} />
  }
  
  render() {
    const imagenes = this.props.imagenes
    return (
      <Container>
        <ContainerHeader titulo='Test' goBack={() => null}/>
        {this.props.imagenes.length !== 0
        ? <FlatList data={this.transformImagenesArray(imagenes)} renderItem={this.renderItem} />
        : <Text>No hay fotito</Text>}
      </Container>
    )
  }
}
export default Album