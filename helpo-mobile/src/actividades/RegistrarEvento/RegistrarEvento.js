import React from 'react';
import { Text, View } from 'react-native';
import { Route, Link } from 'react-router-native';
import { Form, FormInput } from 'react-native-elements';
// import styles from './RegistrarEventoCSS';
import SelectorUbicacion from './SelectorUbicacion/SelectorUbicacion';
import ListaRubrosEvento from './ListaRubrosEvento/ListaRubrosEvento'

// Api
import axios from 'axios';
const common = require('../../../common.js');
const config = common.config();

class RegistrarEvento extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
        nombre: '',
        rubro: {id: 0, nombre: "Sin rubros"},
        //TODO: ubicacion que pasamos por defecto debería ser la de la ONG. Ahora, Córdoba.
        ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: ''}, 
    };
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);
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
      fecha: undefined,
      rubro_id: this.state.rubro.id,
      ubicacion: this.state.ubicacion
    };
    console.log(evento);
    axios.post(config.apiUrl + '/actividades/eventos', { evento })
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

  render(){
    return (
      <Form>
        <Text>Registrar evento</Text>

        <FormLabel>Nombre</FormLabel>
        <FormInput value={this.state.nombre}
          onChangeText={this.handleInputChange} />
        
        <ListaRubrosEvento 
            name="listaRubros"
            rubro={this.state.rubro}
            onRubroChange={this.handleRubroChange} />
        
        <SelectorUbicacion
          ubicacion={this.state.ubicacion}
          onUbicacionChange={this.handleUbicacionChange} />
        
        <Button
          title='Guardar evento' 
          onPress={this.handleSubmit}/>
      </Form>
    );
  }
}
  
  export default RegistrarEvento;