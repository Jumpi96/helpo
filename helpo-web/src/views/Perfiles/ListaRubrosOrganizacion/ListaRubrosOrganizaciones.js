import React, { Component } from 'react';
import api from '../../../api';


class ListaRubrosOrganizacion extends Component { //esperar a que juan cambie esta lista rubros
  constructor(props){
    super(props);
    this.state = { 
      rubros: [{ id: 0, nombre: 'Sin rubros' }]
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const selectedId = e.target.options[selectedIndex].getAttribute('data-key');
    this.props.onRubroChange(selectedId);
  }

  componentDidMount(){
    api.get('/perfiles/rubros_organizacion')
      .then(res => {
        const rubrosData = res.data;
        this.setState({ rubros: rubrosData});
        this.props.onRubroChange(rubrosData[0].id);
      })
      .catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  render(){
    const listaRubrosOrganizacion = this.state.rubros.map((r) =>
      <option key={r.id} data-key={r.id}>{r.nombre}</option>
    );
    const rubro = this.props.rubro_id;
    return(
      <select
        value={rubro}
        className="form-control"
        onChange={this.handleChange}>
          {listaRubrosOrganizacion}
      </select>
    )
  }
}

export default ListaRubrosOrganizacion;