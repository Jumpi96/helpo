import React from 'react'
import { connect } from 'react-redux'
import ContainerHeader from '../../../../Components/ContainerHeader'
import { Container, ListItem } from 'native-base'
import { FlatList, Text,  } from 'react-native'

const DetalleColaboracion = (props) => {


  return (
    <Container>
      <ContainerHeader titulo='Detalle Colaboracion' goBack={props.navigation.goBack}/>
      <FlatList
        data={[{key: 'a'}, {key: 'b'}]}
        renderItem={({item}) => <ListItem><Text>{item.key}</Text></ListItem>}
      />
    </Container>
  )
}

export default DetalleColaboracion

