import React from 'react'
import PropTypes from 'prop-types'

const FilaPropTypes = {
  apellido: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  dni: PropTypes.number,
  cantidad: PropTypes.number.isRequired,
  comentario: PropTypes.string,
  idColaboracion: PropTypes.number.isRequired,
  checkedBox: PropTypes.func,
}

const FilaColaboracion = (apellido, nombre, dni = "-", cantidad, comentario = "-", idColaboracion, checkedBox) => {
  return (
    <tr>
      <td>{apellido}</td>
      <td>{nombre}</td>
      <td>{dni}</td>
      <td>{cantidad}</td>
      <td>{comentario}</td>
      <td><input 
            type="checkbox" 
            name={"entregado" + idColaboracion} 
            value={idColaboracion} 
            onChange={() => checkedBox(idColaboracion)}/>
            </td>
    </tr>
  )
}
FilaColaboracion.PropTypes = FilaPropTypes

export default FilaColaboracion;