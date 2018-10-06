import React from 'react'
import TablaVoluntario from './TablaVoluntario'

const TablaVoluntarios = ( props ) => {
  let tablas = []
    for ( var key in props ) {
        const participaciones = props[key].participaciones 
        const funcion = props[key].funcion.nombre
        let descripcion = props[key].descripcion;
        descripcion = descripcion.length > 25 ? descripcion.slice(0, 25) + '...' : descripcion;
       tablas.push(
        <TablaVoluntario 
        key={ key }
        funcion={ funcion } 
        participaciones={ participaciones } 
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
      { tablas }
    </div>
  )
}
export default TablaVoluntarios;