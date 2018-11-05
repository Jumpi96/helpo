import React from 'react';
import moment from 'moment';
import { PropTypes } from 'prop-types';
import Widget02 from '../../Widgets/Widget02';
import { Label, Input } from 'reactstrap'

class EventoList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      verPasados: false
    }
  }

  handleChangeVerPasados = () => {
    const verPasados = this.state.verPasados
    this.setState({ verPasados: !verPasados })
  }

  filterActPasadas(eventos) {
    // Saca eventos en estado Finalizado
    return eventos.filter(evento => evento.estado < 3)
  }

  verEventosPasados = () => {
    return (
      <Label style={{
        fontSize: 14,
        marginTop: 15,
        marginLeft: 5,
        marginBottom: 15
      }} check>
        ¿Ver propuestas pasadas?
        <Input onChange={this.handleChangeVerPasados} style={{ marginLeft: 8 }} type="checkbox" />
      </Label>
    )
  }

  sortEventos(eventos) {
    return eventos.sort(function (a, b) {
      var keyA = new Date(a.fecha_hora_inicio),
        keyB = new Date(b.fecha_hora_inicio);
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    });
  }

  render() {
    let eventos = this.sortEventos(this.props.eventos);

    if (!this.state.verPasados) { eventos = this.filterActPasadas(eventos) }

    return (
      <ul className="list-group">

        {this.verEventosPasados()}

        {eventos.map(evento =>
          <Widget02
            header={moment(evento.fecha_hora_inicio).format('DD/MM/YYYY')}
            key={evento.id} footer
            mainText={evento.nombre}
            icon={evento.campaña ? "fa fa-calendar-plus-o" : "fa fa-hand-stop-o"}
            color="primary"
            link={'/actividades/mis-propuestas/' + evento.id}
          />
        )}
      </ul>
    );
  }

};

EventoList.propTypes = {
  eventos: PropTypes.array.isRequired
};

export default EventoList;  