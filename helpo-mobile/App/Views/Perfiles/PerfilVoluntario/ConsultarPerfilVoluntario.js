import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  ActionSheet,
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
    this.showToastRetroalimentacion = this.showToastRetroalimentacion.bind(this);
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

  showToastRetroalimentacion() {
    ActionSheet.show({
      options: [
        { text: "Cerrar", icon: "close", iconColor: "#25de5b" },
      ],
      title: "Cantidad de manos acumuladas y eventos asistidos"
    }, buttonIndex => {
      console.log(buttonIndex);
    });
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
            <Row>
              <Thumbnail large center source={{ uri: this.props.data.avatar.url }} />
              <Right>
              <Button transparent onPress={this.showToastRetroalimentacion}>
                <Icon name="hand" style={{ color: "#F39200"}} ></Icon>
                <Text style={styles.retroalimentacion}>{this.props.data.manos}</Text>
                <Icon name="calendar" family="Entypo" style={{ color: "#F39200"}} ></Icon>
                <Text style={styles.retroalimentacion}>{this.props.data.eventos}</Text>
              </Button>
              </Right>
            </Row>
          <Separator bordered noTopBorder>
            <Text>Datos personales</Text>
          </Separator>
          <ListItem itemDivider>
            <Label style={styles.label}>Nombre</Label>
          </ListItem>
          <ListItem>
            <Text>{this.props.nombre}</Text>
          </ListItem>

          <ListItem itemDivider>
            <Label style={styles.label}>Apellido</Label>
          </ListItem>
          <ListItem>
            {this.renderApellido()}
          </ListItem>

          <ListItem itemDivider>
            <Label style={styles.label}>Mail</Label>
          </ListItem>
          <ListItem>
            <Text>{this.props.email}</Text>
          </ListItem>

          <ListItem itemDivider>
            <Label style={styles.label}>Teléfono</Label>
          </ListItem>
          <ListItem>
            {this.renderTelefono()}
          </ListItem>

          <ListItem itemDivider>
            <Label style={styles.label}>DNI</Label>
          </ListItem>
          <ListItem>
            {this.renderDni()}
          </ListItem>

          <ListItem itemDivider>
            <Label style={styles.label}>Sexo</Label>
          </ListItem>
          <ListItem>
            {this.renderSexo()}
          </ListItem>

          <ListItem itemDivider>
            <Label style={styles.label}>Gustos</Label>
          </ListItem>
          <ListItem>
            {this.renderGustos()}
          </ListItem>

          <ListItem itemDivider>
            <Label style={styles.label}>Habilidades</Label>
          </ListItem>
          <ListItem>
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