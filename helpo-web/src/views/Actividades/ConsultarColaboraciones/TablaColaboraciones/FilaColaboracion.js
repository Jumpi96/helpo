import React from 'react'
import PropTypes from 'prop-types'
import * as actions from '../../../../actions/consultarColaboracionesActions'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'

const FilaPropTypes = {
  apellido: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  dni: PropTypes.number,
  cantidad: PropTypes.number.isRequired,
  comentario: PropTypes.string,
  idColaboracion: PropTypes.number.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  idVoluntario: PropTypes.number.isRequired
}

const FilaColaboracionConnected = ( props ) => {
  const { apellido, nombre, dni, cantidad, comentario, idColaboracion, handleCheckboxChange, entregado,idVoluntario } = props  

  const perfilButton = (
    <Link to={`/perfil/${idVoluntario}`}>
      <Button color='secondary'>Ir a Perfil</Button>
    </Link>
  )

  return (
    <tr>
      <td>{apellido}</td>
      <td>{nombre}</td>
      <td>{perfilButton}</td>
      <td>{cantidad}</td>
      <td>{comentario ? comentario : "-"}</td>
      <td><input 
            type="checkbox" 
            name={"entregado" + idColaboracion}              
            defaultChecked={entregado}
            onChange={(event) => handleCheckboxChange(event.target.checked, idColaboracion)}/>
            </td>
    </tr>
  )
}
FilaColaboracionConnected.propTypes = FilaPropTypes

const mapDispatchToProps = dispatch => ({
  handleCheckboxChange: (value, colaboracionId) => { dispatch(actions.consultarColaboracionesChangeColaboracion(value, colaboracionId)) }
})
const FilaColaboracion = connect( null, mapDispatchToProps)(FilaColaboracionConnected)


export default FilaColaboracion;