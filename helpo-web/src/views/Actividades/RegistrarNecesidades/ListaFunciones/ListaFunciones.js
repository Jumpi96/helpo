import React, { Component } from 'react';
import api from '../../../../api';


class ListaFunciones extends Component {
  constructor(props){
    super(props);
    this.state = { 
      funciones: [{ id: 0, nombre: 'Sin funciones' }]
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const selectedId = e.target.options[selectedIndex].getAttribute('data-key');
    this.props.onFuncionChange(selectedId);
  }

  componentDidMount(){
    api.get('/actividades/funciones/')
      .then(res => {
        const funciones = res.data;
        this.setState({ funciones });
        this.props.onFuncionChange(funciones[0].id);
      })
      .catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  render(){
    const listaFunciones = this.state.funciones.map((r) =>
      <option key={r.id} data-key={r.id}>{r.nombre}</option>
    );
    return(
      <select
        className="form-control"
        onChange={this.handleChange}>
          {listaFunciones}
      </select>
    )
  }
}

export default ListaFunciones;