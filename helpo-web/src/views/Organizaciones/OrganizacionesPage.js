import React from 'react';
import { Card, CardHeader, CardBody, Table } from 'reactstrap';
import moment from 'moment';
import api from '../../../api';
import './organizaciones.css';
import ong from '../../../assets/img/ong.png';
import { getImagen } from '../../../utils/Imagen';
import OrganizacionesList from './OrganizacionesList'

class OrganizacionesPage extends React.Component {  

  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search)
    const id = urlParams.get('id');
    this.state = {
      organizaciones: []
    }
    this.toggleColaborar = this.toggleColaborar.bind(this);
    this.loadorganizacion = this.loadorganizacion.bind(this);
  }

  loadOrganizacion() { // Puede usarse 
    api.get('/actividades/consulta_organizaciones/' + this.state.organizacion.id + '/')
      .then(res => {
        this.setState({ organizacion: res.data });
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  componentDidMount() { // Ver como solucionar esto, falta la vista de la API
    api.get(`/perfiles/perfil_organizacion/*`)
    .then( (res) => {
      let rubro = res.rubro
      let ubicacion = res.ubicacion
      if ( rubro == null ) {
        rubro = { id: 0, nombre: 'none'}
      }
      if ( ubicacion == null ) {
        ubicacion = { latitud: 0, longitud: 0, notas:'#!None#!'}
      }
      this.setState({
        cuit: res.cuit,
        telefono: res.telefono,
        descripcion: res.descripcion,
        rubro_id: rubro.id,
        rubro_nombre: rubro.nombre,
        avatar_url: res.avatar.url,        
      })
    })
  }  

  renderListadoOrganizaciones(){
    const organizaciones = this.props.organizaciones;
    if(organizaciones.length === 0){
      return(
        <div className="row">
          <div className="form-group col-md-6 col-md-offset-3">
            <label>&emsp;Todav&iacute;a no hay organizaciones registradas</label>
          </div>
        </div>
      )
    }
    else{
      return(
        <CardBody>
            <OrganizacionesList organizaciones={organizaciones}/>
        </CardBody>
      )
    }
  }



  render() {

    return (

      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Organizaciones 
          </CardHeader>
          {this.renderListadoOrganizaciones()}
        </Card>
      </div>

    );
  }

}
  
export default OrganizacionesPage;