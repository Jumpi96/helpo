import React from 'react';
import { Text, View } from 'react-native';
import { FormInput, FormLabel, Button } from 'react-native-elements';
import SelectorUbicacion from './SelectorUbicacion/SelectorUbicacion';
import ListaRubrosEvento from './ListaRubrosEvento/ListaRubrosEvento';
import api from '../../../api';
import SelectorFechaHora from './SelectorFechaHora/SelectorFechaHora';


class RegistrarEvento extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
        nombre: '',
        rubro: {id: 0, nombre: "Sin rubros"},
        fecha_hora_inicio: Date.now(),
        fecha_hora_fin: Date.now(),
        //TODO: ubicacion que pasamos por defecto debería ser la de la ONG. Ahora, Córdoba.
        ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: ''}, 
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

    const evento = {
      nombre: this.state.nombre,
      fecha_hora_inicio: this.state.fecha_hora_inicio.toISOString(),
      fecha_hora_fin: this.state.fecha_hora_fin.toISOString(),
      rubro_id: this.state.rubro.id,
      ubicacion: this.state.ubicacion
    };
    console.log(evento);
    api.post('/actividades/eventos', { evento })
      .then(res => {
        console.log(res);
        console.log(res.data);
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      });
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
        
        <ListaRubrosEvento 
            name="listaRubros"
            rubro={this.state.rubro}
            onRubroChange={this.handleRubroChange} />
        
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