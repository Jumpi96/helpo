import React from 'react'

const testData = {
  enero: 0.1234,
  febrero: 0.5354,
  marzo: 0.3353,
  abril: 0.4365,
  mayo: 0.3354,
  junio: 0.3425,
  julio: 0.1245,
  agosto: 0.9845,
  septiembre: 0.3562,
  octubre: 0.5643,
  noviembre: 0.5356,
  diciembre: 0.5463
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
    /*if(!this.props.recomendaciones) {
      return <p className="text-muted text-center">No se calculo ninguna recomendación aun</p>
    }*/
    // Process and sort recomendaciones
    //let recomendaciones = this.sortData(this.props.recomendaciones)
    let recomendaciones = this.sortData(testData)

    // Removes the first (best) recomendacion
    const best = recomendaciones.shift()
    const render_best = (
      <div>
        <p style={{ marginBottom: 4, fontSize: 14 }}>Mes recomendado: </p>
        <p style={{
          fontSize: 16,
          display: 'inline-block',
          fontWeight: 'bold',
          backgroundColor: 'lightgreen',
          padding: 10,
        }}>
          {best.mes}:  {this.changeToPorcentaje(best.valor)}
        </p>
      </div>
    )

    const otras_recomendaciones = recomendaciones.map(recomendacion => (
      <p style={{ marginBottom: 3 }}>
        {recomendacion.mes}:  {this.changeToPorcentaje(recomendacion.valor)}
      </p>
    ))

    return (
      <div style={{ marginLeft: 10 }}>
        {render_best}
        <p>Resto de los meses:</p>
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