import React from 'react';
import PropTypes from 'prop-types';
// Fuente https://github.com/bl00mber/react-phone-input-2
import ReactPhoneInput from 'react-phone-input-2';


const inputPropTypes = {
  contactNum: PropTypes.number.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  contactId: PropTypes.number.isRequired,
  onContactChange: PropTypes.func.isRequired,
  onPhoneChange: PropTypes.func.isRequired,
  contactValues: PropTypes.shape({
    nombre: PropTypes.string,
    mail: PropTypes.string,
    telefono: PropTypes.number,
  }).isRequired,
};

function ContactoInput({
  contactNum, onClickRemove, contactId, onContactChange, onPhoneChange, contactValues,
}) {
  return (
    <div className="form-group">
      <h6>Contacto {contactNum}</h6>
      <label htmlFor={`nombre-contacto${contactId}`}>
        Nombre<br />
        <input
          type="text"
          placeholder="Nombre Apellido"
          id={`nombre-contacto${contactId}`}
          className="form-control"
          name="nombre"
          onChange={e => onContactChange(e, contactId)}
          value={contactValues.nombre}
        />
      </label> <br />
      <label htmlFor={`mail-contacto${contactId}`}>
        Mail<br />
        <input
          type="mail"
          placeholder="ejemplo@mail.com"
          id={`mail-contacto${contactId}`}
          className="form-control"
          name="mail"
          onChange={e => onContactChange(e, contactId)}
          value={contactValues.mail}
        />
      </label> <br />
      <label htmlFor={`telefono-contacto${contactId}`}>
        Telefono<br />
        <ReactPhoneInput
          id={`telefono-contacto${contactId}`}
          placeholder="+543515555555"
          className="form-control"
          name="telefono"
          onChange={str => onPhoneChange(str, contactId)}
          value={contactValues.telefono}
        />
      </label> <br />
      <input
        type="button"
        value="Remover Contacto"
        className="btn btn-danger"
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
  onPhoneChange: PropTypes.func.isRequired,
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
        onPhoneChange={this.props.onPhoneChange}
        contactValues={this.props.contacts[i - 1]}
      />);
    }
    return inputs || null;
  }

  render() {
    return (
      <div className="form-group">
        {this.displayInputs()}
        <input
          type="button"
          className="btn btn-secondary"
          value="Agregar Contacto"
          onClick={this.props.onClickAdd}
        />
      </div>
    );
  }
}
RegistrarContacto.propTypes = registerPropTypes;

export default RegistrarContacto;
