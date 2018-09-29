import React from "react";
import {
  Button,
  Item,
  Text,
  Input,
  Content
} from "native-base";
//import RNGooglePlacePicker from "react-native-google-place-picker";

class SelectorUbicacion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ubicacionPorDefecto: {
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

  handleNotasChange(text) {
    const lat = this.props.ubicacion.latitud;
    const long = this.props.ubicacion.longitud;
    const ubi = {
      latitud: lat,
      longitud: long,
      notas: text
    };
    this.handleChange(ubi)
  }

  handleCoordenadasChange(location) {
    const notas = this.props.ubicacion.notas;
    const ubi = {
      latitud: location.latitude,
      longitud: location.longitude,
      notas: notas
    };
    this.handleChange(ubi);
  }

  seleccionarUbicacion() {
    /*RNGooglePlacePicker.show((response) => {
      if (!response.didCancel && !response.error) {
        this.handleCoordenadasChange(response);
      }
    });*/
  }

  render() {
    return (
      <Content>
        <Button block style={{ margin: 25 }}
          onPress={this.seleccionarUbicacion.bind(this)} >
          <Text>Seleccionar ubicación</Text>
        </Button>
        <Item>
          <Input
            placeholder="Notas (Calle, número, localidad, CP)"
            value={this.props.ubicacion.notas}
            onChangeText={this.handleNotasChange} />
        </Item>
      </Content>
    );
  }
}

export default SelectorUbicacion;
