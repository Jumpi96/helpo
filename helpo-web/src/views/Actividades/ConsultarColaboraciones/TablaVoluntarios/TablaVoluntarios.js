import React from 'react'
import TablaVoluntario from './TablaVoluntario'

const TablaVoluntarios = ( props ) => {
  let tablas = []
    for ( var key in props ) {
        const participaciones = props[key].participaciones 
        const funcion = props[key].funcion.nombre
       tablas.push(
        <TablaVoluntario 
        key={ key }
        funcion={ funcion } 
        participaciones={ participaciones } 
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