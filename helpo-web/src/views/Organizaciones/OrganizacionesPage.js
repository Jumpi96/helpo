import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import api from '../../api';
import './Organizaciones.css';
import OrganizacionesList from './OrganizacionesList'

class OrganizacionesPage extends React.Component {  

  constructor(props) {
    super(props);
    this.state = {
      organizaciones:[]
    }
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {  // Suponiendo  que res son todas las organizaciones
    api.get(`/perfiles/perfil_organizacion/`)
    .then( (res) => {
      this.setState({
        organizaciones: res.data,        
      })
    })
  }  

  renderListadoOrganizaciones(){
    const organizaciones = this.state.organizaciones;
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