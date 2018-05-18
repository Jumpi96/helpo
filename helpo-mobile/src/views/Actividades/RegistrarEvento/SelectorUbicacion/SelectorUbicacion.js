import React from "react";
import { View } from "react-native";
import { FormLabel, FormInput, Button } from "react-native-elements";
import RNGooglePlacePicker from "react-native-google-place-picker";
import styles from "./SelectorUbicacionCSS";

class SelectorUbicacion extends React.Component {
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

  handleNotasChange(text){
    const lat = this.props.ubicacion.latitud;
    const long = this.props.ubicacion.longitud;
    const ubi = { latitud: lat,
                longitud: long,
                notas: text
    };
    this.handleChange(ubi)
  }

  handleCoordenadasChange(location){
    const notas = this.props.ubicacion.notas;
    const ubi = { latitud: location.latitude,
                longitud: location.longitude,
                notas: notas
    };
    this.handleChange(ubi);
  }

  seleccionarUbicacion() {
    RNGooglePlacePicker.show((response) => {
      if (!response.didCancel && !response.error) {
        this.handleCoordenadasChange(response);
      }
    });
  }

  render(){
    return (
      <View style={styles.container}>
        <FormLabel>Ubicación</FormLabel>
        <Button
          title="Seleccionar ubicación"
          onPress={this.seleccionarUbicacion.bind(this)}/>
        <FormInput
          placeholder="Notas (Calle, número, localidad, CP)"
          value={this.props.ubicacion.notas}
          onChangeText={this.handleNotasChange} />
      </View>
    );
  }
}

export default SelectorUbicacion;
