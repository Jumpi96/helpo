import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Card, CardHeader } from 'reactstrap';
import SelectorUbicacion from '../../../utils/SelectorUbicacionGenerico'
import api from '../../../api'
import ModalGenerico from '../ModalGenerico'
import { uploadImage } from '../../../utils/Imagen'

const perfilPropTypes = {
  nombre: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  data: PropTypes.shape({
    verificada: PropTypes.bool,
    telefono: PropTypes.number,
    cuit: PropTypes.number,
    descripcion: PropTypes.string,
    rubro: PropTypes.shape({
      id: PropTypes.number,
      nombre: PropTypes.string,
    }),
    avatar: PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string,
    }),
    ubicacion: PropTypes.shape({
      latitud: PropTypes.number,
      longitud: PropTypes.number,
      notas: PropTypes.string,
    }),
    usuario: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      user_type: PropTypes.number,
      is_confirmed: PropTypes.bool,
      nombre: PropTypes.string,
    }).isRequired,
  }),
  rubros: PropTypes.array.isRequired,
  switchToConsultar: PropTypes.func.isRequired,
}

class ModificarPerfilOrganizacion extends Component {
  constructor(props) {
    super(props);
    this.rubros = [{ id: 0, nombre: 'Ninguno' }].concat(this.props.rubros)
    this.fakeProps = this.checkBeforeState(this.props.data.rubro, this.props.data.ubicacion)
    this.state = {
      nombre: this.props.nombre,
      // Checkeo null porque si es null react tira un warning (https://github.com/reactstrap/reactstrap/issues/570)
      telefono: this.props.data.telefono == null ? '' : this.props.data.telefono,
      cuit: this.props.data.cuit == null ? '' : this.props.data.cuit,
      descripcion: this.props.data.descripcion == null ? '' : this.props.data.descripcion,
      avatar_url: this.props.data.avatar.url,
      ubicacion: this.fakeProps.ubicacion,
      rubro_id: this.fakeProps.rubro.id,
      rubros: this.rubros,
      showModal: false,
      modalType: 'success',
      errors: [],
      avatar_changed: false,
    }
    this.renderNombre = this.renderNombre.bind(this);
    this.renderUbicacion = this.renderUbicacion.bind(this);
    this.renderCuit = this.renderCuit.bind(this);
    this.renderDescripcion = this.renderDescripcion.bind(this);
    this.renderRubro = this.renderRubro.bind(this);
    this.renderTelefono = this.renderTelefono.bind(this);
    this.handleNombreChange = this.handleNombreChange.bind(this);
    this.handleCuitChange = this.handleCuitChange.bind(this);
    this.handleTelefonoChange = this.handleTelefonoChange.bind(this);
    this.handleDescripcionChange = this.handleDescripcionChange.bind(this);
    this.handleRubroChange = this.handleRubroChange.bind(this);
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSelectFile = this.onSelectFile.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleAvatarChange = this.handleAvatarChange.bind(this);
  }

