import React from 'react';
import { Picker } from 'react-native';
import api from '../../../../api';


class ListaRubrosEvento extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      rubros: [{ id: 0, nombre: 'Sin rubros' }]
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(value, index) {
    this.props.onRubroChange(value);
  }

  componentDidMount(){
    api.get('/actividades/rubros_evento')
      .then(res => {
        const rubrosData = res.data;
        this.setState({ rubros: rubrosData })
        this.props.rubro_id = rubrosData[0].id
      })
      .catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  render(){
    const listaRubroEventos = this.state.rubros.map((r) =>
      <Picker.Item value={r.id} key={r.id} label={r.nombre}/>
    );
    return(
      <Picker
        selectedValue={this.props.rubro_id}
        onValueChange={this.handleChange}>
          {listaRubroEventos}
      </Picker>
    )
  }
}

export default ListaRubrosEvento;