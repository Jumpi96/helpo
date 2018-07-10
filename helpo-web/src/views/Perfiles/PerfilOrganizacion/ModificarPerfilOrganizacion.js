import React, { Component } from 'react';
import ListaRubrosOrganizacion from '../ListaRubrosOrganizacion/ListaRubrosOrganizaciones';
import SelectorUbicacion from '../../Actividades/RegistrarEvento/SelectorUbicacion/SelectorUbicacion';
import api from '../../../api';
import CargadorImagenPerfil from '../CargadorImagenPerfil/CargadorImagenPerfil';
import { Card } from 'reactstrap';


class ModificarPerfilOrganizacion extends Component {
  constructor(props) {
    super(props); //Llama a las props del padre
    this.state = {
    nombre: 'organizacion',
    cuit: '',
    ubicacion: { latitud: 0, longitud: 0, notas:'#!None#!'},
    mail: '',
    telefono: '',
    rubro: { id: 0, nombre: "none"},
    avatar_url: 'assets/user.png',
    descripcion: '',
    errors: {},
    };

    this.guardar = this.guardar.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);

  }

  componentDidMount() {
    api.get(`/perfiles/perfil_organizacion/${this.props.usuarioId}`)
    .then( (res) => {
      let rubro = res.rubro
      let ubicacion = res.ubicacion
      if ( rubro == null ) {
        rubro = { id: 0, nombre: 'none'}
      }
      if ( ubicacion == null ) {
        ubicacion = { latitud: 0, longitud: 0, notas:'#!None#!'}
      }
      this.setState({
        cuit: res.cuit,
        telefono: res.telefono,
        descripcion: res.descripcion,
        rubro_id: rubro.id,
        rubro_nombre: rubro.nombre,
        avatar_url: res.avatar.url,        
      })
    })
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

  guardar(){
    event.preventDefault();
    if (this.handleValidation()) {
      
      const perfil = {};
        perfil.nombre = this.state.nombre;

        if(this.state.rubro.id != 0){
          perfil.rubro_id = this.state.rubro_id;
        }
        if(this.state.ubicacion.latitud != 0){
          perfil.ubicacion = this.state.ubicacion;
        }        
        perfil.cuit =  this.state.cuit;
        perfil.mail =  this.state.mail;
        perfil.telefono =  this.state.telefono;
        perfil.avatar_url = this.state.avatar_url;
        perfil.descripcion =  this.state.descripcion;
     
      api.put(`/perfiles/perfil_organizacion/${this.props.usuarioId}`, perfil)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.props.history.push('dashboard'); //Fijarse que pasa con la ruta
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

    {/* if (!this.state.cuit) {
      formIsValid = false;
      errors.cuit = 'Debe ingresar un cuit.';
    } else { errors.cuit = undefined; }

    if (!this.state.telefono) {
      formIsValid = false;
      errors.telefono = 'Debe ingresar un teléfono.';
    } else { errors.telefono = undefined; }
    */}

    if (this.state.rubro.id === 0) { //Revisar cuando se cambie la lista de rubros
      formIsValid = false;
      errors.rubro = 'Hubo un problema al cargar el rubro.';
    } else { errors.rubro = undefined; }

    this.setState({ errors });
    return formIsValid;
  }

  render() {
    return (
      <Card>

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
            <label htmlFor="telefono">Mail</label>
            <input
              type="text"
              name="mail"
              className="form-control"
              placeholder="Mail"
              value={this.state.mail}
              onChange={this.handleInputChange}
            />
            <span style={{ color: 'red' }}>{this.state.errors.mail}</span>
          </div>

          <div className="form-group col-md-6">
          <CargadorImagenPerfil 
            image = {this.state.avatar_url}
            width={250}
            height={250}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1.2}
            rotate={0} 
          />
          </div>


          <div className="form-group col-md-6">
            <label htmlFor="mail">Mail</label>
            <input
              type="text"
              name="mail"
              className="form-control"
              placeholder="Mail"
              value={this.state.mail}
              onChange={this.handleInputChange}
            />
            <span style={{ color: 'red' }}>{this.state.errors.mail}</span>
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
          <label htmlFor="descripcion">Descripcion</label>
          <textarea
            name="descripcion"
            rows="9"
            className="form-control"
            placeholder="Escriba una breve descripcion de la organización."
            value={this.state.descripcion}
            onChange={this.handleInputChange}
          />
        </div>

        <div className="btn btn-primary"> 
          <button onclick={guardar()}> //Elegir un boton guardar
          Guardar
          </button>          
        </div>

        <div className="form-group">
          <input type="submit" className="btn btn-primary" value="Guardar" />
          {guardar()} //Elegir un boton guardar 
        </div>        

      </Card>
    );
  }
}

export default ModificarPerfilOrganizacion;