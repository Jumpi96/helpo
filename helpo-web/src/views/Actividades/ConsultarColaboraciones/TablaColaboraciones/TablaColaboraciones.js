import React from 'react'
import TablaColaboracion from './TablaColaboracion'

const TablaColaboraciones = (props) => {
  let tablas = []
  for (var key in props) {
    const colaboraciones = props[key].colaboraciones
    const necesidad = props[key].recurso.nombre
    let descripcion = props[key].descripcion;
    descripcion = descripcion.length > 25 ? descripcion.slice(0, 25) + '...' : descripcion;
    tablas.push(
      <TablaColaboracion
        key={key}
        necesidad={necesidad}
        colaboraciones={colaboraciones}
        descripcion={descripcion}
      />)
  }

  /*tablas = necesidades.map( nec =>
     <TablaColaboracion 
     necesidad={ necesidades.recurso.nombre } 
     colaboraciones={ necesidades.colaboraciones } 
     /> 
    )*/


  return (
    <div>
      {tablas}
    </div>
  )
}
export default TablaColaboraciones;