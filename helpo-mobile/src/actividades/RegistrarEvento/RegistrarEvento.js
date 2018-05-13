import React from 'react';
import { Alert, Text, View } from 'react-native';
import { FormInput, FormLabel, Button, FormValidationMessage } from 'react-native-elements';
import SelectorUbicacion from './SelectorUbicacion/SelectorUbicacion';
import ListaRubrosEvento from './ListaRubrosEvento/ListaRubrosEvento';
import api from '../../../api';
import moment from 'moment';
import SelectorFechaHora from './SelectorFechaHora/SelectorFechaHora';


class RegistrarEvento extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
        nombre: '',
        descripcion: '',
        rubro: {id: 0, nombre: "Sin rubros"},
        fecha_hora_inicio: Date.now(),
        fecha_hora_fin: Date.now(),
        //TODO: ubicacion que pasamos por defecto debería ser la de la ONG. Ahora, Córdoba.
        ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: ''}, 
        erros: {}
    };
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);
    this.handleFechaHoraInicioChange = this.handleFechaHoraInicioChange.bind(this);
    this.handleFechaHoraFinChange = this.handleFechaHoraFinChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  }

  handleRubroChange(r) {
    this.setState({rubro: r});
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.handleValidation()) {
      const evento = {
        nombre: this.state.nombre,
        descripcion: this.state.descripcion,
        fecha_hora_inicio: this.state.fecha_hora_inicio.toISOString(),
        fecha_hora_fin: this.state.fecha_hora_fin.toISOString(),
        rubro_id: this.state.rubro.id,
        ubicacion: this.state.ubicacion
      };
      api.post('/actividades/eventos', { evento })
        .then(res => {
          console.log(res);
          console.log(res.data);
          Alert.alert(
            'Registrar evento',
            'Se registró el evento con éxito.'
          );
        }).catch(function (error) {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message)}
        });
    }
  }

  handleValidation(event) {
    let formIsValid = true;
    var errors = this.state.errors

    if (!this.state.nombre) {
      formIsValid = false;
      errors.nombre = "Debe ingresar un nombre.";
    }

    if (isNaN(Date.parse(this.state.fecha_hora_inicio)) ||
        isNaN(Date.parse(this.state.fecha_hora_fin))) {
      formIsValid = false;
      errors.fechas = "Las fechas ingresadas no son válidas.";
    } else {
      const inicio = moment(this.state.fecha_hora_inicio);
      const fin = moment(this.state.fecha_hora_fin);
      if (moment.duration(fin.diff(inicio)).asHours() > 24 ||
          moment.duration(inicio.diff(moment()) < 0) ||
          moment.duration(fin.diff(inicio)).asHours() < 0) {
        formIsValid = false;
        errors.fechas = "Las fecha de fin debe ser mayor a la de inicio y " +
          "la actividad no durar más de 24 horas.";
      }
    }
    if (this.state.rubro.id === 0) {
      formIsValid = false;
      errors.rubro = "Hubo un problema al cargar los rubros.";
    }

    this.setState({errors: errors});
    return formIsValid;
  }

  handleUbicacionChange(ubi) {
    this.setState({ubicacion: ubi});
  }

  handleFechaHoraInicioChange(f_h) {
    this.setState({fecha_hora_inicio: f_h});
  }
  
  handleFechaHoraFinChange(f_h) {
    this.setState({fecha_hora_fin: f_h});
  }

  render(){
    return (
      <View>
        <Text>Registrar evento</Text>

        <FormLabel>Nombre</FormLabel>
        <FormInput value={this.state.nombre}
          onChangeText={this.handleInputChange} />
        <FormValidationMessage>{this.state.errors["nombre"]}</FormValidationMessage>

        <FormLabel>Descripción</FormLabel>
        <FormInput value={this.state.descripcion}
          numberOfLines="2"
          onChangeText={this.handleInputChange} />
        
        <ListaRubrosEvento 
            name="listaRubros"
            rubro={this.state.rubro}
            onRubroChange={this.handleRubroChange} />
        <FormValidationMessage>{this.state.errors["rubro"]}</FormValidationMessage>
        
        <SelectorFechaHora 
          detalle="Inicio"
          soloFecha={false}
          value={this.state.fecha_hora_inicio}
          handleChange={this.handleFechaHoraInicioChange}/>
        <SelectorFechaHora
          detalle="Fin"
          soloFecha={false}
          value={this.state.fecha_hora_fin}
          handleChange={this.handleFechaHoraFinChange}/>
        <FormValidationMessage>{this.state.errors["fechas"]}</FormValidationMessage>

        <SelectorUbicacion
          ubicacion={this.state.ubicacion}
          onUbicacionChange={this.handleUbicacionChange} />

        <Button
          title='Guardar evento' 
          onPress={this.handleSubmit}/>
      </View>
    );
  }
}
  
  export default RegistrarEvento;