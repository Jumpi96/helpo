import React, { Component } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, { formatDate, parseDate } from 'react-day-picker/moment';
import 'moment/locale/es';
import 'react-day-picker/lib/style.css';

class SelectorFecha extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(f, modifiers) {
    this.props.onFechaChange(f);
  }

  render(){
    return (
      <div className="form-group">
        <DayPickerInput
          formatDate={formatDate} className="form-control"
          parseDate={parseDate} format="L"
          placeholder={`${formatDate(new Date(), 'L', 'es')}`}
          dayPickerProps={{ locale: 'es', localeUtils: MomentLocaleUtils }}
          locale="es" localeUtils={MomentLocaleUtils}
          value={this.props.fecha}
          onDayChange={this.handleChange}
        />
      </div>
    );
  }
}

export default SelectorFecha;