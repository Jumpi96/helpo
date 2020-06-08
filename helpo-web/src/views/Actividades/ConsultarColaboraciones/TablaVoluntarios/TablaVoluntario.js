import React from 'react'
import FilaParticipacion from './FilaParticipacion'
import PropTypes from 'prop-types'

const tablaPropTypes = {
  funcion: PropTypes.string.isRequired,
  participaciones: PropTypes.array.isRequired,//[ {}, {} ],
} 

const TablaVoluntario = ( props ) => {

  function adaptData( participaciones ) {
    let dataArray = []
    for ( let participacion of participaciones ) {
      const participacionData = {
        //Si comentario o dni son undefined, toman valor "-"
        apellido: participacion.colaborador.apellido,
        nombre: participacion.colaborador.nombre,
        dni: participacion.colaborador.dni ? participacion.colaborador.dni : "-",
        comentario: participacion.comentario ? participacion.comentario : "-",
        idParticipacion: participacion.id,
        participo: participacion.participo,
        retroalimentacion_ong: participacion.retroalimentacion_ong,
        checkedBox: () => {},
        idVoluntario: participacion.colaborador.id,
        cantidad: participacion.cantidad,
        presencias: participacion.presencias
      }
      dataArray.push(participacionData)      
    }    
    return dataArray
  }

  const noParticipaciones = (
    <p style={{ fontSize: '16px' }} className="text-muted text-center"> No hay participaciones para esta función</p>
  )

  const { participaciones, funcion, descripcion } = props
  let Filasparticipacion
  if ( participaciones.length > 0) {
    Filasparticipacion = adaptData(participaciones).map(
      (participacion) => 
        <FilaParticipacion key={ participacion.idParticipacion } {...participacion} submitChanges={props.submitChanges}/> 
      )
  }

  return (
    <div>
      <p className="h4" style={{ marginTop: '20px', marginBottom: '20px' }}>Función - {funcion}</p>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Apellido</th>
            <th scope="col">Nombre</th>
            <th scope="col"></th>
            <th scope="col">Cantidad</th>
            <th scope="col">Presencias</th>
            <th scope="col">Comentario</th>
            <th scope="col">¿Completó su participación?</th>
            <th scope="col">Retroalimentación</th>
          </tr>  
        </thead>
        <tbody>
          {Filasparticipacion}
        </tbody>
      </table>
      {participaciones.length === 0 ? noParticipaciones : ""}
    </div>
  )
}
TablaVoluntario.propTypes = tablaPropTypes

export default TablaVoluntario