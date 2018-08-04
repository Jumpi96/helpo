import React, { Component } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';


class Home extends Component {
 
  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Bienvenidos a <b>helpo</b>
          </CardHeader>
          <CardBody>
            
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Home;
