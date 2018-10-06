import React from 'react'
import { ListItem, Icon, Text, View, Left, Body, Right } from 'native-base'
import { connect } from 'react-redux'
import ConsultarColabsActions from '../../../../Redux/ConsultarColabsRedux'

const noItems = (
  <ListItem>
    <Body>
      <Text>No hay colaboraciones para este recurso</Text>
    </Body>
  </ListItem>
)

const ListaColaboraciones = (props) => {
  const { necesidad, colaboraciones } = props
  let items = []
  for (let colaboracion of colaboraciones ) {
    const nombre = colaboracion.colaborador.nombre
    const apellido = colaboracion.colaborador.apellido
    const cantidad = colaboracion.cantidad
    const entregados = colaboracion.entregados
    const item = (
      <ListItem
        button
        onPress={() => {props.uploadDetalle(colaboracion);props.navigation.navigate('DetalleColaboracion')}}
      >
        <Left>
          <Text>{nombre}{"\n"}{apellido}</Text>
        </Left>
        <Body>
          <Text>Cantidad: {cantidad}</Text>
        </Body>
        <Right>
            {entregados === cantidad
            ? <Icon type='Entypo' name='check'/>
            : <Icon type='Entypo' name='cross'/>}
        </Right>
      </ListItem>
    )
    items.push(item)
  }
  
  if( items.length === 0) {
    items.push(noItems)
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

const mapDispatchToProps = (dispatch) => ({
  uploadDetalle: (colaboracion) => dispatch(ConsultarColabsActions.consultarColabsDetalleCol(colaboracion))
})

export default connect(null ,mapDispatchToProps)(ListaColaboraciones)