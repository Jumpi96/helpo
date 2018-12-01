
import React, { Component } from 'react';
import { Button, Spinner } from 'native-base';


class ConsultarEventosInicial extends Component {

  render() {
    return (
      <Button onPress={
        this.props.navigation.navigate('ConsultarEventos', {
          evento: '',
          link: '',
          organizacion: ''
        })
      }><Spinner color='red' /></Button>
    );
  }
}

export default ConsultarEventosInicial;
