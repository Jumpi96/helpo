import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import './Voluntarios.css';
import VoluntariosList from './VoluntariosList'

class VoluntariosPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      voluntarios: []
    }
  }

  render() {
    return (

      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Voluntarios
          </CardHeader>
          <CardBody>
            <VoluntariosList />
          </CardBody>
        </Card>
      </div>

    );
  }

}

export default VoluntariosPage;