import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Card, CardHeader } from 'reactstrap';
import api from '../../../api'
import ModalGenerico from '../ModalGenerico'
import { uploadImage } from '../../../Lib/Imagen'

const perfilPropTypes = {
  nombre: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  data: PropTypes.shape({
    verificada: PropTypes.bool,
    apellido: PropTypes.string,
    telefono: PropTypes.number,
    dni: PropTypes.number,
    sexo: PropTypes.string,
    habilidades: PropTypes.string,
    gustos: PropTypes.string,
    avatar: PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string,
    }),
    usuario: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      user_type: PropTypes.number,
      is_confirmed: PropTypes.bool,
      nombre: PropTypes.string,
    }).isRequired,
  }),
  switchToConsultar: PropTypes.func.isRequired,
}

class ModificarPerfilVoluntario extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      nombre: this.props.nombre,
      // Checkeo null porque si es null react tira un warning (https://github.com/reactstrap/reactstrap/issues/570)
      telefono: this.props.data.telefono == null ? '' : this.props.data.telefono,
      dni: this.props.data.dni == null ? '' : this.props.data.dni,
      sexo: this.props.data.sexo == null ? '' : this.props.data.sexo,
      gustos: this.props.data.gustos == null ? '' : this.props.data.gustos,
      habilidades: this.props.data.habilidades == null ? '' : this.props.data.habilidades,
      avatar_url: this.props.data.avatar.url,
      showModal: false,
      modalType: 'success',
      errors: [],
      avatar_changed: false,
    }
    this.renderNombre  = this.renderNombre.bind(this);
    this.renderDni = this.renderDni.bind(this);
    this.renderTelefono = this.renderTelefono.bind(this);
    this.handleNombreChange = this.handleNombreChange.bind(this);
    this.handleDniChange = this.handleDniChange.bind(this);
    this.handleTelefonoChange = this.handleTelefonoChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSelectFile = this.onSelectFile.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleAvatarChange = this.handleAvatarChange.bind(this);
    this.renderGustos = this.renderGustos.bind(this);
    this.handleGustosChange = this.handleGustosChange.bind(this);
    this.renderHabilidades = this.renderHabilidades.bind(this);
    this.handleHabilidadesChange = this.handleHabilidadesChange.bind(this);
    this.handleSexoChange = this.handleSexoChange.bind(this);
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        () =>
          this.setState({
            avatar_url: reader.result,
            avatar_changed: true,
          }),
        false
      )
      reader.readAsDataURL(event.target.files[0])
    }
  }
  /**/
  renderSexo() {
    return (
      <select 
      className="form-control" value={this.state.sexo} onChange={this.handleSexoChange}>
        <option value=""> </option>
        <option value="hombre">Hombre</option>
        <option value="mujer">Mujer</option>
        <option value="otro">Otro</option>
      </select>)
  }

  handleSexoChange(event) {    
    this.setState({
      sexo: event.target.value
    })
  }

  renderGustos() {
    return (
      <textarea
        rows= '5'
        cols='30'
        className='form-control'
        value={this.state.gustos}
        onChange={this.handleGustosChange}
      />)
  }

  handleGustosChange(event) {
    this.setState({
      gustos: event.target.value
    });
  }

  renderHabilidades() {
    return (
      <textarea
        rows= '5'
        cols='30'
        className='form-control'
        value={this.state.habilidades}
        onChange={this.handleHabilidadesChange}
      />)
  }

  handleHabilidadesChange(event) {
    this.setState({
      habilidades: event.target.value
    });
  }  
  renderNombre() {
    return (
      <input
        type="text"
        name="nombre"
        className="form-control"
        placeholder="Nombre"
        value={this.state.nombre}
        onChange={this.handleNombreChange}
      />)    
    }
  
  handleNombreChange(event) {
    this.setState({
      nombre: event.target.value
    })
  }

  renderTelefono() {
    return (
      <input
        type="text"
        name="telefono"
        className="form-control"
        placeholder="Telefono"
        value={this.state.telefono}
        onChange={this.handleTelefonoChange}
      />)    
    }

  handleTelefonoChange(event) {
      if (isNaN(event.target.value)) {
        return;
      }
      this.setState({
        telefono: event.target.value
      });
  }

  renderDni() {
    return (
    <input
      type="text"
      name="dni"
      className="form-control"
      placeholder="Dni"
      value={this.state.dni}
      onChange={this.handleDniChange}
    />)
  }

  handleDniChange(event) {
    if (isNaN(event.target.value)) {
      return;
    }
    this.setState({
      dni: event.target.value
    });
  }

  handleAvatarChange(avatar_url) {
    this.setState({
      avatar_url: avatar_url,
      avatar_changed: true,
    })
  }
  
  async prepareSubmitData() {
    const newData = this.state

    let avatar_url = this.props.data.avatar.url
    if (this.state.avatar_changed ) {
      const rx = /\/9j\/.*/gm
      const encondedAvatar = rx.exec(this.state.avatar_url)[0]
      avatar_url = await uploadImage(encondedAvatar)
      if (avatar_url === 'recall') {
        avatar_url = await uploadImage(encondedAvatar)
      }
    }
    const submitData = {
      avatar: {url: avatar_url},
    }    
    if (newData.dni !== "") {
      submitData.dni = newData.dni
    }
    if (newData.gustos !== "") {
      submitData.gustos = newData.gustos
    }
    if (newData.habilidades !== "") {
      submitData.habilidades = newData.habilidades
    }
    if (newData.sexo !== "") {
      submitData.sexo = newData.sexo
    }
    if (newData.telefono !== "") {
      submitData.telefono = newData.telefono
    }
    return submitData
  }

  validateData(submitData) {
    if (submitData.avatar.url === 'error' || submitData.avatar.url == null) {
      let errors = this.state.errors
      errors.push("Imagen upload failure")
      this.setState({
        errors: errors
      })
      return false
    }
    this.setState({
      avatar_url: submitData.avatar.url
    })
    return true
  }

  handleSubmit() {
    this.prepareSubmitData().then( submitData => {
      console.log("DATA")
      console.log(submitData)
      if (this.validateData(submitData)) {
        console.log("HOLA")
        console.log(this.props.data.usuario.email)
        console.log(this.props.data.usuario.id)
        api.put(`/perfiles/perfil_voluntario/${this.props.data.usuario.id}/`, submitData)
        .then(res => {
          if (res.status === 200) {
            this.setState({
              showModal: true,
              modalType: 'success'
            })
          }
          else {
            this.setState({
              showModal: true,
              modalType: 'failure'
            })
          }
        })
      }
      console.log(this.state.errors)
    }) 
  }

  renderModal() {
    if (this.state.showModal) {
      if (this.state.modalType === "success") {
        return (
          <ModalGenerico
            body='Se guardaron los cambios exitosamente'
            onCancel={this.props.switchToConsultar}
          />)  
      }
      else {
        return (
          <ModalGenerico
            body='Hubo un problema al intentar cargar los datos, por favor intentelo mas tarde'
            onCancel={() => {this.setState({ showModal: false })}}
          />
        )
      }      
    }
  }

  showModal() {
    this.setState({
      showModal: true,
    })
  }

  render() {    
    return (      
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"></i> Modificar Perfil
        </CardHeader>
      <form>
        <div style={{ marginTop:'20px' }} class='container'>
        
        <div style={{ alignItems: 'center' }} class='row'>
          {/*<div style={{flexDirection: 'column', alignItems: 'flex-end',display: 'flex', justifyContent: 'center', height: '150px'}} class='col'> 
            <div style={{ display: 'flex', height: '50px', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }} >
              <p style={{ textAlign: 'right' }} 
                 class='h4'>Nombre</p>
            </div>   
            <div style={{ display: 'flex', height: '50px',width: '100%', justifyContent: 'flex-end', alignItems: 'center'}} >       
              <p style={{ textAlign: 'right' }} 
                 class='h4'>{this.renderNombre()}</p>
            </div>
            </div>*/
            //SI SE DECIDE PODER CAMBIAR NOMBRE EN PERFIL, USAR ESTE CODIGO
          }
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '150px'}}  class='col-2'>            
              <p style={{ textAlign: 'right' }} 
                 class='h4'>{this.props.nombre} {this.props.data.apellido}</p>
          </div>
          <div class='col-6'>
            <img
              class='rounded-circle'
              src={this.state.avatar_url}
              alt="avatar"
              width="100" 
              height="100"
            />
            <input style={{ marginBottom: '10px', marginTop: '10px' }} type='file' onChange={this.onSelectFile}/>
          </div>
        </div>
          
        <div class='row'>
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="mail">Mail</p>
            <div class='col-6'><p>{this.props.email}</p></div>
        </div>

        <div class='row'>
            <p style={{ paddingTop: '8px',textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="telefono">Teléfono</p>
            <div class='col-6'>{this.renderTelefono()}</div>
        </div>

        <div class='row'>   
            <p style={{ paddingTop: '8px',textAlign: 'right' }} class='font-weight-bold col-2'           htmlFor="dni">DNI</p>            
            <div class='col-6'>{this.renderDni()}</div>
        </div>

        <div class='row'>        
          <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="sexo">Sexo</p>
          <div class='col-6'>{this.renderSexo()}</div>    
        </div>
        
        <div class='row'>        
          <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="gustos">Gustos</p>
          <div class='col-6'>{this.renderGustos()}</div>    
        </div>      

        <div class='row'>        
          <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="habilidades">Habilidades</p>
          <div class='col-6'>{this.renderHabilidades()}</div>    
        </div>


        <div style={{ margin: '20px' }} class='row'>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }} class='col-2'>
            <button onClick={this.handleSubmit} type="button" class="btn btn-primary">
              Guardar Cambios
            </button>
          </div>
          <div class='col-6'>
            <button type="button" class="btn btn-danger" onClick={this.props.switchToConsultar}>
              Volver
            </button>
          </div>
        </div>

        </div>      
      </form>
      {this.renderModal()}
      </Card>
    );
  }
}
ModificarPerfilVoluntario.propTypes = perfilPropTypes;

export default ModificarPerfilVoluntario;