import React, { Component } from 'react';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import SelectorFecha from './SelectorFecha/SelectorFecha';
import moment from 'moment';

class SelectorFechaHora extends Component {
  constructor(props){
    super(props);
    this.state = { 
      fecha: moment(this.props.fecha_hora).format('DD/MM/YYYY'),
      hora: moment(this.props.fecha_hora)
    };
    this.handleFechaChange = this.handleFechaChange.bind(this);
    this.handleHoraChange = this.handleHoraChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(f_h) {
    this.props.onFechaHoraChange(f_h);
  }

  handleFechaChange(e){
    const fecha = moment(e).format('DD/MM/YYYY');
    this.setState({fecha: fecha});
    const nueva_fecha_hora = fecha + ' ' + this.state.hora;
    this.handleChange(moment(nueva_fecha_hora, 'DD/MM/YYYY HH:mm').toDate());
  }

  handleHoraChange(e){
    const hora = moment(e._d).format('HH:mm');
    this.setState({hora: hora});
    const nueva_fecha_hora = this.state.fecha + ' ' + hora;
    this.handleChange(moment(nueva_fecha_hora, 'DD/MM/YYYY HH:mm').toDate());
  }

  render(){
    return (
      <div>
        <label for="fecha">{this.props.detalle}</label>
        <div className="row">
        <SelectorFecha
          name="fecha"
          fecha={this.state.fecha}
          onFechaChange={this.handleFechaChange} />
        <TimePicker
          name="horaPicker"
          defaultValue={this.state.hora}
          showSecond={false}
          onChange={this.handleHoraChange}
          />
        </div>
      </div>
    );
  }
}

export default SelectorFechaHora;