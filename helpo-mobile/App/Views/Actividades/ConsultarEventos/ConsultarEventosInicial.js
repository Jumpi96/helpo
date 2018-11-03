
import React, { Component } from 'react';
import { Button, Text } from 'native-base';


class ConsultarEventosInicial extends Component {

  render() {
    return (
      <Button onPress={
        this.props.navigation.navigate('ConsultarEventos', {
          evento: '',
          link: '',
          organizacion: ''
        })
      }><Text>Cargando...</Text></Button>
    );
  }
}

export default ConsultarEventosInicial;
