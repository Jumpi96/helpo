import React, { Component } from 'react';
import LocationPicker from 'react-location-picker';

const defaultPosition = {
  lat: -31.4201,
  lng: -64.1888
};

class SelectorUbicacion extends Component {
  constructor(props){
    super(props);
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

  handleCoordenadasChange({ position, address }){
    const notas = this.props.ubicacion.notas;
    const ubi = { latitud: position.lat,
                longitud: position.lng,
                notas: notas
    };
    this.handleChange(ubi);
  }

  render(){
    return (
      <div className="form-group">
        <LocationPicker
          containerElement={ <div style={ {height: '100%'} } /> }
          mapElement={ <div style={ {height: '400px'} } /> }
          defaultPosition={defaultPosition}
          onChange={this.handleCoordenadasChange} />
        <input type="text"
          name="notas"
          placeholder="Notas (Calle, número, localidad, CP)"
          value={this.props.ubicacion.notas}
          onChange={this.handleNotasChange} />
        </div>
    );
  }
}

export default SelectorUbicacion;