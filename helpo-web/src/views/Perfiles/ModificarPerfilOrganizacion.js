import React, { Component } from 'react';
import ListaRubrosOrganizacion from './ListaRubrosOrganizacion/ListaRubrosOrganizacion';
import SelectorUbicacion from '../Actividades/SelectorUbicacion/SelectorUbicacion';
import api from '../../../api';


class ModificarPerfilOrganizacion extends Component {
  constructor(props) {
    super(props); //Llama a las props del padre
    this.state = {

      nombre: '',
      cuit: '',
      // TODO: ubicacion que pasamos por defecto debería ser la de la ONG. Ahora, Córdoba.
      ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: '' },
      mail: '',
      telefono: '',
      rubro_id: 0,
      foto_perfil: undefined,
      descripcion: '',
      errors: {},

    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);

  }


  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleRubroChange(r) {
    this.setState({ rubro_id: r });
  }

  handleUbicacionChange(ubi) {
    this.setState({ ubicacion: ubi });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.handleValidation()) {
      const evento = {
        nombre: this.state.nombre,
        descripcion: this.state.descripcion,
        fecha_hora_inicio: this.state.fecha_hora_inicio.toISOString(),
        fecha_hora_fin: this.state.fecha_hora_fin.toISOString(),
        rubro_id: this.state.rubro_id,
        ubicacion: this.state.ubicacion,
        contacto: this.state.contactos,
      };
      api.post('/actividades/eventos/', evento)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.props.history.push('dashboard');
        }).catch(function (error) {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
        });
    }
  }

  handleValidation() {
    let formIsValid = true;
    const errors = this.state.errors;

    if (!this.state.nombre) {
      formIsValid = false;
      errors.nombre = 'Debe ingresar un nombre.';
    } else { errors.nombre = undefined; }

    if (!this.state.cuit) {
      formIsValid = false;
      errors.cuit = 'Debe ingresar un cuit.';
    } else { errors.cuit = undefined; }

    if (!this.state.telefono) {
      formIsValid = false;
      errors.telefono = 'Debe ingresar un teléfono.';
    } else { errors.telefono = undefined; }

    if (this.state.rubro_id === 0) { //Revisar cuando se cambie la lista de rubros
      formIsValid = false;
      errors.rubro = 'Hubo un problema al cargar los rubros.';
    } else { errors.rubro = undefined; }

    this.setState({ errors });
    return formIsValid;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="form-group col-md-6">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              placeholder="Nombre"
              value={this.state.nombre}
              onChange={this.handleInputChange}
            />
            <span style={{ color: 'red' }}>{this.state.errors.nombre}</span>
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="cuit">CUIT</label>
            <input
              type="text"
              name="cuit"
              className="form-control"
              placeholder="CUIT"
              value={this.state.cuit}
              onChange={this.handleInputChange}
            />
            <span style={{ color: 'red' }}>{this.state.errors.cuit}</span>
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="text"
              name="telefono"
              className="form-control"
              placeholder="Teléfono"
              value={this.state.telefono}
              onChange={this.handleInputChange}
            />
            <span style={{ color: 'red' }}>{this.state.errors.telefono}</span>
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="listaRubros">Rubro</label>
            <ListaRubrosOrganizacion
              name="listaRubros"
              rubro={this.state.rubro_id}
              onRubroChange={this.handleRubroChange}
            />
            <span style={{ color: 'red' }}>{this.state.errors.rubro}</span>
          </div>
        </div>

        <SelectorUbicacion
          name="selectorUbicacion"
          ubicacion={this.state.ubicacion}
          onUbicacionChange={this.handleUbicacionChange}
        />

        <div className="form-group">
          <label htmlFor="descripcion">FOTO</label> [//VER COMO SE RESUELVE FOTO DE PERFIL]
          <textarea
            name="descripcion"
            rows="9"
            className="form-control"
            placeholder="Escriba una breve descripcion de la organización."
            value={this.state.descripcion}
            onChange={this.handleInputChange}
          />
        </div>

        <div className="form-group">
          <input type="submit" className="btn btn-primary" value="Guardar perfil" />
        </div>

      </form>
    );
  }
}

export default ModificarPerfilOrganizacion;