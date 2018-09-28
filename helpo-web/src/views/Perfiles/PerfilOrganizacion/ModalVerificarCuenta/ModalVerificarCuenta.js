import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import api from "../../../../api"

class ModalVerificarCuenta extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
      exito: undefined,
      smsSent: false,
      codigo: undefined,
      verificada: false
    };
    this.handleCodigoChange = this.handleCodigoChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.enviarSms = this.enviarSms.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  enviarSms() {
    var url = "";
    this.setState({
      error: undefined,
      exito: undefined,
    });
    if (this.props.userType === "1") {
      url = `/perfiles/send_sms_organizacion/${this.props.id}/`;
    } else if (this.props.userType === "3") {
      url = `/perfiles/send_sms_empresa/${this.props.id}/`;
    }
    if (url !== "") {
      api.get(url)
        .then(res => {
          if (res.status === 200) {
            this.setState({
              smsSent: true,
              exito: 'SMS enviado.',
            });
          }
        }
        )
        .catch(
          error => {
            if (error.response.status !== 200) {
              this.setState({
                smsSent: false,
                error: 'Hubo un error al enviar su SMS.',
              })
            }
          }
        );
    }
  }

  handleAccept() {
    const verificada = this.state.verificada;
    this.props.onSuccess(verificada);
  }

  handleCancel() {
    const verificada = this.state.verificada;
    this.props.onCancel(verificada);
  }

  handleCodigoChange(event) {
    this.setState({ codigo: event.target.value });
  }

  handleSubmit() {
    this.setState({ exito: undefined });
    if (this.handleValidation()) {
      const token = this.state.codigo.toUpperCase();
      const headers = { 'Content-Type': 'application/json' };
      const body = JSON.stringify({ token });
      api.post('/verify_sms/', body, { headers })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              verificada: true,
              exito: 'Cuenta verificada.',
              error: undefined
            });
          }
        }
        )
        .catch(
          error => {
            if (error.response.status !== 200) {
              this.setState({
                error: 'Código incorrecto',
                exito: undefined
              })
            }
          }
        );
    }
  }

  handleValidation() {
    let formIsValid = true;
    let error = this.state.error;
    const codigo = this.state.codigo;
    if (!codigo || codigo.length === 0 || !codigo.trim()) {
      formIsValid = false;
      error = 'Debe ingresar un código.';
    }
    this.setState({ error });
    return formIsValid;
  }

  render() {
    return (
      <Modal isOpen={true} >
        <ModalHeader>Verifique su cuenta</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12">
              <div>
                <strong>Confirme su n&uacute;mero de tel&eacute;fono</strong>
              </div>
              <div>
                Para que su cuenta sea verificada, debe ingresar el c&oacute;digo que le enviaremos por SMS al siguiente n&uacute;mero.
            </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                <br></br>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                <strong>Tel&eacute;fono: </strong>{this.props.telefono}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div>
                <br></br>
              </div>
            </div>
          </div>
          {this.state.smsSent ?
            <div className="row">
              <div className="col-md-12">
                <div>
                  <strong>C&oacute;digo: </strong>
                </div>
                <div>
                  <input className="form-control" placeholder="Ingrese su código"
                    value={this.state.codigo} onChange={this.handleCodigoChange} />
                  <span style={{ color: "red" }}>{this.state.error}</span>
                  <span style={{ color: "green" }}>{this.state.exito}</span>
                </div>
              </div>
            </div> : undefined
          }
        </ModalBody>
        <ModalFooter>
          {!this.state.smsSent ?
            <Button color="primary" onClick={this.enviarSms}>Enviar SMS</Button> : undefined}
          {(this.state.smsSent && !this.state.verificada) ?
            <Button color="info" onClick={this.handleSubmit}>Verificar cuenta</Button> : undefined}
          {this.state.verificada ?
            <Button color="success" onClick={this.handleAccept}>Aceptar</Button> : undefined}
          {' '}<Button color="secondary" onClick={this.handleCancel}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default ModalVerificarCuenta;