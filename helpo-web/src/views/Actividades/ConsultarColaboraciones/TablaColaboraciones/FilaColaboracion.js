import React from 'react'
import PropTypes from 'prop-types'
import * as actions from '../../../../actions/consultarColaboracionesActions'
import moment from 'moment';
import BotonHelpo from '../../../common/BotonHelpo/BotonHelpo';
import api from '../../../../api';
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
  idVoluntario: PropTypes.number.isRequired,
  evento: PropTypes.object,
  retroalimentacion_ong: PropTypes.bool,
}

const FilaColaboracionConnected = ( props ) => {
  const { apellido, nombre, cantidad, comentario, idColaboracion, handleCheckboxChange, entregados, idVoluntario, retroalimentacion_ong, evento } = props  

  const perfilButton = (
    <Link to={`/perfil/${idVoluntario}`}>
      <Button color='secondary'>Ir a Perfil</Button>
    </Link>
  )

  const handleRetroalimentacion = () => {
    const mensaje = { evento: evento.id, voluntario: idVoluntario, es_colaboracion: true };
    api.post('feedbacks/retroalimentacion_ong/', mensaje)
      .then((res) => {
        props.submitChanges();
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  };

  const getBotonRetroalimentacion = () => {    
    if (moment(evento.fecha_hora_inicio) > moment()) {
      return (
        <BotonHelpo
          disabled={true}
          mensaje={'Actividad social no iniciada.'}
          titulo={'Dar una mano'}
          onClick={undefined}
        />
      );
    } else if (retroalimentacion_ong) {
      return (
        <BotonHelpo
          disabled={true}
          mensaje={'Ya diste una mano al colaborador por su participación.'}
          titulo={'Dar una mano'}
          onClick={undefined}
        />
      );
    } else {
      return (
        <BotonHelpo
          disabled={false}
          mensaje={'Da una mano al colaborador por su participación.'}
          titulo={'Dar una mano'}
          onClick={handleRetroalimentacion}
        />
      );
    }
  }

  return (
    <tr>
      <td>{apellido}</td>
      <td>{nombre}</td>
      <td>{perfilButton}</td>
      <td>{cantidad}</td>
      <td>{entregados}</td>
      <td>{comentario ? comentario : "-"}</td>
      <td><input 
            type="checkbox" 
            name={"entregado" + idColaboracion}              
            defaultChecked={entregados === cantidad}
            onChange={(event) => handleCheckboxChange(event.target.checked, idColaboracion)}/>
            </td>
      <td>
        {getBotonRetroalimentacion()}
      </td>
    </tr>
  )
}
FilaColaboracionConnected.propTypes = FilaPropTypes

const mapDispatchToProps = dispatch => ({
  fetchData: eventoId => { dispatch(actions.fetchDetalleColaboraciones(eventoId)) },
  handleCheckboxChange: (value, colaboracionId) => { dispatch(actions.consultarColaboracionesChangeColaboracion(value, colaboracionId)) }
})
const mapStateToProps = state => {
  return { 
    evento: state.consultarColaboraciones.consultarColaboracionesData,
  }
}
const FilaColaboracion = connect( mapStateToProps, mapDispatchToProps)(FilaColaboracionConnected)


export default FilaColaboracion;