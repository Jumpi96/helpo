import React from 'react'
import PropTypes from 'prop-types'
import TablaColaboracion from './TablaColaboracion'

const tablaPropTypes = {
  necesidades: PropTypes.arrayOf(PropTypes.shape({
      necesidad: PropTypes.string,
      colaboraciones: PropTypes.arrayOf(PropTypes.shape({
        apellido: PropTypes.string,
        nombre: PropTypes.string,
        dni: PropTypes.number,
        cantidad: PropTypes.number,
        comentario: PropTypes.string,
        checkedBox: PropTypes.func,
      })),
    })
  ).isRequired
}

const TablaColaboraciones = (necesidades) => {
  
  let tablas
  if ( necesidades.length > 0) {
    tablas = necesidades.map( nec =>
       <TablaColaboracion 
       necesidad={ necesidades.necesidad } 
       colaboraciones={ necesidades.colaboraciones } 
       /> 
      )
  }
  
  return (
    <div>
      { tablas }
    </div>
  )
}

TablaColaboraciones.PropTypes = tablaPropTypes

export default TablaColaboraciones;