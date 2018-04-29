import React, { Component } from 'react';
import axios from 'axios';
import ListaOrganizaciones from './ListaOrganizaciones/ListaOrganizaciones'

class RegistroActividad extends Component {
  constructor(props){
    super(props);
    this.state = { 
        nombre: '',
        organizaciones: [{ id: 0, nombre: 'Sin organizaciones' }],
        organizacion: { id: 0, nombre: 'Sin organizaciones' },
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
            this.state.organizacion.id + ".");
    event.preventDefault();
  }

  componentDidMount() {
    axios.get('http://localhost:8000/organizaciones')
      .then(res => {
        const organizacionesData = res.data;
        this.setState({ organizaciones: organizacionesData, organizacion: organizacionesData[0] })
      })
      .catch(function (error) {
        console.log("No anda la API")
      })
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