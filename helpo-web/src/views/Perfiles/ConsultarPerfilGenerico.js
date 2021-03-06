import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardHeader } from 'reactstrap'
import api from '../../api';
import ConsultarPerfilOrganizacion from './PerfilOrganizacion/ConsultarPerfilOrganizacion'
import ConsultarPerfilEmpresa from './PerfilEmpresa/ConsultarPerfilEmpresa'
import ConsultarPerfilVoluntario from './PerfilVoluntario/ConsultarPerfilVoluntario'
import ModificarPerfilOrganizacion from './PerfilOrganizacion/ModificarPerfilOrganizacion'
import ModificarPerfilEmpresa from './PerfilEmpresa/ModificarPerfilEmpresa'
import ModificarPerfilVoluntario from './PerfilVoluntario/ModificarPerfilVoluntario'

class ConsultarPerfilGenerico extends Component {
  constructor(props) {
    super(props); //Llama a las props del padre
    this.state = {
      nombre: '',
      userId: 0,
      userType: 0, // 1: ONG, 2: Vol, 3: Empresa
      email: '',
      data: {},
      rubros: [], // [{ id: , nombre: },]
      rubrosEmpresa: [], // [{ id: , nombre: },]
      modificar: false,
      loggedUser: true,
      mandatoryVol: []
    };
    this.renderConsultar = this.renderConsultar.bind(this)
    this.renderModificar = this.renderModificar.bind(this)
    this.renderConsultarOtro = this.renderConsultarOtro.bind(this)
    this.renderComponente = this.renderComponente.bind(this)
    this.switchToConsultar = this.switchToConsultar.bind(this)
    this.switchToModificar = this.switchToModificar.bind(this)
    this.isLoggedUser = this.isLoggedUser.bind(this)
  }

  isLoggedUser() {
    // Retorna true si el perfil es del usuario logeado, sino retorna false
    if (this.props.logeadoId === this.state.userId) {
      return true
    }
    else { return false }
  }

  getApiCall(userType) {
    switch (userType) {
      case 1:
        return 'perfil_organizacion'
      case 2:
        return 'perfil_voluntario'
      case 3:
        return 'perfil_empresa'
      default:
        return ''
    }
  }

  componentDidMount() {
    let initialState = { loggedUser: true };
    let userURL = ""
    const params = this.props.match.params
    // Me fijo si Object params no esta vacio
    if (params.usuarioId) {
      userURL = `/perfiles/user/${params.usuarioId}/`
      initialState.loggedUser = false
    }
    else {
      userURL = '/auth/user/'
    }
    api.get(userURL)
      .then(res => {
        initialState.nombre = res.data.nombre
        initialState.userId = res.data.id
        initialState.email = res.data.email
        initialState.userType = res.data.user_type

        return api.get(`/perfiles/${this.getApiCall(initialState.userType)}/${initialState.userId}/`)
      })
      .then(res => {
        initialState.data = res.data
        return api.get('/perfiles/rubros_organizacion/')
      })
      .then(res => {
        initialState.rubros = res.data
        return api.get('/perfiles/rubros_empresa/')
      })
      .then(res => {
        initialState.rubrosEmpresa = res.data
        return api.get('/users/skills/')
      })
      .then(res => {
        initialState.skills = res.data
        return api.get('/users/states/')
      })
      .then(res => {
        initialState.states = res.data
        return api.get('/users/modalities/')
      })
      .then(res => {
        initialState.modalities = res.data
      })
      .then(() => {
        // Cambio estado aca para asegurarme que se llame todo lo anterior
        this.setState({
          nombre: initialState.nombre,
          userId: initialState.userId,
          email: initialState.email,
          userType: initialState.userType,
          data: initialState.data,
          rubros: initialState.rubros,
          skills: initialState.skills,
          states: initialState.states,
          modalities: initialState.modalities,
          rubrosEmpresa: initialState.rubrosEmpresa,
          loggedUser: initialState.loggedUser,
          genders: [
            { id: "", nombre: "" },
            { id: "hombre", nombre: "Hombre" },
            { id: "mujer", nombre: "Mujer" },
            { id: "otro", nombre: "Otro" }
          ],
          mandatoryVol: [
            "first_name", "last_name",
            "birth_date", "gender",
            "phone", "interests",
            "skills", "availability",
            "modality"
          ],
          mandatoryOng: [
            "telefono",
            "cuit",
            "descripcion",
            "rubro",
          ]
        })
      })
      .catch(error => {
        console.log(error);
      })
  }

