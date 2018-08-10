import React, { Component } from "react";
import { Input, Item, Label } from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";

class SelectorFechaHora extends Component {
  constructor(props){
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
    };
    this.handleDatePicked = this.handleDatePicked.bind(this);
  }
  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false }); 

  handleDatePicked(fecha_hora) {
    this.hideDateTimePicker();
    this.props.handleChange(fecha_hora)
  }

  convertDateToString(datetime) {
    if (this.props.soloFecha) {
      return moment(datetime).format("DD/MM/YYYY");
    } else {
      return moment(datetime).format("DD/MM/YYYY HH:mm");
    }
  }

  render () {
    return (
        <Item>
          <Label>{this.props.detalle}</Label>
          <Input onFocus={this.showDateTimePicker}
            value={this.convertDateToString(this.props.value)}
            />
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode={this.props.soloFecha ? "date" : "datetime"}
            />
        </Item>
    );
  }
}

export default SelectorFechaHora;
