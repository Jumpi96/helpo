import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import React from 'react'
import PropTypes from 'prop-types'

const proptypes = {
  title: PropTypes.string,
  body: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
}

function ModalGenerico(props) {
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
            <Button color="secondary" onClick={props.onCancel}>Aceptar</Button>
          </ModalFooter>
        </Modal>
      
  )
}
ModalGenerico.PropTypes = proptypes;
export default ModalGenerico;