import React from 'react'
import { ListItem, Icon, Text, View, Left, Body, Right } from 'native-base'
import { connect } from 'react-redux'
import ConsultarColabsActions from '../../../../Redux/ConsultarColabsRedux'

const noItems = (
  <ListItem>
    <Body>
      <Text>No hay participaciones para esta funcion</Text>
    </Body>
  </ListItem>
)

const ListaVoluntarios = (props) => {
  const { funcion, participaciones } = props
  let items = []
  for (let participacion of participaciones ) {
    const nombre = participacion.voluntario.nombre
    const apellido = participacion.voluntario.apellido
    const participo = participacion.participo
    const item = (
      <ListItem
        button
        onPress={() => {props.uploadDetalle(participacion);props.navigation.navigate('DetalleParticipacion')}}
      >
        <Left>
          <Text>{nombre}{"\n"}{apellido}</Text>
        </Left>
        <Body>
        </Body>
        <Right>
            {participo
            ? <Icon color='red' type='Entypo' name='check'/>
            : <Icon color='black' type='Entypo' name='cross'/>}
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
        <Text>{'Funcion - ' + funcion}</Text>
      </ListItem>
      {items}
    </View>
  )
}

const mapDispatchToProps = (dispatch) => ({
  uploadDetalle: (participacion) => dispatch(ConsultarColabsActions.consultarColabsDetalleCol(participacion))
})

export default connect(null ,mapDispatchToProps)(ListaVoluntarios)