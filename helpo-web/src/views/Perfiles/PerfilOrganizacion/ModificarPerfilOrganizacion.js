import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Card, CardHeader } from 'reactstrap';
import Select from 'react-select';
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
      telefono: this.props.data.telefono == null ? '' : this.props.data.telefono.toString(),
      cuit: this.props.data.cuit == null ? '' : this.props.data.cuit.toString(),
      descripcion: this.props.data.descripcion == null ? '' : this.props.data.descripcion,
      avatar_url: this.props.data.avatar.url,
      ubicacion: this.props.data.ubicacion == null ? this.fakeProps.ubicacion : this.props.data.ubicacion,
      rubros: this.loadSelectedOptions(this.props.data.rubros, this.loadOptions(this.props.rubros)),
      showModal: false,
      modalType: 'success',
      errors: [],
      avatar_changed: false,
      mandatoryOng: [
        "telefono",
        "cuit",
        "descripcion",
        "rubros",
      ]
    }
    this.renderNombre = this.renderNombre.bind(this);
    this.renderUbicacion = this.renderUbicacion.bind(this);
    this.renderCuit = this.renderCuit.bind(this);
    this.renderDescripcion = this.renderDescripcion.bind(this);
    this.renderTelefono = this.renderTelefono.bind(this);
    this.handleNombreChange = this.handleNombreChange.bind(this);
    this.handleCuitChange = this.handleCuitChange.bind(this);
    this.handleTelefonoChange = this.handleTelefonoChange.bind(this);
    this.handleDescripcionChange = this.handleDescripcionChange.bind(this);
    this.handleRubrosChange = this.handleRubrosChange.bind(this);
    this.handleUbicacionChange = this.handleUbicacionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSelectFile = this.onSelectFile.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleAvatarChange = this.handleAvatarChange.bind(this);
  }

  loadOptions(rawOptions) {
    const options = [];
    rawOptions.forEach(function (o) {
      options.push({ value: o.id, label: o.nombre });
    });
    return options;
  }

  loadSelectedOptions(selectedOptions, options) {
    let selected = [];
    options.forEach(function (o) {
      if (selectedOptions.indexOf(o.value) >= 0) {
        selected.push(o);
      }
    });
    return selected;
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
        placeholder="Ejemplo: 3515234567"
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

  renderRubros() {
    return (
      <Select
        name="rubros"
        placeholder="Seleccione..."
        options={this.loadOptions(this.props.rubros)}
        isMulti onChange={this.handleRubrosChange}
        value={this.state.rubros}
      />)
  }

  handleRubrosChange(rubros) {
    this.setState({ rubros });
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
      avatar_url,
      cuit: newData.cuit,
      telefono: newData.telefono,
      ubicacion: null
    }
    let rubros = [];
    if (newData.rubros !== null) {
      newData.rubros.forEach(function (o) { rubros.push(o.value); });
    }
    submitData.rubros = rubros;
    submitData.ubicacion = this.state.ubicacion
    
    return submitData
  }

  validateData(submitData) {
    if (submitData.avatar_url === 'error' || submitData.avatar_url == null) {
      let errors = this.state.errors
      errors.push("Imagen upload failure")
      this.setState({
        errors: errors
      })
      return false
    }

    let completed = true;
    this.state.mandatoryOng.forEach(function (k) {
      if (submitData[k] === -1 || submitData[k] === "" ||
        (Array.isArray(submitData[k]) && submitData[k].length === 0)) {
        completed = false;
      }
    });

    if (!completed) {
      this.setState({ errors: ["Falta completar campos obligatorios."] });
      return false;
    }

    this.setState({
      avatar_url: submitData.avatar_url
    })
    return true
  }

  handleSubmit() {
    this.prepareSubmitData().then(submitData => {
      if (this.validateData(submitData)) {
        api.put(`/users/profiles/organization/${this.props.data.usuario.id}/`, submitData)
          .then(res => {
            if (res.status === 201) {
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

  renderErrorList() {
    var list = [];
    var ids = 0;
    for (var key in this.state.errors) {
      var value = this.state.errors[key]
      if (value !== "") {
        list.push((<li class="list-group-item" key={ids}><span>{value}</span></li>))
      }
      ids = ids + 1;
    }
    if (list.length > 0) {
      return (
        <div class="alert alert-danger" role="alert">
          <ul class="list-group">
            {list}
          </ul>
        </div>
      )
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
              <p className='font-weight-bold col-md-3' htmlFor="telefono">Teléfono (*)</p>
              <div className='col-md-9'>{this.renderTelefono()}</div>
            </div>

            <div className='form-group'>
              <p className='font-weight-bold col-md-3' htmlFor="cuit">CUIT/CUIL (*)</p>
              <div className='col-md-9'>{this.renderCuit()}</div>
            </div>

            <div className='form-group'>
              <p className='font-weight-bold col-md-3' htmlFor="telefono">Rubros (*)</p>
              <div className='col-md-9'>{this.renderRubros()}</div>
            </div>

            <div className='form-group'>
              <p className='font-weight-bold col-md-3' htmlFor="descripcion">Descripción (*)</p>
              <div className='col-md-9'>{this.renderDescripcion()}</div>
            </div>

            <div className='form-group'>
              <p className='font-weight-bold col-md-3' htmlFor="ubicacion">Ubicación</p>
              <div className='col-md-9' style={{ marginBottom: '5px' }}>{this.renderUbicacion()}</div>
            </div>
            {this.renderErrorList()}
            <div style={{ margin: '20px' }} className='row'>
              <div style={{ display: 'flex' }} className='col-md-3'>
                <button onClick={this.handleSubmit} type="button" className="btn btn-primary">
                  Guardar cambios
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