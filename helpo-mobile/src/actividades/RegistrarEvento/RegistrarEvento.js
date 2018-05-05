import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Route, Link } from 'react-router-native';
import styles from './RegistrarEventoCSS';
import SelectorUbicacion from './SelectorUbicacion/SelectorUbicacion';

class Actividades extends Component {
    render(){
      return (
        <View>
          <Text>TODO: todo registrar evento</Text>
          <SelectorUbicacion />
        </View>
      );
    }
  }
  
  export default Actividades;