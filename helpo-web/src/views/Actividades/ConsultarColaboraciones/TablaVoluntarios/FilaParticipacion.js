import React from 'react'
import PropTypes from 'prop-types'
import * as actions from '../../../../actions/consultarColaboracionesActions'
import { connect } from 'react-redux'

const FilaPropTypes = {
  apellido: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  dni: PropTypes.number,
  comentario: PropTypes.string,
  idColaboracion: PropTypes.number.isRequired,
  checkedBox: PropTypes.func,
}

const FilaParticipacionConnected = ( props ) => {
  const { apellido, nombre, dni, comentario, idParticipacion, handleCheckboxChange, participo } = props
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
            onChange={(event) => handleCheckboxChange(event.target.checked, idParticipacion)}/>
            </td>
    </tr>
  )
}
FilaParticipacionConnected.propTypes = FilaPropTypes

const mapDispatchToProps = dispatch => ({
  handleCheckboxChange: (value, idParticipacion) => { dispatch(actions.consultarColaboracionesChangeParticipacion(value, idParticipacion)) }
})
const FilaParticipacion = connect( null, mapDispatchToProps)(FilaParticipacionConnected)

export default FilaParticipacion;