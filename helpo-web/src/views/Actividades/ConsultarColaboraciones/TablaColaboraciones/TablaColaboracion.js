import React from 'react'
import FilaColaboracion from './FilaColaboracion'
import PropTypes from 'prop-types'

const tablaPropTypes = {
  necesidad: PropTypes.string.isRequired,
  colaboraciones: PropTypes.array.isRequired,
} 

const TablaColaboracion = (colaboraciones, necesidad) => {
  let FilasColaboracion
  if ( colaboraciones.length > 0) {
    FilasColaboracion = colaboraciones.map( (colaboracion) => <FilaColaboracion {...colaboracion}/> )
  }

  return (
    <div>
      <p>{necesidad}</p>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Apellido</th>
            <th scope="col">Nombre</th>
            <th scope="col">DNI</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Comentario</th>
            <th scope="col">Entregado</th>
          </tr>  
        </thead>
        <tbody>
          {FilasColaboracion}
        </tbody>
      </table>
    </div>
  )
}
TablaColaboracion.PropTypes = tablaPropTypes

export default TablaColaboracion