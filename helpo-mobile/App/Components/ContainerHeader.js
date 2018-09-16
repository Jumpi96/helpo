import React from 'react'
import { Header, Left, Button, Icon, Body, Title } from 'native-base'

/*
  Para poder reusar el header y no meter tanto codigo
  Props:
    titulo: String
    goBack: Function (Donde quieras que vaya cuando toques la flechita)
    backgroundColor (optional)
*/
const ContainerHeader = (props) => {
  const { titulo, goBack } = props
  const bgColor = { backgroundColor: props.backgroundColor}
  return (
    <Header style={props.backgroundColor ? bgColor : {}}>
      <Left>
        <Button transparent onPress={() => goBack()}>
          <Icon name="arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>{titulo}</Title>
      </Body>
    </Header>
  )
}

export default ContainerHeader