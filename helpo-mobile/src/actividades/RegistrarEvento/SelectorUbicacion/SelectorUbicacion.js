import React, { Component , View } from 'react';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import RNGooglePlacePicker from 'react-native-google-place-picker';
import styles from './SelectorUbicacionCSS';


class SelectorUbicacion extends Component {
  constructor(props){
    super(props);
    this.state = { 
      ubicacionPorDefecto : { 
        lat: this.props.ubicacion.latitud,
        lng: this.props.ubicacion.longitud
      }
    };
    this.handleNotasChange = this.handleNotasChange.bind(this);
    this.handleCoordenadasChange = this.handleCoordenadasChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(ubi) {
    this.props.onUbicacionChange(ubi);
  }

  handleNotasChange(e){
    const lat = this.props.ubicacion.latitud;
    const long = this.props.ubicacion.longitud;
    const ubi = { latitud: lat,
                longitud: long,
                notas: e.target.value
    };
    this.handleChange(ubi)
  }

  handleCoordenadasChange(location){
    const notas = this.props.ubicacion.notas;
    const ubi = { latitud: location.latitude,
                longitud: position.longitude,
                notas: notas
    };
    this.handleChange(ubi);
  }

  seleccionarUbicacion() {
    RNGooglePlacePicker.show((response) => {
      if (!response.didCancel && !response.error)
        this.handleCoordenadasChange(response);
    })
  }

  render(){
    return (
      <View style={styles.container}>
        <FormLabel>Ubicación</FormLabel>
        <Button
          icon={{name: 'touch-app'}}
          title='Seleccionar ubicación' 
          onPress={this.seleccionarUbicacion}/>
        <FormInput
          placeholder="Notas (Calle, número, localidad, CP)"
          value={this.props.ubicacion.notas}
          onChangeText={this.handleNotasChange} />
      </View>
    );
  }
}

export default SelectorUbicacion;