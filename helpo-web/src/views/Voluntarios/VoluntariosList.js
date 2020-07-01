import React from 'react';
import { Col, Row, CardBody } from 'reactstrap';
import VoluntarioCard from './VoluntarioCard';
import VoluntariosFilter from './VoluntariosFilter';
import api from '../../api';


class VoluntariosList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombre: '',
      error: '',
      voluntarios: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.buscarVoluntarios = this.buscarVoluntarios.bind(this);
    this.getLink = this.getLink.bind(this);
    this.loadVoluntarios = this.loadVoluntarios.bind(this);
  }

  componentDidMount() {
    this.loadVoluntarios("");
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  buscarVoluntarios() {
    const { voluntarios } = this.state;
    if (this.state.nombre !== '') {
      const voluntariosFiltrados = voluntarios.filter(voluntario => this.contieneNombre(voluntario));
      return voluntariosFiltrados;
    }
    return voluntarios;
  }

  contieneNombre(voluntarios) {
    return voluntarios.usuario.nombre.toLowerCase().includes(this.state.nombre.toLowerCase())
  }

  getLink(voluntario) {
    return '/perfil/' + voluntario.usuario.id;
  }

  loadVoluntarios(ruta) {
    this.setState({ isLoading: true });
    api.get('/perfiles/perfil_voluntario/' + ruta)
      .then((res) => {
        this.setState({ voluntarios: res.data, isLoading: false });
      })
      .catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
        this.setState({ isLoading: false });
      })
  }

  renderVoluntarios(voluntarios) {
    let render = [];
    for (let i = 0; i < voluntarios.length; i += 2) {
      const voluntario = voluntarios[i];
      if (voluntarios.length > i + 1) {
        const voluntarioDos = voluntarios[i + 1];
        render.push(
          <div className="row">
            <Col md="6">
              <VoluntarioCard
                voluntario={voluntario}
                key={voluntario.id} footer
                color="primary" auth={this.props.auth}
                link={this.getLink(voluntario)} // Ver que link va
              />
            </Col>
            <Col md="6">
              <VoluntarioCard
                voluntario={voluntarioDos}
                key={voluntarioDos.id} footer
                color="primary" auth={this.props.auth}
                link={this.getLink(voluntarioDos)} // Ver que link va
              />
            </Col>
          </div >
        )
        console.log(render.length)
      } else {
        render.push(
          <div className="row">
            <Col md="6">
              <VoluntarioCard
                voluntario={voluntario}
                key={voluntario.id} footer
                color="primary" auth={this.props.auth}
                link={this.getLink(voluntario)} // Ver que link va
              />
            </Col>
          </div>
        )
      }
    }
    return render;
  }

  render() {
    const voluntarios = this.buscarVoluntarios();
    return (
      <div>
        <div className="row">
          <CardBody>
            <VoluntariosFilter
              updatePath={this.loadVoluntarios}
            />
          </CardBody>
        </div>
        {voluntarios.length > 0 ? this.renderVoluntarios(voluntarios) :
          <div className="row">
            <div className="form-group col-md-6 col-md-offset-3">
              <label>&emsp;Todav&iacute;a no hay voluntarios registrados.</label>
            </div>
          </div>
        }
      </div >
    );
  }
};

export default VoluntariosList;