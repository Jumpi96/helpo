import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import api from '../../api';
import './Voluntarios.css';
import VoluntariosList from './VoluntariosList'

class VoluntariosPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      voluntarios: []
    }
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    let url = `/perfiles/perfil_voluntario/`;
    api.get(url)
      .then((res) => {
        this.setState({
          voluntarios: res.data,
        })
      })
  }

  renderListadoVoluntarios() {
    const voluntarios = this.state.voluntarios;
    if (voluntarios.length === 0) {
      return (
        <div className="row">
          <div className="form-group col-md-6 col-md-offset-3">
            <label>&emsp;Todav&iacute;a no hay voluntarios registrados.</label>
          </div>
        </div>
      )
    }
    else {
      return (
        <CardBody>
          <VoluntariosList voluntarios />
        </CardBody>
      )
    }
  }


  render() {
    return (

      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Voluntarios
          </CardHeader>
          {this.renderListadoVoluntarios()}
        </Card>
      </div>

    );
  }

}

export default VoluntariosPage;