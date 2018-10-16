import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Item,
  Label,
  Input,
  Text,
  Content,
  View
} from "native-base";

const inputPropTypes = {
  contactNum: PropTypes.number.isRequired,
  onRemoveContact: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  onNombreChange: PropTypes.func.isRequired,
  onMailChange: PropTypes.func.isRequired,
  onTelefonoChange: PropTypes.func.isRequired,
  contactos: PropTypes.shape({
    nombre: PropTypes.string,
    email: PropTypes.string,
    telefono: PropTypes.string,
  }).isRequired,
};

function ContactoInput({
  contactNum, onRemoveContact, id, onNombreChange, onMailChange, onTelefonoChange, contactos,
}) {
  return (
    <Content style={{ margin: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>Contacto {contactNum}</Text>
      <Item>
        <Label>Nombre</Label>
        <Input
          id={`nombre-contacto${id}`}
          value={contactos.nombre}
          onChangeText={text => onNombreChange(text, id)}
        />
      </Item>
      <Item>
        <Label>Mail</Label>
        <Input
          id={`email-contacto${id}`}
          value={contactos.email}
          onChangeText={text => onMailChange(text, id)}
        />
      </Item>
      <Item>
        <Label>Teléfono</Label>
        <Input
          id={`telefono-contacto${id}`}
          value={contactos.telefono}
          onChangeText={text => onTelefonoChange(text, id)}
        />
      </Item>
      <Button block danger style={{ margin: 15 }} onPress={() => onRemoveContact(id)}>
        <Text> Remover Contacto </Text>
      </Button>
    </Content>
  );
}
ContactoInput.propTypes = inputPropTypes;



const registerPropTypes = {
  contactos: PropTypes.arrayOf(PropTypes.object).isRequired,
  onAddContact: PropTypes.func.isRequired,
  onRemoveContact: PropTypes.func.isRequired,
  onNombreChange: PropTypes.func.isRequired,
  onMailChange: PropTypes.func.isRequired,
  onTelefonoChange: PropTypes.func.isRequired,
};
class RegistrarContacto extends React.Component {
  constructor(props) {
    super(props);
  }

  displayInputs() {
    const inputs = [];
    for (let i = 0; i < this.props.contactos.length; i += 1) {
      inputs.push(
        <ContactoInput
          contactos={this.props.contactos[i]}
          contactNum={i + 1}
          id={this.props.contactos[i].contactId}
          key={i}
          onNombreChange={this.props.onNombreChange}
          onMailChange={this.props.onMailChange}
          onTelefonoChange={this.props.onTelefonoChange}
          onRemoveContact={this.props.onRemoveContact} />
      );
    }
    return inputs || null;
  }

  render() {
    return (
      <View>
        {this.displayInputs()}
        <Button block danger style={{ margin: 25 }} onPress={this.props.onAddContact}>
          <Text> Nuevo contacto </Text>
        </Button>
      </View>
    );
  }
}
RegistrarContacto.propTypes = registerPropTypes;

export default RegistrarContacto;
