import React, { Component } from 'react';
import { Table, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ModalPropuesta extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  getTablaPropuesta() {
    const { evento, propuesta } = this.props;
    const listaNecesidades = [];
    let cantidad;
    evento.necesidades.forEach(n => {
      cantidad = this.getCantidadNecesidades(n);
      if (cantidad > 0) {
        listaNecesidades.push(
          <tr>
            <td>{n.recurso.categoria.nombre}</td>
            <td>{n.recurso.nombre}</td>
            <td>{cantidad}</td>
            <td>{n.descripcion}</td>
          </tr>
        );
      }
    });
    const listaVoluntarios = [];
    evento.voluntarios.forEach(v => {
      cantidad = this.getCantidadVoluntarios(v);
      if (cantidad > 0) {
        listaVoluntarios.push(
          <tr>
            <td>Voluntario</td>
            <td>{v.funcion.nombre}</td>
            <td>{cantidad}</td>
            <td>{v.descripcion}</td>
          </tr>
        );
      }
    })
    if (listaNecesidades.length + listaVoluntarios.length > 0) {
      return (
        <Table responsive striped>
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>Cantidad</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {listaNecesidades}
            {listaVoluntarios}
          </tbody>
        </Table>
      )
    }
  }

  getCantidadNecesidades(n) {
    let contador = 0;
    let userId = this.props.propuesta.empresa.id;
    n.colaboraciones.forEach((c) => {
      if (c.colaborador.id === userId) {
        contador += c.cantidad;
      };
    });
    return contador;
  }

  getCantidadVoluntarios(v) {
    let contador = 0;
    let userId = this.props.propuesta.empresa.id;
    v.participaciones.forEach((c) => {
      if (c.colaborador.id === userId) {
        contador += c.cantidad;
      };
    });
    return contador;
  }

  render() {
    const { propuesta } = this.props;
    if (propuesta) {
      return (
        <div className="animated fadeIn">
          <Modal isOpen={this.props.propuesta}
            className='modal-warning'
            size='lg'
          >
            <ModalHeader>Administrar propuesta de {propuesta.empresa.nombre}</ModalHeader>
            <ModalBody>
            <p>Una vez aceptada la propuesta, <b>la empresa aparecerá como patrocinadora del evento.</b> La respuesta no es modificable.</p>
              {this.getTablaPropuesta()}
              <textarea
                className="form-control"
                value={this.props.comentario}
                onChange={this.props.handleComentario}
                placeholder="Debes completar una respuesta privada para rechazar la propuesta."
                rows="3" hidden={!this.props.confirmRechazo}
              />
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-success" onClick={() => this.props.closeModal(1)}>Aceptar</button>
              <button className="btn btn-danger" onClick={() => this.props.closeModal(-1)}>Rechazar</button>
              <button className="btn" onClick={() => this.props.closeModal(0)}>Cancelar</button>
            </ModalFooter>
          </Modal>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default ModalPropuesta;
