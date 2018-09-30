import React from 'react'
import { Card, CardHeader, CardBody } from 'reactstrap'
import { Line, Doughnut, Bar } from 'react-chartjs-2'
import { connect } from 'react-redux'
import { Tooltip } from 'reactstrap'
import api from '../../api'

/*
Props:
  ong (id - viene de redux)
*/

class DashboardReportes extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      total_suscripciones: null,
      total_manos: null,
      total_eventos: null,
      total_voluntarios: null,
      grafico_suscripciones: {
        labels: [],
        data: []
      },
      grafico_generos: {
        data: [],
        total: -1
      },
      grafico_evento: {
        data_colaboraciones: [],
        data_participaciones: [],
        data_manos: [],
        labels: [],
      },
      grafico_empresas: {
        data: [],
        labels: []
      },
      tooltipOpen: false
    }
    this.toggle = this.toggle.bind(this) 
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  componentDidMount() {
    // Busco estadisticas generales
    // --------------------------------
    api.get(`/reportes/organizacion/${this.props.ong}/`)
      .then(response => {
        const data = response.data

        this.setState({
          total_suscripciones: data.total_suscripciones,
          total_manos: data.total_manos,
          total_eventos: data.total_eventos,
          total_voluntarios: data.total_voluntarios,
        })
      })
      .catch(error => {
        // TODO: Handle errors gracefully
      })

    // Busco datos de suscripciones
    // --------------------------------
    api.get(`/reportes/organizacion/suscripciones/${this.props.ong}/`)
      .then(response => {
        const grafico_data = {
          labels: response.data.data_month.reverse(),
          data: response.data.data.reverse()
        }

        this.setState({
          grafico_suscripciones: grafico_data
        })
      })
      .catch(error => {
        // TODO: Handle errors gracefully
      })
      
      //Busco datos de generos
      // --------------------------------
      api.get(`/reportes/organizacion/genero/${this.props.ong}/`)
      .then(response => {

        const data = response.data
        const grafico_data = {
          data: [data.hombres, data.mujeres, data.otros, data.nada],
          total: data.total
        }

        this.setState({
          grafico_generos: grafico_data
        })
      })
      .catch(error => {
        // TODO: Handle errors gracefully
      })

      //Busco datos de evento
      // --------------------------------
      api.get(`/reportes/organizacion/eventos/${this.props.ong}/`)
      .then(response => {

        const data = response.data
        const grafico_data = {
          data_colaboraciones: data.colaboraciones,
          data_participaciones: data.participaciones,
          data_manos: data.manos,
          labels: data.eventos
        }

        this.setState({
          grafico_evento: grafico_data
        })
      })
      .catch(error => {
        // TODO: Handle errors gracefully
      })

      //Busco datos de empresas
      // --------------------------------
      api.get(`/reportes/organizacion/empresas/${this.props.ong}/`)
      .then(response => {

        const data = response.data
        const grafico_data = {
          data: data.propuestas,
          labels: data.empresas
        }

        this.setState({
          grafico_empresas: grafico_data
        })
      })
      .catch(error => {
        // TODO: Handle errors gracefully
      })
  }

  render() {

    const generos_data = {      
      datasets: [{
        data: this.state.grafico_generos.data,
        backgroundColor: [
          'rgba(231, 54, 54, 0.9)',
          'rgba(54, 142, 231, 0.9)',
          'rgba(54, 231, 54, 0.9)',
          'rgba(231, 231, 54, 0.9)',
        ]
      }],
      labels: ['hombres', 'mujeres', 'otros', 'no registrado'],
    }

    const manos_data = {
      datasets: [{
        label: 'Manos recibidas por evento',
        backgroundColor: 'rgba(255, 255, 147, 0.2)',
        borderColor: 'rgba(178, 178, 0, 0.99)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 255, 147, 0.4)',
        hoverBorderColor: 'rgba(178, 178, 0, 0.99)',
        barPercentage: 0.6,
        data: this.state.grafico_evento.data_manos
      }],
      labels: this.state.grafico_evento.labels,
    }

    const colaboraciones_data = {
      datasets: [{
        label: 'Colaboraciones recibidas por evento',
        backgroundColor: 'rgba(255, 181, 107, 0.2)',
        borderColor: 'rgba(234, 117, 0, 0.99)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 181, 107, 0.4)',
        hoverBorderColor: 'rgba(234, 117, 0, 0.99)',
        barPercentage: 0.6,
        data: this.state.grafico_evento.data_colaboraciones
      }],
      labels: this.state.grafico_evento.labels,
    }

    const participaciones_data = {
      datasets: [{
        label: 'Participaciones recibidas por evento',
        backgroundColor: 'rgba(153, 204, 255, 0.2)',
        borderColor: 'rgba(0, 94, 188, 0.99)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(153, 204, 255, 0.4)',
        hoverBorderColor: 'rgba(0, 94, 188, 0.99)',
        barPercentage: 0.6,
        data: this.state.grafico_evento.data_participaciones
      }],
      labels: this.state.grafico_evento.labels,
    }

    const empresas_data = {
      datasets: [{
        label: 'Propuestas aceptadas de empresas',
        backgroundColor: 'rgba(255, 61, 255, 0.2)',
        borderColor: 'rgba(127, 0, 127, 0.99)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 61, 255, 0.4)',
        hoverBorderColor: 'rgba(127, 0, 127, 0.99)',
        barPercentage: 0.6,
        data: this.state.grafico_empresas.data
      }],
      labels: this.state.grafico_empresas.labels,
    }

    const suscripciones_data = {
      labels: this.state.grafico_suscripciones.labels,
      datasets: [
        {
          label: 'Total de suscripciones',
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
          data: this.state.grafico_suscripciones.data
        }
      ]
    };

    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"></i> Estadísticas
          </CardHeader>
        <CardBody style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ boxSizing: 'border-box' }}>

            <div className='row'>
              <div className='col'>
                <p style={{fontWeight: 'bold', fontSize: 14}}>Total de suscriptores: {this.state.total_suscripciones}</p>
              </div>
              <div className='col'>
                <p style={{fontWeight: 'bold', fontSize: 14}}>Total de manos recibidas: {this.state.total_manos}</p>
              </div>
            </div>

            <div className='row'>
              <div className='col'>
                <p  style={{fontWeight: 'bold', fontSize: 14}}>Total de eventos realizados: {this.state.total_eventos}</p>
              </div>
              <div className='col'>
                <p href="#" id="TooltipExample" style={{fontWeight: 'bold', fontSize: 14}}>Total de voluntarios participantes: {this.state.total_voluntarios}</p>
                <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="TooltipExample" toggle={this.toggle}>
                  Cantidad de voluntarios unicos que participaron alguna vez en un evento
                </Tooltip>
              </div>
            </div>

          </div>
          {/*Bootstrap muere a partir de aca */}
          <div style={{ alignItems: 'center' }}>
          <div style={{
            height: 5,
            width: '100%',
            borderBottom: "1px solid gray",
            marginBottom: 30
          }} />

            {/* Suscripciones por mes */}
            <div style={{display: 'flex', alignItems:'center', justifyContent: 'center', width: '100%', marginTop: 40}}>
              <p style={{fontWeight: 'bold', fontSize: 14}}>Suscripciones por mes</p>
            </div>
            <div style={{ marginVertical: 10 }}>          
            <Line
                data={suscripciones_data}
                height={300}
                width={600}
                options={{
                  maintainAspectRatio: false
                }}
              />
            </div>
            
            {/* Demografica por genero */}
            <div style={{display: 'flex', alignItems:'center', justifyContent: 'center', width: '100%', marginTop: 40}}>
              <p style={{fontWeight: 'bold', fontSize: 14}}>Demográfica de voluntarios participantes</p>
            </div>
            <div style={{ marginVertical: 10 }}>
              <Doughnut
                data={generos_data}
                height={300}
                width={600}
                options={{
                  maintainAspectRatio: false
                }}
              />
            </div>
            
            {/* Manos por evento */}
            <div style={{display: 'flex', alignItems:'center', justifyContent: 'center', width: '100%', marginTop: 40}}>
              <p style={{fontWeight: 'bold', fontSize: 14}}>Manos recibidas por evento</p>
            </div>
            <div style={{ marginVertical: 10 }}>
              <Bar
                data={manos_data}
                height={300}
                width={600}
                options={{
                  maintainAspectRatio: false
                }}
              />
            </div>
            
            {/* Colaboraciones por evento */}
            <div style={{display: 'flex', alignItems:'center', justifyContent: 'center', width: '100%', marginTop: 40}}>
              <p style={{fontWeight: 'bold', fontSize: 14}}>Colaboraciones por evento</p>
            </div>
            <div style={{ marginVertical: 10 }}>
              <Bar
                data={colaboraciones_data}
                height={300}
                width={600}
                options={{
                  maintainAspectRatio: false
                }}
              />
            </div>

            {/* Participaciones por evento */}
            <div style={{display: 'flex', alignItems:'center', justifyContent: 'center', width: '100%', marginTop: 40}}>
              <p style={{fontWeight: 'bold', fontSize: 14}}>Participaciones por evento</p>
            </div>
            <div style={{ marginVertical: 10 }}>
              <Bar
                data={participaciones_data}
                height={300}
                width={600}
                options={{
                  maintainAspectRatio: false
                }}
              />
            </div>

            {/* Empresas mas colaboradoras */}
            <div style={{display: 'flex', alignItems:'center', justifyContent: 'center', width: '100%', marginTop: 40}}>
              <p style={{fontWeight: 'bold', fontSize: 14}}>Empresas mas contribuidoras</p>
            </div>
            <div style={{ marginVertical: 10 }}>
              <Bar
                data={empresas_data}
                height={300}
                width={600}
                options={{
                  maintainAspectRatio: false
                }}
              />
            </div>

          </div>
        </CardBody>
      </Card>
    )
  }
}

const mapStateToProps = state => ({
  ong: state.auth.user.id
})

export default connect(mapStateToProps)(DashboardReportes)