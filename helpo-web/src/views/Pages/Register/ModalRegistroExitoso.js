import React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types'

const proptypes = {
  title: PropTypes.string,
  body: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
}

function ModalRegistroExitoso(props) {
  let success;
  if (props.onSuccess) {
    success = <Button color="primary" onClick={props.onSuccess}>Continuar}</Button>
  }
  return (
    
      
        <Modal isOpen={true}>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalBody>
            {props.body}
          </ModalBody>
          <ModalFooter>
            {success}{' '}
            <Button color="secondary" onClick={props.onCancel}>Volver</Button>
          </ModalFooter>
        </Modal>
      
  )
}
ModalRegistroExitoso.PropTypes = proptypes;
export default ModalRegistroExitoso;