  //Checkeo si hay nulls en los props antes meterlos en state
  checkBeforeState(rubro, ubicacion) {
    let newRubro = rubro
    let newUbicacion = ubicacion
    if (rubro == null) {
      newRubro = { id: 0, nombre: "" }
    }
    if (ubicacion == null) {
      newUbicacion = { latitud: -31.428900, longitud: -64.185424, notas: "" }
    }
    const respuesta = { rubro: newRubro, ubicacion: newUbicacion }
    return respuesta
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
        placeholder="Teléfono (ejemplo: 3515234567)"
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

  renderCuit() {
    return (
      <input
        type="text"
        name="cuit"
        className="form-control"
        placeholder="Cuit"
        value={this.state.cuit}
        onChange={this.handleCuitChange}
      />)
  }

  handleCuitChange(event) {
    if (isNaN(event.target.value)) {
      return;
    }
    this.setState({
      cuit: event.target.value
    });
  }

  renderRubro() {

    const rubro = this.state.rubro_id == null ? 0 : this.state.rubro_id
    const listaRubroEventos = this.state.rubros.map((r) =>
      <option key={r.id} value={r.id} data-key={r.id}>{r.nombre}</option>
    );

    return (
      <select
        value={rubro}
        className="form-control"
        onChange={this.handleRubroChange}>
        {listaRubroEventos}
      </select>
    )
  }

  handleRubroChange(event) {
    const selectedIndex = event.target.options.selectedIndex;
    const selectedId = event.target.options[selectedIndex].getAttribute('data-key');
    this.setState({
      rubro_id: parseInt(selectedId, 10)
    })
  }

  handleAvatarChange(avatar_url) {
    this.setState({
      avatar_url: avatar_url,
      avatar_changed: true,
    })
  }

  renderDescripcion() {
    return (
      <textarea
        rows='5'
        cols='30'
        className='form-control'
        value={this.state.descripcion}
        onChange={this.handleDescripcionChange}
      />)
  }

  handleDescripcionChange(event) {
    this.setState({
      descripcion: event.target.value
    });
  }

  renderUbicacion() {
    return (
      <SelectorUbicacion
        ubicacion={this.state.ubicacion}
        onUbicacionChange={this.handleUbicacionChange}
      />
    )
  }

  handleUbicacionChange(ubi) {
    this.setState({ ubicacion: ubi });
  }

  async prepareSubmitData() {
    const oldData = {
      nombre: this.props.nombre,
      telefono: this.props.data.telefono,
      cuit: this.props.data.cuit,
      descripcion: this.props.data.descripcion,
      avatar_url: this.props.data.avatar.url,
      ubicacion: this.fakeProps.ubicacion,
      rubro_id: this.fakeProps.rubro.id,
    }
    const newData = this.state

    let avatar_url = this.props.data.avatar.url
    if (this.state.avatar_changed) {
      const rx = /data.*base64,(.*)/gm
      const encondedAvatar = rx.exec(this.state.avatar_url)[1]
      avatar_url = await uploadImage(encondedAvatar)
      if (avatar_url === 'recall') {
        avatar_url = await uploadImage(encondedAvatar)
      }
    }
    const submitData = {
      descripcion: newData.descripcion,
      avatar: { url: avatar_url },
    }
    if (newData.cuit !== "") {
      submitData.cuit = newData.cuit
    }
    if (newData.telefono !== "") {
      submitData.telefono = newData.telefono
    }
    if (newData.rubro_id != null && newData.rubro_id !== 0) {
      submitData.rubro = { id: newData.rubro_id, nombre: this.state.rubros[newData.rubro_id].nombre }
    }
    if (newData.ubicacion !== oldData.ubicacion && newData.ubicacion !== this.fakeProps.ubicacion) {
      submitData.ubicacion = this.state.ubicacion
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
    this.prepareSubmitData().then(submitData => {
      if (this.validateData(submitData)) {

        api.put(`/perfiles/perfil_organizacion/${this.props.data.usuario.id}/`, submitData)
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
            onCancel={() => { this.setState({ showModal: false }) }}
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
          <div style={{ marginTop: '20px' }} className='container'>

            <div style={{ alignItems: 'center' }} className='form-group'>
              {/*<div style={{flexDirection: 'column', alignItems: 'flex-end',display: 'flex', justifyContent: 'center', height: '150px'}} className='col'> 
            <div style={{ display: 'flex', height: '50px', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }} >
              <p style={{ textAlign: 'right' }} 
                 className='h4'>Nombre</p>
            </div>   
            <div style={{ display: 'flex', height: '50px',width: '100%', justifyContent: 'flex-end', alignItems: 'center'}} >       
              <p style={{ textAlign: 'right' }} 
                 className='h4'>{this.renderNombre()}</p>
            </div>
            </div>*/
                //SI SE DECIDE PODER CAMBIAR NOMBRE EN PERFIL, USAR ESTE CODIGO
              }
              <div style={{ display: 'flex' }} className='col-md-3'>
                <p style={{ textAlign: 'right' }}
                  className='h4'>{this.props.nombre}</p>
              </div>
              <div className='col-md-9'>
                <img
                  className='rounded-circle'
                  src={this.state.avatar_url}
                  alt="avatar"
                  width="100"
                  height="100"
                />
                <input style={{ marginBottom: '10px', marginTop: '10px' }} type='file' onChange={this.onSelectFile} />
              </div>
            </div>

            <div className='form-group'>
              <p className='font-weight-bold col-md-3' htmlFor="mail">Mail</p>
              <div className='col-md-9'><p>{this.props.email}</p></div>
            </div>

            <div className='form-group'>
              <p className='font-weight-bold col-md-3' htmlFor="telefono">Teléfono</p>
              <div className='col-md-9'>{this.renderTelefono()}</div>
            </div>

            <div className='form-group'>
              <p className='font-weight-bold col-md-3' htmlFor="cuit">CUIT</p>
              <div className='col-md-9'>{this.renderCuit()}</div>
            </div>

            <div className='form-group'>
              <p className='font-weight-bold col-md-3' htmlFor="telefono">Rubro</p>
              <div className='col-md-9'>{this.renderRubro()}</div>
            </div>

            <div className='form-group'>
              <p className='font-weight-bold col-md-3' htmlFor="descripcion">Descripción</p>
              <div className='col-md-9'>{this.renderDescripcion()}</div>
            </div>

            <div className='form-group'>
              <p className='font-weight-bold col-md-3' htmlFor="ubicacion" style={{ textAlign: 'right' }}>Ubicación</p>
              <div className='col-md-9' style={{ marginBottom: '5px' }}>{this.renderUbicacion()}</div>
            </div>

            <div style={{ margin: '20px' }} className='row'>
              <div style={{ display: 'flex' }} className='col-md-3'>
                <button onClick={this.handleSubmit} type="button" className="btn btn-primary">
                  Guardar Cambios
            </button>
              </div>
              <div className='col-md-3'>
                <button type="button" className="btn btn-danger" onClick={this.props.switchToConsultar}>
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
ModificarPerfilOrganizacion.propTypes = perfilPropTypes;

export default ModificarPerfilOrganizacion;