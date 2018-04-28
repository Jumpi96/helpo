import React, { Component } from 'react';

class ListaOrganizaciones extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.onOrganizacionChange(e.target.value);
  }
  render(){
    const listaOrganizaciones = this.props.organizaciones.map((org) =>
      <option key={org.id} value={org.nombre}>{org.nombre}</option>
    );
    const organizacion = this.props.organizacion;
    return(
      <select
        value={organizacion} 
        onChange={this.handleChange}>
          {listaOrganizaciones}
      </select>
    )
  }
}

export default ListaOrganizaciones;