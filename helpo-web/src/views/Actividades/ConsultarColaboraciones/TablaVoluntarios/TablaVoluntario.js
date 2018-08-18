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
        apellido: participacion.voluntario.apellido,
        nombre: participacion.voluntario.nombre,
        dni: participacion.voluntario.dni ? participacion.voluntario.dni : "-",
        comentario: participacion.comentario ? participacion.comentario : "-",
        idParticipacion: participacion.id,
        participo: participacion.participo,
        checkedBox: () => {}
      }
      dataArray.push(participacionData)      
    }    
    return dataArray
  }

  const noParticipaciones = (
    <p style={{ fontSize: '16px' }} className="text-muted text-center"> No hay participaciones para esta funcion</p>
  )

  const { participaciones, funcion } = props
  let Filasparticipacion
  if ( participaciones.length > 0) {
    Filasparticipacion = adaptData(participaciones).map( (participacion) => <FilaParticipacion key={ participacion.idparticipacion } {...participacion}/> )
  }

  return (
    <div>
      <p className="h4" style={{ marginTop: '20px', marginBottom: '20px' }}>Funcion - {funcion}</p>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Apellido</th>
            <th scope="col">Nombre</th>
            <th scope="col">DNI</th>
            <th scope="col">Comentario</th>
            <th scope="col">Participó</th>
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