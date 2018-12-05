import React, { Component } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';

class RedireccionarONG extends Component {

  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search)
    const id = urlParams.get('id');
    this.state = {
      ong: id
    }
  }

  componentDidMount() {
    if (localStorage.getItem("token") !== null) {
      this.props.history.push({
        pathname: '/actividades/consultar-eventos',
        search: '?organizacion=' + this.state.ong,
      });
    } else {
      this.props.history.push({
        pathname: '/noAuth/actividades/consultar-eventos',
        search: '?organizacion=' + this.state.ong,
      });
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Consultar actividades de ONG
          </CardHeader>
          <CardBody>
          <div className="loader"/>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default RedireccionarONG;