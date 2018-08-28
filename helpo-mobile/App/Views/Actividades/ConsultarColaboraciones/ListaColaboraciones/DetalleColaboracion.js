import React from 'react'
import { connect } from 'react-redux'
import ContainerHeader from '../../../../Components/ContainerHeader'
import { Container, ListItem, Left, Body, Text } from 'native-base'
import { FlatList } from 'react-native'

const DetalleColaboracion = (props) => {


  return (
    <Container>
      <ContainerHeader titulo='Detalle Colaboracion' goBack={props.navigation.goBack}/>
      <FlatList
        data={[{key: 'a'}, {key: 'b'}]}
        renderItem={({item}) => (<ListItem>
                                  <Left>
                                    <Text>{item.key}: </Text>
                                  </Left>
                                  <Body>
                                    <Text>Aloha</Text>
                                  </Body>
                                </ListItem>)}
      />
    </Container>
  )
}

export default DetalleColaboracion

