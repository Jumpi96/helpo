import React from 'react'
import TablaColaboracion from './TablaColaboracion'

const TablaColaboraciones = (props) => {
  let tablas = []
  for (var key in props.keys) {
    const colaboraciones = props.keys[key].colaboraciones;
    const necesidad = props.keys[key].recurso.nombre;
    let descripcion = props.keys[key].descripcion;
    descripcion = descripcion.length > 25 ? descripcion.slice(0, 25) + '...' : descripcion;
    tablas.push(
      <TablaColaboracion
        key={key}
        necesidad={necesidad}
        colaboraciones={colaboraciones}
        descripcion={descripcion}
        submitChanges={props.submitChanges}
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