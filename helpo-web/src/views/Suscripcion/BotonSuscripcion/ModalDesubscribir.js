import React from 'react'
import { Modal, ModalFooter, ModalBody, Button } from 'reactstrap'

/*
Modal para confirmar desuscripcion

Props:
  open
  toggle
  deleteSuscripcion
*/

class ModalDesubscribir extends React.Component {

  render() {
    return (
      <Modal
        isOpen={this.props.open}
        toggle={this.props.toggle}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ModalBody
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p 
            style={{ marginTop: 30, fontWeight: 'bold', fontSize: 18 }}>
            ¿Desea realmente cancelar la suscripción?
          </p>          
        </ModalBody>
        <ModalFooter>
            <Button
              color='danger'
              style={{ marginRight: 20 }}
              onClick={() => {this.props.deleteSuscripcion(); this.props.toggle()}}>
              Cancelar suscripción
            </Button>
            <Button onClick={this.props.toggle}>Salir</Button>
          </ModalFooter>
      </Modal>
          )
        }
      }
      
export default ModalDesubscribir