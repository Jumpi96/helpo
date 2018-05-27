import React from 'react';
import PropTypes from 'prop-types';

const inputPropTypes = {
  contactNum: PropTypes.number.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  contactId: PropTypes.number.isRequired,
  onContactChange: PropTypes.func.isRequired,
  contactValues: PropTypes.shape({
    nombre: PropTypes.string,
    mail: PropTypes.string,
    telefono: PropTypes.string,
  }).isRequired,
};

function ContactoInput({
  contactNum, onClickRemove, contactId, onContactChange, contactValues,
}) {
  return (
    <div className="form-group">
      <h3>Contacto {contactNum}</h3>
      <label htmlFor={`nombre-contacto${contactNum}`}>
        Nombre<br />
        <input
          type="text"
          id={`nombre-contacto${contactNum}`}
          className="form-control"
          name="nombre"
          onChange={e => onContactChange(e, contactId)}
          value={contactValues.nombre}
        />
      </label> <br />
      <label htmlFor={`mail-contacto${contactNum}`}>
        Mail<br />
        <input
          type="text"
          id={`mail-contacto${contactNum}`}
          className="form-control"
          name="mail"
          onChange={e => onContactChange(e, contactId)}
          value={contactValues.mail}
        />
      </label> <br />
      <label htmlFor={`telefono-contacto${contactNum}`}>
        Telefono<br />
        <input
          type="text"
          id={`telefono-contacto${contactNum}`}
          className="form-control"
          name="telefono"
          onChange={e => onContactChange(e, contactId)}
          value={contactValues.telefono}
        />
      </label> <br />
      <input
        type="button"
        value="Remover Contacto"
        onClick={() => onClickRemove(contactId)}
      />
    </div>
  );
}
ContactoInput.propTypes = inputPropTypes;

const registerPropTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickAdd: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  onContactChange: PropTypes.func.isRequired,
};

class RegistrarContacto extends React.Component {
  displayInputs() {
    const inputs = [];
    for (let i = 1;
      i <= this.props.contacts.length; i += 1) {
      inputs.push(<ContactoInput
        contactNum={i}
        onClickRemove={this.props.onClickRemove}
        contactId={this.props.contacts[i - 1].contactId}
        onContactChange={this.props.onContactChange}
        contactValues={this.props.contacts[i - 1]}
      />);
    }
    return inputs || null;
  }

  render() {
    return (
      <div className="form-group">
        <h1>Registrar Contacto</h1>
        {this.displayInputs()}
        <input type="button" value="Add" onClick={this.props.onClickAdd} />
      </div>
    );
  }
}
RegistrarContacto.propTypes = registerPropTypes;

export default RegistrarContacto;
