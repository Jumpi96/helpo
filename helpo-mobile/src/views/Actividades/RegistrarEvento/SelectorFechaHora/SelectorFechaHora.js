import React, { Component } from "react";
import { Text, View } from "react-native";
import { Button, FormLabel, FormInput } from "react-native-elements";
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
        <View>
          <FormLabel>{this.props.detalle}</FormLabel>
          <FormInput onFocus={this.showDateTimePicker}
            value={this.convertDateToString(this.props.value)}
            />
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode={this.props.soloFecha ? "date" : "datetime"}
            />
        </View>
    );
  }
}

export default SelectorFechaHora;
