import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import Select from 'react-select'
import PropTypes from 'prop-types'
import moment from 'moment';
import { Card, CardBody, CardHeader } from 'reactstrap';
import api from '../../../api'
import ModalGenerico from '../ModalGenerico'
import { uploadImage } from '../../../utils/Imagen';

const perfilPropTypes = {
  nombre: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  data: PropTypes.shape({
    avatar: PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string,
    }),
    last_name: PropTypes.string,
    dni: PropTypes.number,
    gender: PropTypes.string,
    birth_date: PropTypes.string,
    phone: PropTypes.string,
    work_position: PropTypes.string,
    profession: PropTypes.string,
    educational_level: PropTypes.string,
    availability: PropTypes.string,
    modality: PropTypes.string,
    state: PropTypes.number,
    city: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.number),
    skills: PropTypes.arrayOf(PropTypes.number),
    usuario: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      user_type: PropTypes.number,
      is_confirmed: PropTypes.bool,
      nombre: PropTypes.string,
    }).isRequired,
    manos: PropTypes.number,
    eventos: PropTypes.number
  }),
  switchToConsultar: PropTypes.func.isRequired,
}

class ModificarPerfilVoluntario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: this.props.nombre,
      first_name: this.props.nombre,
      last_name: this.props.data.last_name,
      gender: this.getMaybeEmptyInput(this.props.data.gender),
      dni: this.getMaybeEmptyInput(this.props.data.dni),
      birth_date: this.props.data.birth_date == null ? null : this.processDate(this.props.data.birth_date),
      phone: this.getMaybeEmptyInput(this.props.data.phone),
      work_position: this.getMaybeEmptyInput(this.props.data.work_position),
      profession: this.getMaybeEmptyInput(this.props.data.profession),
      educational_level: this.getMaybeEmptyInput(this.props.data.educational_level),
      availability: this.getMaybeEmptyInput(this.props.data.availability),
      modality: this.getMaybeEmptyInput(this.props.data.modality),
      state: this.loadState(this.props.data.state),
      city: this.getMaybeEmptyInput(this.props.data.city),
      interests: this.loadSelectedOptions(this.props.data.interests, this.loadOptions(this.props.rubros)),
      avatar_url: this.props.data.avatar.url,
      skills: this.loadSelectedOptions(this.props.data.skills, this.loadOptions(this.props.skills)),
      showModal: false,
      modalType: 'success',
      errors: [],
      avatar_changed: false,
    };
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleDniChange = this.handleDniChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleBirthDateChange = this.handleBirthDateChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleWorkPositionChange = this.handleWorkPositionChange.bind(this);
    this.handleProfessionChange = this.handleProfessionChange.bind(this);
    this.handleEducationalLevelChange = this.handleEducationalLevelChange.bind(this);
    this.handleAvailabilityChange = this.handleAvailabilityChange.bind(this);
    this.handleModalityChange = this.handleModalityChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleInterestsChange = this.handleInterestsChange.bind(this);
    this.handleSkillsChange = this.handleSkillsChange.bind(this);
    this.handleAvatarChange = this.handleAvatarChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSelectFile = this.onSelectFile.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  processDate(date) {
    const s = moment(this.props.data.birth_date, "YYYY-MM-DD").toISOString();
    if (s[s.length - 1] === 'Z') {
      var b = s.split(/\D+/);
      return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    } else {
      return s;
    }
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

  loadState(state) {
    let selected = null;
    this.loadOptions(this.props.states).forEach(function (o) {
      if (o.value === state) {
        selected = o;
      }
    });
    return selected;
  }

  getMaybeEmptyInput(data) {
    return data == null ? '' : data;
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

  renderGender() {
    return (
      <Select
        name="gender"
        placeholder="Seleccione..."
        onChange={this.handleGenderChange}
        value={this.state.gender}
        options= {[
          { value: 'hombre', label: 'Hombre' },
          { value: 'mujer', label: 'Mujer' },
          { value: 'otro', label: 'Otro' },
        ]}
      />)
  }

  renderBirthDate() {
    return (
      <DateTimePicker
        name="inicio"
        onChange={this.handleBirthDateChange}
        disableClock={false}
        value={this.state.birth_date}
      />
    );
  }

  handleBirthDateChange(date) {
    console.log(date)
    this.setState({ birth_date: date });
  }

  handleStateChange(state) {
    this.setState({ state });
  }

  renderState() {
    return (
      <Select
        name="states"
        placeholder="Seleccione..."
        options={this.loadOptions(this.props.states)}
        onChange={this.handleStateChange}
        value={this.state.state}
      />
    )
  }

  renderCity() {
    return (
      <input
        type="text"
        name="city"
        className="form-control"
        value={this.state.city}
        onChange={this.handleCityChange}
      />)
  }

  renderProfession() {
    return (
      <input
        type="text"
        name="profession"
        className="form-control"
        value={this.state.profession}
        onChange={this.handleProfessionChange}
      />)
  }

  handleProfessionChange(event) {
    this.setState({
      profession: event.target.value
    })
  }

  renderWorkPosition() {
    return (
      <input
        type="text"
        name="work_position"
        className="form-control"
        value={this.state.work_position}
        onChange={this.handleWorkPositionChange}
      />)
  }

  handleWorkPositionChange(event) {
    this.setState({
      work_position: event.target.value
    })
  }

  renderEducationalLevel() {
    return (
      <input
        type="text"
        name="education_level"
        className="form-control"
        placeholder="Ejemplo: universitario incompleto"
        value={this.state.educational_level}
        onChange={this.handleEducationalLevelChange}
      />)
  }

  handleEducationalLevelChange(event) {
    this.setState({
      educational_level: event.target.value
    })
  }

  renderModality() {
    return (
      <Select
        name="modality"
        placeholder="Seleccione..."
        onChange={this.handleModalityChange}
        value={this.state.modality}
        options= {[
          { value: 'presencial', label: 'Presencial' },
          { value: 'telefónica', label: 'Telefónica' },
          { value: 'virtual', label: 'Virtual' },
        ]}
      />)
  }

  handleModalityChange(modality) {
    this.setState({ modality })
  }

  renderAvailability() {
    return (
      <textarea
        rows='5'
        cols='30'
        className='form-control'
        placeholder="Contá qué días y horarios estarías disponible"
        value={this.state.availability}
        onChange={this.handleAvailabilityChange}
      />
    )
  }

  handleAvailabilityChange(event) {
    this.setState({
      availability: event.target.value
    })
  }

  handleCityChange(event) {
    this.setState({
      nombre: event.target.value
    })
  }

  handleGenderChange(gender) {
    this.setState({ gender })
  }

  renderGustos() {
    return (
      <Select
        name="organization_areas"
        placeholder="Seleccione..."
        options={this.loadOptions(this.props.rubros)}
        isMulti onChange={this.handleInterestsChange}
        value={this.state.interests}
      />)
  }

  handleInterestsChange(interests) {
    this.setState({ interests });
  }

  renderHabilidades() {
    return (
      <Select
        name="habilidades"
        placeholder="Seleccione..."
        options={this.loadOptions(this.props.skills)}
        isMulti onChange={this.handleSkillsChange}
        value={this.state.skills}
      />)
  }

  handleSkillsChange(skills) {
    this.setState({ skills });
  }

  handleFirstNameChange(event) {
    this.setState({
      first_name: event.target.value
    })
  }

  handleLastNameChange(event) {
    this.setState({
      last_name: event.target.value
    })
  }


  renderTelefono() {
    return (
      <input
        type="text"
        name="telefono"
        className="form-control"
        placeholder="Ejemplo: 3515234567"
        value={this.state.phone}
        onChange={this.handlePhoneChange}
      />)
  }

  renderFirstName() {
    return (
      <input
        type="text"
        name="first-name"
        className="form-control"
        value={this.state.first_name}
        onChange={this.handleFirstNameChange}
      />) 
  }

  renderLastName() {
    return (
      <input
        type="text"
        name="last-name"
        className="form-control"
        value={this.state.last_name}
        onChange={this.handleLastNameChange}
      />) 
  }

  handlePhoneChange(event) {
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
        value={this.state.dni}
        onChange={this.handleDniChange}
      />)
  }

  loadOptions(rawOptions) {
    const options = [];
    rawOptions.forEach(function (o) {
      options.push({ value: o.id, label: o.nombre });
    });
    return options;
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
    const newData = this.state;

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
      user_id: this.props.data.usuario.id,
      avatar: { url: avatar_url },
      avatar_url: avatar_url,
      dni: newData.dni.toString(),
      gender: newData.gender,
      last_name: newData.last_name,
      first_name: newData.first_name,
      birth_date: newData.birth_date,
      phone: newData.phone,
      work_position: newData.work_position,
      profession: newData.profession,
      educational_level: newData.educational_level,
      availability: newData.availability,
      modality: newData.modality,
      state_id: undefined,
      city: newData.city,
      interests: undefined,
      skills: undefined
    };

    let interests = [];
    if (newData.interests !== null) {
      newData.interests.forEach(function (o) { interests.push(o.value); });
    }
    submitData.interests = interests;

    let skills = [];
    if (newData.skills !== null) {
      newData.skills.forEach(function (o) { skills.push(o.value); });
    }
    submitData.skills = skills;

    submitData.state_id = newData.state === undefined ? null : newData.state.value;

    if (newData.birth_date !== "") {
      submitData.birth_date = moment(newData.birth_date).format("YYYY-MM-DD");
    }

    return submitData;
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
        api.put(`/users/profiles/volunteer/${this.props.data.usuario.id}/`, submitData)
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
        <CardBody>
          <div style={{ alignItems: 'center' }} className='form-group'>
            <div className='col-md-3'>
              <p className='h4'>{this.state.first_name} {this.state.last_name}</p>
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

          <div className="row">
            <div className="col-md">
            <div className='row'>
                <p style={{ paddingTop: '8px' }} className='font-weight-bold col-md-2' htmlFor="first_name">Nombre</p>
                <div className='col-md-4'>{this.renderFirstName()}</div>
                <p style={{ paddingTop: '8px' }} className='font-weight-bold col-md-2' htmlFor="last_name">Apellido</p>
                <div className='col-md-4'>{this.renderLastName()}</div>
              </div>

              <div className='row'>
                <p style={{ paddingTop: '8px' }} className='font-weight-bold col-md-2' htmlFor="telefono">Teléfono</p>
                <div className='col-md-4'>{this.renderTelefono()}</div>
                <p style={{ paddingTop: '8px' }} className='font-weight-bold col-md-2' htmlFor="dni">DNI</p>
                <div className='col-md-4'>{this.renderDni()}</div>
              </div>

              <div className='row'>
                <p className='font-weight-bold col-md-2' htmlFor="sexo">Género</p>
                <div className='col-md-4'>{this.renderGender()}</div>
                <p className='font-weight-bold col-md-2' htmlFor="birth_date">Fecha de nacimiento</p>
                <div className='col-md-4'>{this.renderBirthDate()}</div>
              </div>

              <div className='row'>
                <p className='font-weight-bold col-md-2' htmlFor="city">Ciudad</p>
                <div className='col-md-4'>{this.renderCity()}</div>
                <p className='font-weight-bold col-md-2' htmlFor="state">Provincia</p>
                <div className='col-md-4'>{this.renderState()}</div>
              </div>

              <div className='row'>
                <p style={{ paddingTop: '8px' }} className='font-weight-bold col-md-2' htmlFor="gustos">Áreas de interés</p>
                <div className='col-md-4'>{this.renderGustos()}</div>
                <p style={{ paddingTop: '8px' }} className='font-weight-bold col-md-2' htmlFor="habilidades">Habilidades</p>
                <div className='col-md-4'>{this.renderHabilidades()}</div>
              </div>

              <div className='row'>
                <p style={{ paddingTop: '8px' }} className='font-weight-bold col-md-2' htmlFor="work_position">Posición laboral</p>
                <div className='col-md-4'>{this.renderWorkPosition()}</div>
                <p style={{ paddingTop: '8px' }} className='font-weight-bold col-md-2' htmlFor="profession">Profesión</p>
                <div className='col-md-4'>{this.renderProfession()}</div>
              </div>

              <div className='row'>
                <p style={{ paddingTop: '8px' }} className='font-weight-bold col-md-2' htmlFor="educational_level">Nivel educativo</p>
                <div className='col-md-4'>{this.renderEducationalLevel()}</div>
                <p style={{ paddingTop: '8px' }} className='font-weight-bold col-md-2' htmlFor="modality">Modalidad</p>
                <div className='col-md-4'>{this.renderModality()}</div>
              </div>

              <div className='row'>
                <p style={{ paddingTop: '8px' }} className='font-weight-bold col-md-2' htmlFor="availability">Disponibilidad</p>
                <div className='col-md-4'>{this.renderAvailability()}</div>
              </div>

              <div className='row' style={{ paddingTop: '8px' }}>
                <div className='form-group'>
                  <div className='col-md-3'>
                    <button onClick={this.handleSubmit} type="button" className="btn btn-primary">
                      Guardar cambios
                </button>
                  </div>
                </div>
                <div className='form-group'>
                  <div className='col-md-3'>
                    <button type="button" className="btn btn-danger" onClick={this.props.switchToConsultar}>
                      Volver
                </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </CardBody>
        {this.renderModal()}
      </Card >
    );
  }
}
ModificarPerfilVoluntario.propTypes = perfilPropTypes;

export default ModificarPerfilVoluntario;