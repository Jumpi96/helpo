import React from 'react'
import { Row, Col } from 'reactstrap'

const boxStyle = {
  border: '3px solid',
  borderColor: '#F39200',
  borderRadius: '5px',
  backgroundColor: '#ffd9a0',
  marginBottom: 0,
}

class PanelRecomendacion extends React.Component {
  /*
  Panel de recomendaciones en PlanificadorEvento

  props:
    recomendaciones: {enero: 0.2341, febrero: 0.2333,...}
  */
  compareRecomendaciones(a, b) {
    /*
    Compares two recomendacion objects a,b ({mes: "enero", valor: 0.4543},)
    and returns:
       1 if a.valor < b.valor
      -1 if a.valor > b.valor
       0 if a.valor == b.valor
    */
    if (a.valor > b.valor) { return -1 }
    if (a.valor < b.valor) { return 1 }
    return 0
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  sortData(recomendaciones) {
    /*
    Returns an array with the recomendaciones sorted from higher to lower
    :returns [{mes: 'enero', valor: 0.5446},...]
    */
    let array_recomendaciones = []

    // Fill array with recomendaicones objects
    for (const mes in recomendaciones) {
      const recomendacion_obj = {
        mes: this.capitalizeFirstLetter(mes),
        valor: recomendaciones[mes]
      }
      array_recomendaciones.push(recomendacion_obj)
    }
    // Sort array (desc)
    array_recomendaciones.sort(this.compareRecomendaciones)

    return array_recomendaciones
  }

  changeToPorcentaje(valor) {
    //Transforms decimal proportion number to porcentaje string
    const multiplied = valor * 100
    const numero_entero = multiplied.toFixed(0)
    return `${numero_entero}%`
  }

  renderRecomendaciones = () => {
    // Checks for undefined props
    // Assignment to shorten name
    const obj_recom = this.props.recomendaciones
    if(!obj_recom || (Object.keys(obj_recom).length === 0 && obj_recom.constructor === Object)) {
      return <p className="text-muted text-center">Aún no ha planificado una actividad</p>
    }
    // Process and sort recomendaciones
    //let recomendaciones = this.sortData(this.props.recomendaciones)
    let recomendaciones = this.sortData(this.props.recomendaciones)

    // Removes the first (best) recomendacion
    const best = recomendaciones.shift()
    const render_best = (
      <div style={boxStyle}>        
        <p style={{
          fontSize: 14,
          display: 'inline-block',
          padding: 10,
        }}>
          En base a las especifiaciones de su evento, Helpo le recomienda realizarlo en <span style={{fontWeight: 'bold'}}>{best.mes}</span>, habiendo obtenido dicho mes un puntaje del <span style={{fontWeight: 'bold'}}>{this.changeToPorcentaje(best.valor)}</span>
        </p>
      </div>
    )    

    const otras_recomendaciones = recomendaciones.map(recomendacion => (
      <Row>
        <Col>
          <p style={{ marginBottom: 3 }}>{recomendacion.mes}:</p>
        </Col>
        <Col>
          <p style={{ marginBottom: 3 }}>{this.changeToPorcentaje(recomendacion.valor)}</p>
        </Col>
      </Row>
    ))

    return (
      <div className='text-center' style={{ marginLeft: 10, marginRight: 10 }}>
        {render_best}
        <p style={{ marginTop: 8 }}>Resto de los meses:</p>
        {otras_recomendaciones}
      </div>
    )
  }


  render() {
    return (
      <div style={{
        border: '2px solid',
        borderColor: '#d7d7d7',
        borderRadius: '5px'
      }}>
        <p style={{
          fontWeight: 'bold',
          fontSize: 14,
          display: 'block',
          backgroundColor: '#d7d7d7',
          padding: 10
        }}>
          Recomendación
        </p>
        {this.renderRecomendaciones()}
      </div>
    )
  }
}

export default PanelRecomendacion