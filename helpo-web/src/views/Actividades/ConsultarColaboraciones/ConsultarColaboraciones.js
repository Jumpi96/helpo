import React from 'react'
import { Card, CardHeader, CardBody } from 'reactstrap'
import TablaColaboraciones from './TablaColaboraciones/TablaColaboraciones'

class ConsultarColaboracion extends React.Component {
  constructor(props){
    super(props);
  }

  render() {

    const necesidades = this.props.necesidades

    return (
      <Card>
        <CardHeader>
            <i className="fa fa-align-justify"></i> <p>Colaboraciones del evento {this.props.evento}</p>
        </CardHeader>
        <CardBody>
          <TablaColaboraciones {...necesidades}/>
        </CardBody>
      </Card>
    );
  }
}

export default ConsultarColaboracion;