import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SelectorUbicacion.css';
import LocationPicker from 'react-location-picker';


class SelectorUbicacion extends Component {
  constructor(props){
    super(props);
    this.state = { 
      ubicacionPorDefecto : { 
        lat: this.props.ubicacion.latitud,
        lng: this.props.ubicacion.longitud
      },
      direccion: undefined
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

  handleCoordenadasChange({ position, address }){
    const notas = this.props.ubicacion.notas;
    const ubi = { latitud: position.lat,
                longitud: position.lng,
                notas: notas
    };
    this.setState({direccion:address});
    this.handleChange(ubi);
  }

  render(){
    return (
      <div className="row">
        <div className="form-group col-md-6">
          <label for="locationPicker">Ubicación</label>
          <LocationPicker
            containerElement={ <div style={ {height: '100%', width: '100%'} } /> }
            mapElement={ <div style={ {height: '300px'} } /> }
            defaultPosition={this.state.ubicacionPorDefecto}
            onChange={this.handleCoordenadasChange} 
            radius="-1"
            name="locationPicker"/>
        </div>
        <div className="form-group col-md-6">
          <input type="text" 
            name="notas" className="form-control"
            placeholder="Notas (Calle, número, localidad, CP)"
            value={this.props.ubicacion.notas}
            onChange={this.handleNotasChange} />
          <br />
          <label name="direccion">{this.state.direccion}</label>
        </div>
      </div>
    );
  }
}

SelectorUbicacion.propTypes = {
  ubicacion: PropTypes.any.isRequired,
};

export default SelectorUbicacion;