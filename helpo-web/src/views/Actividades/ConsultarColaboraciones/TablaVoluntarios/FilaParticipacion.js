import React from 'react'
import PropTypes from 'prop-types'
import * as actions from '../../../../actions/consultarColaboracionesActions'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import moment from 'moment';
import BotonHelpo from '../../../common/BotonHelpo/BotonHelpo';
import api from '../../../../api';

const FilaPropTypes = {
  apellido: PropTypes.string.isRequired,
  nombre: PropTypes.string.isRequired,
  dni: PropTypes.number,
  comentario: PropTypes.string,
  idParticipacion: PropTypes.number.isRequired,
  checkedBox: PropTypes.func,
  idVoluntario: PropTypes.number.isRequired,
  evento: PropTypes.object,
  retroalimentacion_ong: PropTypes.bool,
}

const FilaParticipacionConnected = ( props ) => {
  const { apellido, nombre, comentario, idParticipacion, handleCheckboxChange, cantidad, presencias, idVoluntario, retroalimentacion_ong, evento } = props

  const perfilButton = (
    <Link to={`/perfil/${idVoluntario}`}>
      <Button color='secondary'>Ir a Perfil</Button>
    </Link>
  )

  const getBotonRetroalimentacion = () => {
    if (moment(evento.fecha_hora_inicio) > moment()) {
      return (
        <BotonHelpo
          disabled={true}
          mensaje={'Evento no iniciado.'}
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

  const handleRetroalimentacion = () => {
    const mensaje = { evento: evento.id, voluntario: idVoluntario, es_colaboracion: false };
    api.post('feedbacks/retroalimentacion_ong/', mensaje)
      .then((res) => {
        props.fetchData(evento.id);
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  };

  return (
    <tr>
      <td>{apellido}</td>
      <td>{nombre}</td>
      <td>{perfilButton}</td>
      <td>{cantidad}</td>
      <td>{presencias}</td>
      <td>{comentario ? comentario : "-"}</td>
      <td><input 
            type="checkbox" 
            name={"entregado" + idParticipacion} 
            defaultChecked={presencias===cantidad}
            onChange={(event) => handleCheckboxChange(event.target.checked, idParticipacion)}/>
            </td>
      <td>
        {getBotonRetroalimentacion()}
      </td>
    </tr>
  )
}
FilaParticipacionConnected.propTypes = FilaPropTypes

const mapDispatchToProps = dispatch => ({
  fetchData: eventoId => { dispatch(actions.fetchDetalleColaboraciones(eventoId)) },
  handleCheckboxChange: (value, idParticipacion) => { dispatch(actions.consultarColaboracionesChangeParticipacion(value, idParticipacion)) }
})

const mapStateToProps = state => {
  return { 
    evento: state.consultarColaboraciones.consultarColaboracionesData,
  }
}
const FilaParticipacion = connect( mapStateToProps, mapDispatchToProps)(FilaParticipacionConnected)

export default FilaParticipacion;