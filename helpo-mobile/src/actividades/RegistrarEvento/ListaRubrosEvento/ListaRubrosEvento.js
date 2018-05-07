import React from 'react';
import { Picker } from 'react-native';

// Api
import axios from 'axios';
const common = require('../../../../common.js');
const config = common.config();

class ListaRubrosEvento extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      rubros: [{ id: 0, nombre: 'Sin rubros' }]
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.onRubroChange(e.target.value);
  }

  componentDidMount(){
    axios.get(config.apiUrl + '/actividades/rubros_evento')
      .then(res => {
        const rubrosData = res.data;
        this.setState({ rubros: rubrosData })
      })
      .catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  render(){
    const listaRubroEventos = this.state.rubros.map((r) =>
      <Picker.Item value={r.id} label={r.nombre}/>
    );
    const rubro = this.props.rubro;
    return(
      <Picker
        selectedValue={rubro.id}
        onValueChange={this.handleChange}>
          {listaRubroEventos}
      </Picker>
    )
  }
}

export default ListaRubrosEvento;