import React, { Component } from 'react';
import { Button, Table, Card, CardHeader, CardBody } from 'reactstrap';
import api from '../../../api';

class ConsultarPatrocinadores extends Component {
  constructor(props){
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search)
    const parametro = urlParams.get('evento');
    let evento;
    if (parametro) {
      evento = parametro;
    } else {
      this.props.history.push({ pathname: '/dashboard' });
    }
    this.state = {
      evento: { id: evento },
    };
    this.loadEvento = this.loadEvento.bind(this);
  }

  loadEvento() {
    api.get('/actividades/consulta_necesidades/' + this.state.evento.id + '/')
      .then(res => {
        this.setState({ evento: res.data });
      })
      .catch((error) => {
        if (error.response) { console.log(error.response.status) }
        else { console.log('Error: ', error.message) }
      })
  }

  componentDidMount() {
    this.loadEvento();
  }

  render() {
    const { evento } = this.state;
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Administración de patrocinadores de {evento.nombre}
          </CardHeader>
          <CardBody>
            <form>
              
            </form>
          </CardBody>
        </Card>
      </div>
    )
  }
}
  
  export default ConsultarPatrocinadores;