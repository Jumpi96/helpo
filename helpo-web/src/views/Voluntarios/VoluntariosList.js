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
      voluntarios: [],
      voluntariosTotal: 0
    };
    this.getLink = this.getLink.bind(this);
    this.movePage = this.movePage.bind(this);
    this.loadVoluntarios = this.loadVoluntarios.bind(this);
  }

  componentDidMount() {
    this.loadVoluntarios("", 1);
  }


  contieneNombre(voluntarios) {
    return voluntarios.usuario.nombre.toLowerCase().includes(this.state.nombre.toLowerCase())
  }

  getLink(voluntario) {
    return '/perfil/' + voluntario.usuario.id;
  }

  loadVoluntarios(ruta, page=1) {
    this.setState({ isLoading: true });
    const limit = 10;
    api.get('/perfiles/perfil_voluntario/?' + ruta + 'limit=' + limit + '&offset=' + ((page-1) * limit))
      .then((res) => {
        this.setState({ 
          voluntarios: res.data.data, 
          voluntariosTotal: res.data.total, 
          page: page, 
          rutas: ruta,
          isLoading: false 
        });
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
        );
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

  movePage(page) {
    if (page > 0 && page <= (this.state.voluntariosTotal / 10) + 1) {
      this.loadVoluntarios(this.state.rutas, page);
    }
  }

  loadPages() {
    let pages = [];
    for (let i = 0; i < (this.state.voluntariosTotal / 10); i++) {
      pages.push(
        <li class={this.state.page === i + 1 ? "page-item active" : "page-item"}>
          <a class="page-link" onClick={() => this.movePage(i + 1)}>{i + 1}</a>
        </li>
      );
    }
    return pages;
  }

  render() {
    let { voluntarios } = this.state;
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
        <nav aria-label="...">
          <ul class="pagination">
            <li class="page-item">
              <a class="page-link" onClick={() => this.movePage(this.state.page - 1)}>Anterior</a>
            </li>
            {this.loadPages()}
            <li class="page-item">
              <a class="page-link" onClick={() => this.movePage(this.state.page + 1)}>Posterior</a>
            </li>
          </ul>
        </nav>
      </div >
    );
  }
};

export default VoluntariosList;