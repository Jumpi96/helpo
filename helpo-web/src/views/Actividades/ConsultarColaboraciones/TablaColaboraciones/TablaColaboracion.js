import React from 'react'
import FilaColaboracion from './FilaColaboracion'
import PropTypes from 'prop-types'

const tablaPropTypes = {
  necesidad: PropTypes.string.isRequired,
  colaboraciones: PropTypes.array.isRequired,//[ {}, {} ],
} 

const TablaColaboracion = ( props ) => {

  function adaptData( colaboraciones ) {
    let dataArray = []
    for ( let colaboracion of colaboraciones ) {
      const colaboracionData = {
        //Si comentario o dni son undefined, toman valor "-"
        apellido: colaboracion.voluntario.apellido,
        nombre: colaboracion.voluntario.nombre,
        dni: colaboracion.voluntario.dni ? colaboracion.voluntario.dni : "-",
        cantidad: colaboracion.cantidad,
        comentario: colaboracion.comentario ? colaboracion.comentario : "-",
        idColaboracion: colaboracion.id,
        retroalimentacion_ong: colaboracion.retroalimentacion_ong,
        checkedBox: () => {},
        entregado: colaboracion.entregado,
        idVoluntario: colaboracion.voluntario.id
      }
      dataArray.push(colaboracionData)      
    }    
    return dataArray
  }

  const noColaboraciones = (
    <p style={{ fontSize: '16px' }} className="text-muted text-center"> No hay colaboraciones para este recurso</p>
  )

  const { colaboraciones, necesidad } = props
  let FilasColaboracion
  if ( colaboraciones.length > 0) {
    FilasColaboracion = adaptData(colaboraciones).map( (colaboracion) => <FilaColaboracion key={ colaboracion.idColaboracion } {...colaboracion}/> )
  }

  return (
    <div>
      <p className="h4" style={{ marginTop: '20px', marginBottom: '20px' }}>Recurso - {necesidad}</p>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Apellido</th>
            <th scope="col">Nombre</th>
            <th scope="col"></th>
            <th scope="col">Cantidad</th>
            <th scope="col">Comentario</th>
            <th scope="col">Entregado</th>
            <th scope="col">Retroalimentación</th>
          </tr>  
        </thead>
        <tbody>
          {FilasColaboracion}
        </tbody>
      </table>
        {colaboraciones.length === 0 ? noColaboraciones : ""}
    </div>
  )
}
TablaColaboracion.propTypes = tablaPropTypes

export default TablaColaboracion