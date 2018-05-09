import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, { formatDate, parseDate } from 'react-day-picker/moment';
import moment from 'moment';
import 'moment/locale/es';
import 'react-day-picker/lib/style.css';

class SelectorFechaHora extends Component {
  constructor(props){
    super(props);
    this.state = { 
      fecha: moment(this.props.value).format('DD/MM/YYYY'),
      hora: undefined
    };
    this.handleFechaChange = this.handleFechaChange.bind(this);
    this.handleHoraChange = this.handleHoraChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(f) {
    this.props.onFechaHoraChange(f);
  }

  handleFechaChange(e){
    const f = moment(e).format('DD/MM/YYYY');
    this.handleChange(f)
  }

  convert

  handleHoraChange(e){
    const ubi = Date.now();
    
    this.handleChange(ubi);
  }

  render(){
    return (
      <div className="form-group">
        <label for="fecha">{this.props.detalle}</label>
        <DayPickerInput name="fecha"
          formatDate={formatDate} className="form-control"
          parseDate={parseDate} format="L"
          placeholder={`${formatDate(new Date(), 'L', 'es')}`}
          dayPickerProps={{ locale: 'es', localeUtils: MomentLocaleUtils }}
          locale="es" localeUtils={MomentLocaleUtils}
          value={this.state.fecha}
          onDayClick={this.handleFechaChange}
        />
      </div>
    );
  }
}

export default SelectorFechaHora;