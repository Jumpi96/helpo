import React from 'react'
import { ListItem, Icon, Text, View, Left, Body, Right } from 'native-base'

const ListaColaboraciones = (props) => {
  const { necesidad, colaboraciones } = props
  let items = []
  for (let colaboracion of colaboraciones ) {
    const nombre = colaboracion.voluntario.nombre
    const apellido = colaboracion.voluntario.apellido
    const cantidad = colaboracion.cantidad
    const entregado = colaboracion.entregado
    const item = (
      <ListItem
        button
        onPress={() => props.navigation.navigate('DetalleColaboracion')}
      >
        <Left>
          <Text>{nombre}{"\n"}{apellido}</Text>
        </Left>
        <Body>
          <Text>Cantidad: {cantidad}</Text>
        </Body>
        <Right>
            {entregado
            ? <Icon type='Entypo' name='check'/>
            : <Icon type='Entypo' name='cross'/>}
        </Right>
      </ListItem>
    )
    items.push(item)
  }
    

  return (
    <View>
      <ListItem itemDivider>
        <Text>{'Recurso - ' + necesidad}</Text>
      </ListItem>
      {items}
    </View>
  )
}

export default ListaColaboraciones