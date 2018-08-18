import React from 'react'
import PropTypes from 'prop-types'

const FilaPropTypes = {
  apellido: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  dni: PropTypes.number,
  comentario: PropTypes.string,
  idColaboracion: PropTypes.number.isRequired,
  checkedBox: PropTypes.func,
}

const FilaParticipacion = ( props ) => {
  const { apellido, nombre, dni, comentario, idParticipacion, checkedBox, participo } = props
  return (
    <tr>
      <td>{apellido}</td>
      <td>{nombre}</td>
      <td>{dni ? dni : "-"}</td>
      <td>{comentario ? comentario : "-"}</td>
      <td><input 
            type="checkbox" 
            name={"entregado" + idParticipacion} 
            defaultChecked={participo}
            onChange={() => checkedBox(idParticipacion)}/>
            </td>
    </tr>
  )
}
FilaParticipacion.propTypes = FilaPropTypes

export default FilaParticipacion;