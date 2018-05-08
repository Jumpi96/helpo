import React from 'react';
import { Text, View } from 'react-native';
import { Route, Link } from 'react-router-native';
import styles from './RegistrarEventoCSS';
import SelectorUbicacion from './SelectorUbicacion/SelectorUbicacion';

class RegistrarEvento extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
        //TODO: ubicacion que pasamos por defecto debería ser la de la ONG. Ahora, Córdoba.
        ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: ''}, 
    };
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
  }

  handleUbicacionChange(ubi) {
    this.setState({ubicacion: ubi});
  }

    render(){
      return (
        <View>
          <Text>TODO: todo registrar evento</Text>
          <SelectorUbicacion
            ubicacion={this.state.ubicacion}
            onUbicacionChange={this.handleUbicacionChange} />
        </View>
      );
    }
  }
  
  export default RegistrarEvento;