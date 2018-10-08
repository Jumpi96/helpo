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
  Separator
} from 'native-base';
import styles from './styles';
import BotonSuscripcion from '../../Suscripciones/BotonSuscripcion/BotonSuscripcion'


class ConsultarPerfilOrganizacion extends Component {
  constructor(props) {
    super(props);
    this.renderDescripcion = this.renderDescripcion.bind(this);
    this.renderRubro = this.renderRubro.bind(this);
    this.renderTelefono = this.renderTelefono.bind(this);
    this.renderDescripcion = this.renderDescripcion.bind(this);
    this.renderCuit = this.renderCuit.bind(this);
  }

  renderRubro() {
    if (this.props.data.rubro == null) {
      return <Text style={styles.textMuted}> No hay valor ingresado</Text>
    }
    return <Text> {this.props.data.rubro.nombre}</Text>
  }

  renderTelefono() {
    //Si uso == va a dar True para null y undefined
    if (this.props.data.telefono == null) {
      return <Text style={styles.textMuted}> No hay valor ingresado</Text>
    }
    return <Text> {this.props.data.telefono}</Text>
  }

  renderCuit() {
    if (this.props.data.cuit == null) {
      return <Text style={styles.textMuted}> No hay valor ingresado</Text>
    }
    return <Text> {this.props.data.cuit}</Text>
  }

  renderDescripcion() {
    if (this.props.data.descripcion == null) {
      return <Text style={styles.textMuted}> No hay valor ingresado</Text>
    }
    return <Text> {this.props.data.descripcion}</Text>
  }

  render() {
    if (this.props.data.avatar) {
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
              <Label style={styles.label}>Mail</Label>
              <Text>{this.props.email}</Text>
            </ListItem>

            <ListItem>
              <Label style={styles.label}>Descripción</Label>
              {this.renderDescripcion()}
            </ListItem>

            <ListItem>
              <Label style={styles.label}>Teléfono</Label>
              {this.renderTelefono()}
            </ListItem>

            <ListItem>
              <Label style={styles.label}>CUIT</Label>
              {this.renderCuit()}
            </ListItem>

            <ListItem>
              <Label style={styles.label}>Rubro</Label>
              {this.renderRubro()}
            </ListItem>

            <Separator bordered noTopBorder></Separator>
            <BotonSuscripcion organizacion={this.props.data.usuario.id}/>
          </Content>
        </Container>
      );
    } else {
      return <Text></Text>
    }

  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, undefined)(ConsultarPerfilOrganizacion);