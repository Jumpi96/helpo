import React from 'react'
import { Card, CardHeader, CardBody } from 'reactstrap'
import TablaColaboraciones from './TablaColaboraciones/TablaColaboraciones'
import { connect } from 'redux'

const ConsultarColaboracionConnected  = () => {

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


const mapStateToProps = state => {
  return { necesidades: state.colaboracionNecesidades }
}

const ConsultarColaboracion = connect(mapStateToProps)(ConsultarColaboracionConnected)

export default ConsultarColaboracion;