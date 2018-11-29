import React, { Component } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';

class RedireccionarEvento extends Component {

  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search)
    const id = urlParams.get('id');
    this.state = {
      evento: id
    }
  }

  componentDidMount() {
    if (localStorage.getItem("token") !== null) {
      this.props.history.push({
        pathname: '/actividades/consultar-evento',
        search: '?id=' + this.state.evento,
      });
    } else {
      this.props.history.push({
        pathname: '/noAuth/actividades/consultar-evento',
        search: '?id=' + this.state.evento,
      });
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Consultar actividad social
          </CardHeader>
          <CardBody>
            <div className="loader" />
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default RedireccionarEvento;