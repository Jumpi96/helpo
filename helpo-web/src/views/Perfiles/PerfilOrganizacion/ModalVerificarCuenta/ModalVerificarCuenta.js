import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

class ModalVerificarCuenta extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: undefined,
      smsSent: false,
      codigo: undefined
    };
    this.handleCodigoChange = this.handleCodigoChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.enviarSms = this.enviarSms.bind(this);
  }

  enviarSms() {
    this.setState({ smsSent: true });
  }

  handleCodigoChange(event) {
    this.setState({ codigo: event.target.value });
  }

  handleSubmit() {
    if (this.handleValidation()) {
      console.log("VERIFICADA");
      this.setState({ error: undefined });
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
    console.log(codigo);
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
                </div>
              </div>
            </div> : undefined
          }
        </ModalBody>
        <ModalFooter>
          {!this.state.smsSent ?
          <Button color="primary" onClick={this.enviarSms}>Enviar SMS</Button>: undefined }
          {this.state.smsSent ?
          <Button color="primary" onClick={this.handleSubmit}>Verificar cuenta</Button>: undefined } 
          {' '}<Button color="secondary" onClick={this.props.onCancel}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default ModalVerificarCuenta;