import React, { Component } from 'react';
import ListaRubrosOrganizacion from './ListaRubrosOrganizacion/ListaRubrosOrganizaciones';
import SelectorUbicacion from '../Actividades/RegistrarEvento/SelectorUbicacion/SelectorUbicacion';
import api from '../../api';
import CargadorImagenPerfil from './CargadorImagenPerfil/CargadorImagenPerfil';


class ConsultarPerfilOrganizacion extends Component {
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
  }


  handleSubmit(event) {
    event.preventDefault();
    if (this.handleValidation()) {
      const perfil = {
        nombre: this.state.nombre,
        rubro_id: this.state.rubro_id,
        ubicacion: this.state.ubicacion,
        cuit: this.state.cuit,
        mail: this.state.mail,
        telefono: this.state.telefono,
        foto_perfil: undefined,
        descripcion: this.state.descripcion,
      };
      api.post('/actividades/eventos/', perfil) // cambiar esto, que poner?
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

 
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="form-group col-md-6">
            <label htmlFor="nombre">Nombre</label>
            <text>{this.state.nombre}</text>
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="cuit">CUIT</label>
            <text>{this.state.cuit}</text>
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="telefono">Teléfono</label>
            <text>{this.state.telefono}</text>          
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="rubro">Rubro</label>
            <input
              type="text"
              name="rubro"
              className="form-control"
              placeholder="Rubro"
              htmlFor="disabled-input"
              value={this.state.rubro_id}            
            />           
          </div>

          
          </div>

        <SelectorUbicacion
          name="selectorUbicacion"
          ubicacion={this.state.ubicacion}
        />

        <div className="form-group">
          <CargadorImagenPerfil />
        </div>

        <div className="form-group">
          <input type="submit" className="btn btn-primary" value="Modificar perfil" />
        </div>

      </form>
    );
  }
}
export default ConsultarPerfilOrganizacion;