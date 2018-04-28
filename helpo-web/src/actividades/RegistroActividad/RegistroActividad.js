import React, { Component } from 'react';
import ListaOrganizaciones from './ListaOrganizaciones/ListaOrganizaciones'

class RegistroActividad extends Component {
  constructor(props){
    super(props);
    this.state = { 
        nombre: '',
        organizacion: 'Patitas de perro',
        organizaciones: [
            {
                id: 1,
                nombre: 'Patitas de perro'
            },
            {
                id: 2,
                nombre: 'Cáritas'
            }
        ]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOrganizacionChange = this.handleOrganizacionChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  }

  handleOrganizacionChange(org) {
    this.setState({organizacion: org});
  }

  handleSubmit(event) {
    alert("Se registró la actividad " + this.state.nombre + " de la organización " + 
            this.state.organizacion + ".");
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Registrar actividad</h1>
        <div className="row">
            <input type="text"
              name="nombre"
              placeholder="Nombre"
              value={this.state.nombre} 
              onChange={this.handleInputChange}
            />
        </div>
        <div className="row">
            <ListaOrganizaciones 
              name="listaOrganizaciones"
              organizacion={this.state.organizacion}
              organizaciones={this.state.organizaciones}
              onOrganizacionChange={this.handleOrganizacionChange} />
        </div>
        <input type="submit" value="Guardar" />
      </form>
    );
  }
}

export default RegistroActividad;