import React from 'react';
import PropTypes from 'prop-types';

const inputPropTypes = {
  contactNum: PropTypes.number.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

function ContactoInput({ contactNum, onClickRemove, id }) {
  return (
    <div>
      <h2>Contacto {contactNum}</h2>
      <p>Nombre</p>
      <input type="text" name="nombre" />
      <p>Mail</p>
      <input type="text" name="mail" />
      <p>Telefono</p>
      <input type="text" name="telefono" />
      <input type="button" value="X" onClick={() => onClickRemove(id)} />
    </div>
  );}
ContactoInput.propTypes = inputPropTypes;

const registerPropTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickAdd: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
};

class RegistrarContacto extends React.Component {
  displayInputs() {
    const inputs = [];
    for (let i = 1;
      i <= this.props.contacts.length; i += 1) {
      inputs.push(<ContactoInput contactNum={i} onClickRemove={this.props.onClickRemove} />);
    }
    return inputs || null;
  }

  render() {
    return (
      <div>
        <h1>Registrar Contacto</h1>
        {this.displayInputs()}
        <input type="button" value="Add" onClick={this.props.onClickAdd} />
      </div>
    );
  }
}
RegistrarContacto.propTypes = registerPropTypes;

export default RegistrarContacto;