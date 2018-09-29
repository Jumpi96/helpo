import React from 'react'
import { Card, CardHeader, CardBody } from 'reactstrap'
import { Line } from 'react-chartjs-2'
import { connect } from 'react-redux'

/*
Props:
  ong (id - viene de redux)
*/

class DashboardReportes extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      total_suscripciones: -1,
      total_manos: -1,
      total_eventos: -1,
      total_voluntarios: -1,
      grafico_suscripciones: {
        labels: [],
        data: []
      }      
    }
  }

  componentDidMount() {

  }

  render() {    

    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    };

    return (
      <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Reportes
          </CardHeader>
          <CardBody style={{ display: 'flex', flexWrap: 'wrap' }}>
            
          </CardBody>
        </Card>
    )
  }
}

const mapStateToProps = state => ({
  ong: state.auth.user.id
})

export default connect(mapStateToProps)(DashboardReportes)