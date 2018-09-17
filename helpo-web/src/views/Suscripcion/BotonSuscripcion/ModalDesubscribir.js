import React from 'react'
import { Modal, ModalFooter, ModalBody, Button } from 'reactstrap'

/*
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
            Realmente desea cancelar su suscripcion?
          </p>          
        </ModalBody>
        <ModalFooter>
            <Button
              color='danger'
              style={{ marginRight: 20 }}
              onClick={() => {this.props.deleteSuscripcion(); this.props.toggle()}}>
              Cancelar Suscripcion
            </Button>
            <Button onClick={this.props.toggle}>Salir</Button>
          </ModalFooter>
      </Modal>
          )
        }
      }
      
export default ModalDesubscribir