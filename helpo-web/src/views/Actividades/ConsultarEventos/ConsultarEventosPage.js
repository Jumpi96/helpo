import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from 'reactstrap';
import { connect } from 'react-redux';
import api from '../../../api';
import ConsultarEventosList from './ConsultarEventosList';
import ConsultarEventosFilter from './ConsultarEventosFilter';
import ButtonsCompartirOrganizacion from '../../common/ButtonsCompartir/ButtonsCompartirOrganizacion';

class ConsultarEventosPage extends React.Component {

  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search)
    const organizacion = urlParams.get('organizacion');
    const empresa = urlParams.get('empresa');
    this.state = {
      eventos: [],
      organizacion,
      empresa,
      ong: [],
      // Eventos pasados
      verAntiguos: false,
      isLoading: false
    }
    this.loadEventos = this.loadEventos.bind(this);
    this.loadONG = this.loadONG.bind(this);
  }

  getAuth() {
    return this.props.auth.isAuthenticated;
  }

  handleChangeVerAntiguos = () => { 
    const verAntiguos = !this.state.verAntiguos
    this.setState({verAntiguos: verAntiguos})
  }

  componentDidMount() {
    let ruta;
    if (this.state.organizacion) {
      ruta = '?organizacion=' + this.state.organizacion;
    } else if (this.state.empresa) {
      ruta = '?empresa=' + this.state.empresa;
    } else {
      ruta = '';
    }
    this.loadEventos(ruta);
    if (this.state.organizacion) { this.loadONG() };
  }

  loadEventos(ruta) {
    this.setState({ isLoading: true });
    api.get('/actividades/consulta_eventos/' + ruta)
      .then((res) => {
        this.setState({ eventos: res.data, isLoading: false });
      })
      .catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
        this.setState({ isLoading: false });
      })
  }

  loadONG() {
    api.get(`/perfiles/perfil_organizacion/${this.state.organizacion}/`)
      .then((res) => {
        this.setState({ ong: res.data.usuario });
      })
      .catch((error) => {
        this.setState({ ong: undefined });
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
      })
  }

  renderEventos() {
    const eventos = this.state.eventos;
    if (eventos.length === 0) {
      return (
        <CardBody>
          <ConsultarEventosFilter
            updatePath={this.loadEventos}
            organizacion={this.state.organizacion}
            empresa={this.state.empresa}
            verAntiguos={this.state.verAntiguos}
            onChangeVerAntiguos={this.handleChangeVerAntiguos}
          />
          <br />
          {this.state.isLoading ?
             <div class="loader"></div>  :
            <label>&emsp;Todav&iacute;a no hay actividades sociales registrados</label>
          }
        </CardBody>
      )
    } else {
      return (
        <CardBody>
          <ConsultarEventosFilter 
            updatePath={this.loadEventos} 
            verAntiguos={this.state.verAntiguos}
            onChangeVerAntiguos={this.handleChangeVerAntiguos}
            />
          <br />
          <ConsultarEventosList 
            eventos={eventos} 
            auth={this.getAuth()} 
            verAntiguos={this.state.verAntiguos}/>
        </CardBody>
      )
    }
  }

  renderCompartir() {
    const organizacion = this.state.organizacion;
    if (organizacion) {
      const ong = this.state.ong;
      if (ong) {
        return (
          <CardFooter>
            <div className="row">
              <div className="form-group">
                <b name="compartir" className="float-left">Compartir</b>
              </div>
              <div className="form-group">
                <div className="float-left offset-md-3">
                  <ButtonsCompartirOrganizacion ong={ong} />
                </div>
              </div>
            </div>
          </CardFooter>
        )
      }
    }
    else {
      return undefined;
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Actividades sociales
          </CardHeader>
          {this.renderEventos()}
          {this.renderCompartir()}
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    auth: state.auth,
  }
}
export default connect(mapStateToProps, undefined)(ConsultarEventosPage);