  switchToConsultar() {
    this.componentDidMount()
    this.setState({
      modificar: false
    })
  }

  switchToModificar() {
    this.setState({
      modificar: true
    })
  }

  loading = () => (
    <Card>
      <CardHeader>
        <i className="fa fa-align-justify"></i> Perfil
      </CardHeader>
      <CardBody>
        <div className="loader" />
      </CardBody>
    </Card>
  )

  renderModificar() {
    switch (this.state.userType) {
      case 1:
        return (<ModificarPerfilOrganizacion
          id={this.state.userId}
          userType={this.state.userType}
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          rubros={this.state.rubros}
          switchToConsultar={this.switchToConsultar}
        />)

      case 2:
        return (<ModificarPerfilVoluntario
          id={this.state.userId}
          userType={this.state.userType}
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          rubros={this.state.rubros}
          skills={this.state.skills}
          states={this.state.states}
          modalities={this.state.modalities}
          genders={this.state.genders}
          switchToConsultar={this.switchToConsultar}
        />)

      case 3:
        return (<ModificarPerfilEmpresa
          id={this.state.userId}
          userType={this.state.userType}
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          rubros={this.state.rubrosEmpresa}
          switchToConsultar={this.switchToConsultar}
        />)

      default:
        return (this.loading())
    }
  }

  renderConsultarOtro() {
    switch (this.state.userType) {
      case 1:
        return (<ConsultarPerfilOrganizacion
          id={this.state.userId}
          userType={this.state.userType}
          nombre={this.state.nombre}
          email={this.state.email}
          rubros={this.state.rubros}
          data={this.state.data}
          switchToModificar={this.switchToModificar}
          sinModificar={!this.isLoggedUser()}
        />)

      case 2:
        return (<ConsultarPerfilVoluntario
          id={this.state.userId}
          userType={this.state.userType}
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          skills={this.state.skills}
          interests={this.state.rubros}
          states={this.state.states}
          modalities={this.state.modalities}
          switchToModificar={this.switchToModificar}
          sinModificar={!this.isLoggedUser()}
        />)

      case 3:
        return (<ConsultarPerfilEmpresa
          id={this.state.userId}
          userType={this.state.userType}
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          switchToModificar={this.switchToModificar}
          sinModificar={!this.isLoggedUser()}
        />)

      default:
        return (this.loading())
    }
  }

  renderConsultar() {
    switch (this.state.userType) {
      case 1:
        return (<ConsultarPerfilOrganizacion
          id={this.state.userId}
          userType={this.state.userType}
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          rubros={this.state.rubros}
          switchToModificar={this.switchToModificar}
          sinModificar={!this.isLoggedUser()}
        />)

      case 2:
        return (<ConsultarPerfilVoluntario
          id={this.state.userId}
          userType={this.state.userType}
          nombre={this.state.nombre}
          email={this.state.email}
          data={this.state.data}
          states={this.state.states}
          skills={this.state.skills}
          modalities={this.state.modalities}
          interests={this.state.rubros}
          switchToModificar={this.switchToModificar}
          sinModificar={!this.isLoggedUser()}
        />)

      case 3:
        return (
          <ConsultarPerfilEmpresa
            id={this.state.userId}
            userType={this.state.userType}
            nombre={this.state.nombre}
            email={this.state.email}
            data={this.state.data}
            switchToModificar={this.switchToModificar}
            sinModificar={!this.isLoggedUser()}
          />)

      default:
        return (this.loading())
    }
  }

  mandatoryCompleted(mandatory) {
    let completed = true;
    let state = this.state;
    mandatory.forEach(function (k) {
      if (state.data[k] === null || state.data[k] === "" ||
        (Array.isArray(state.data[k]) && state.data[k].length === 0)) {
        completed = false;
      }
    });
    return completed;
  }

  renderComponente() {
    if (this.state.loggedUser && this.state.modificar) {
      return this.renderModificar()
    }
    else if (this.state.loggedUser && !this.state.modificar) {
      const mandatory = this.state.userType === 1 ? 
          this.state.mandatoryOng : this.state.mandatoryVol;
      if (this.mandatoryCompleted(mandatory)) {
        return this.renderConsultar();
      } else {
        return this.renderModificar();
      }
    }
    else { return this.renderConsultarOtro() }
  }

  render() {
    return (
      <div>
        {this.renderComponente()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  logeadoId: state.auth.user.id
})

export default connect(mapStateToProps)(ConsultarPerfilGenerico);