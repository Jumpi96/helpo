import React from 'react';  
import { Card, CardHeader, CardBody } from 'reactstrap';
import {connect} from 'react-redux';
import api from '../../../api';
import ConsultarEventosList from './ConsultarEventosList';
import ConsultarEventosFilter from './ConsultarEventosFilter';

class ConsultarEventosPage extends React.Component {

  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search)
    const organizacion = urlParams.get('organizacion');
    this.state = {
      eventos: [],
      organizacion
    }
    this.loadEventos = this.loadEventos.bind(this);
  }

  getAuth() {
    return this.props.auth.isAuthenticated;
  }

  componentDidMount() {
    const ruta = this.state.organizacion ? '?organizacion=' + this.state.organizacion : '';
    this.loadEventos(ruta);
  }

  loadEventos(ruta) {
    api.get('/actividades/consulta_eventos/' + ruta)
      .then((res) => {
        this.setState({ eventos: res.data });
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  renderEventos(){
    const eventos = this.state.eventos;
    if(eventos.length === 0){
      return(
        <CardBody>
          <ConsultarEventosFilter updatePath={this.loadEventos} organizacion={this.state.organizacion} />
          <br />
          <label>&emsp;Todav&iacute;a no hay eventos registrados</label>
        </CardBody>
      )
    }
    else{
      return(
        <CardBody>
          <ConsultarEventosFilter updatePath={this.loadEventos} />
          <br />
          <ConsultarEventosList eventos={eventos} auth={this.getAuth()} />
        </CardBody>
      )
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Eventos
          </CardHeader>
          {this.renderEventos()}
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
