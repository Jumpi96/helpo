import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Label,
  ListItem,
  Body,
  Left,
  Right,
  Icon,
  Thumbnail,
  Text,
  Separator,
} from 'native-base';
import styles from './styles';
import { getImagen } from '../../../Lib/Imagen';


class ConsultarPerfilVoluntario extends Component {
  constructor(props) {
    super(props);
    this.renderDni = this.renderDni.bind(this);
    this.renderDescripcion = this.renderDescripcion.bind(this);
    this.renderTelefono = this.renderTelefono.bind(this);
    this.renderSexo = this.renderSexo.bind(this);
    this.renderApellido = this.renderApellido.bind(this);
    this.renderGustos = this.renderGustos.bind(this);
    this.renderHabilidades = this.renderHabilidades.bind(this);
  }
  renderSexo() {
    if (this.props.data.sexo == null) {
      return <Text style={styles.textMuted}> No hay valor ingresado.</Text>
    }
    return <Text> {this.props.data.sexo}</Text>
  }

  renderApellido() {
    if (this.props.data.apellido == null) {
      return <Text style={styles.textMuted}> No hay valor ingresado.</Text>
    }
    return <Text> {this.props.data.apellido}</Text>
  }

  renderGustos() {
    if (this.props.data.gustos == null) {
      return <Text style={styles.textMuted}> No hay valor ingresado.</Text>
    }
    return <Text> {this.props.data.gustos}</Text>
  }

  renderHabilidades() {
    if (this.props.data.habilidades == null) {
      return <Text style={styles.textMuted}> No hay valor ingresado.</Text>
    }
    return <Text> {this.props.data.habilidades}</Text>
  }

  renderTelefono() {
    //Si uso == va a dar True para null y undefined
    if (this.props.data.telefono == null) {
      return <Text style={styles.textMuted}> No hay valor ingresado.</Text>
    }
    return <Text> {this.props.data.telefono}</Text>
  }

  renderDni() {
    if (this.props.data.dni == null) {
      return <Text style={styles.textMuted}> No hay valor ingresado.</Text>
    }
    return <Text> {this.props.data.dni}</Text>
  }

  renderDescripcion() {
    if (this.props.data.descripcion == null) {
      return <Text style={styles.textMuted}> No hay valor ingresado.</Text>
    }
    return <Text> {this.props.data.descripcion}</Text>
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={this.props.goBack}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Perfil</Title>
          </Body>
          <Right>
            {this.props.data.usuario.id === this.props.auth.user.id ?
              <Button transparent onPress={this.props.switchToModificar}>
                <Text>Modificar</Text>
              </Button>
              : undefined}
          </Right>
        </Header>
        <Content>
          <Thumbnail large center source={{ uri: this.props.data.avatar.url }} />
          <Separator bordered noTopBorder>
            <Text>Datos personales</Text>
          </Separator>
          <ListItem>
            <Label style={styles.label}>Nombre</Label>
            <Text>{this.props.nombre}</Text>
          </ListItem>

          <ListItem>
            <Label style={styles.label}>Apellido</Label>
            {this.renderApellido()}
          </ListItem>

          <ListItem>
            <Label style={styles.label}>Mail</Label>
            <Text>{this.props.email}</Text>
          </ListItem>

          <ListItem>
            <Label style={styles.label}>Teléfono</Label>
            {this.renderTelefono()}
          </ListItem>

          <ListItem>
            <Label style={styles.label}>DNI</Label>
            {this.renderDni()}
          </ListItem>

          <ListItem>
            <Label style={styles.label}>Sexo</Label>
            {this.renderSexo()}
          </ListItem>

          <Separator bordered noTopBorder>
            <Text>Extras</Text>
          </Separator>

          <ListItem>
            <Label style={styles.label}>Gustos</Label>
            {this.renderGustos()}
          </ListItem>

          <ListItem>
            <Label style={styles.label}>Habilidades</Label>
            {this.renderHabilidades()}
          </ListItem>

        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, undefined)(ConsultarPerfilVoluntario);