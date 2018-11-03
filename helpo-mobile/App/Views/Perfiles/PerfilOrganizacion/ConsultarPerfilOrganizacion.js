import React, { Component } from 'react';
import { connect } from 'react-redux';
import openMap from 'react-native-open-maps';
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
  View,
  Body,
  Left,
  Right,
  Icon,
  Thumbnail,
  Text
} from 'native-base';
import styles from './styles';


class ConsultarPerfilOrganizacion extends Component {
  constructor(props) {
    super(props);
    this.renderDescripcion = this.renderDescripcion.bind(this);
    this.renderRubro = this.renderRubro.bind(this);
    this.renderTelefono = this.renderTelefono.bind(this);
    this.renderDescripcion = this.renderDescripcion.bind(this);
    this.renderCuit = this.renderCuit.bind(this);
    this.showToast = this.showToast.bind(this);
    this.showToastRetroalimentacion = this.showToastRetroalimentacion.bind(this);
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

  getBotonOrganizacion() {
    if (this.props.data.usuario.id === this.props.auth.user.id) {
      return (
        <Button transparent onPress={this.props.switchToModificar}>
          <Text>Modificar</Text>
        </Button>
      );
    } else if (this.props.data.usuario.user_type === 1) {
      return (
        <Button transparent onPress={this.props.switchToEventosOrg}>
          <Text>Ver eventos</Text>
        </Button>
      );
    }
  }

  showToast() {
    const nombre = this.props.nombre;
    ActionSheet.show({
      options: [
        { text: "Cerrar", icon: "close", iconColor: "#25de5b" },
      ],
      title: nombre + " es una cuenta verificada"
    }, buttonIndex => {
      console.log(buttonIndex);
    });
  }

  showToastRetroalimentacion() {
    ActionSheet.show({
      options: [
        { text: "Cerrar", icon: "close", iconColor: "#25de5b" },
      ],
      title: "Cantidad de manos acumuladas y eventos"
    }, buttonIndex => {
      console.log(buttonIndex);
    });
  }

  goToUbicacion(ubicacion) {
    openMap({
      query: ubicacion.latitud + ',' + ubicacion.longitud
    });
  }

  renderUbicacion() {
    return (
      <View>
        <Button block style={{ margin: 15, marginTop: 20 }}
          onPress={() => this.goToUbicacion(this.props.data.ubicacion)}
        >
          <Text>Abrir ubicación</Text>
        </Button>
        <ListItem>
          <Text>{this.props.data.ubicacion.notas}</Text>
        </ListItem>
      </View>
    );
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
              {this.getBotonOrganizacion()}
            </Right>
          </Header>
          <Content>
            <Row>
              <Thumbnail large center source={{ uri: this.props.data.avatar.url }} />
              <Right>
                <Button transparent onPress={this.showToastRetroalimentacion}>
                  <Icon name="hand" style={{ color: "#F39200" }} ></Icon>
                  <Text style={styles.retroalimentacion}>{this.props.data.manos}</Text>
                  <Icon name="calendar" family="Entypo" style={{ color: "#F39200" }} ></Icon>
                  <Text style={styles.retroalimentacion}>{this.props.data.eventos}</Text>
                </Button>
              </Right>
            </Row>
            <ListItem itemDivider>
              <Label style={styles.label}>Nombre</Label>
            </ListItem>
            <ListItem>
              <Text>{this.props.nombre}</Text>
              {this.props.data.verificada ?
                <Button transparent onPress={this.showToast} >
                  <Icon type="Feather" name="check-circle" style={{ color: "#F39200", marginLeft: 10 }} />
                </Button>
                : undefined}
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
              <Label style={styles.label}>CUIT</Label>
            </ListItem>
            <ListItem>
              {this.renderCuit()}
            </ListItem>

            <ListItem itemDivider>
              <Label style={styles.label}>Rubro</Label>
            </ListItem>
            <ListItem>
              {this.renderRubro()}
            </ListItem>

            {this.props.data.ubicacion !== null ?
              <View>
                <ListItem itemDivider>
                  <Label style={styles.label}>Ubicación</Label>
                </ListItem>
                {this.renderUbicacion()}
              </View> : undefined
            }

            <ListItem itemDivider>
              <Label style={styles.label}>Descripción</Label>
            </ListItem>
            <ListItem>
              {this.renderDescripcion()}
            </ListItem>

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