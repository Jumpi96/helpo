import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getImagen } from '../../../Lib/Imagen';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Item,
  Label,
  ListItem,
  Input,
  Body,
  Left,
  Right,
  Icon,
  Form,
  Text,
} from 'native-base';
import styles from '../styles';

const perfilPropTypes = {
  nombre: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  data: PropTypes.shape({
    verificada: PropTypes.bool,
    telefono: PropTypes.number,
    dni: PropTypes.number,
    gustos: PropTypes.string,
    habilidades: PropTypes.string,
    sexo: PropTypes.string,
    apellido: PropTypes.string,
    avatar: PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string,
    })
  }),
  switchToModificar: PropTypes.func.isRequired,
}

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
      return <Text class='text-muted'> No hay valor ingresado</Text>
    }
    return <Text> {this.props.data.sexo}</Text>      
  }

  renderApellido() {
    if (this.props.data.apellido == null) {
      return <Text class='text-muted'> No hay valor ingresado</Text>
    }
    return <Text> {this.props.data.apellido}</Text>      
  }

  renderGustos() {
    if (this.props.data.gustos == null) {
      return <Text class='text-muted'> No hay valor ingresado</Text>
    }
    return <Text> {this.props.data.gustos}</Text>      
  }

  renderHabilidades() {
    if (this.props.data.habilidades == null) {
      return <Text class='text-muted'> No hay valor ingresado</Text>
    }
    return <Text> {this.props.data.habilidades}</Text>      
  }

  renderTelefono() {
    //Si uso == va a dar True para null y undefined
    if (this.props.data.telefono == null) {
      return <Text class='text-muted'> No hay valor ingresado</Text>
    }
    return <Text> {this.props.data.telefono}</Text>      
  }

  renderDni() {
    if (this.props.data.dni == null) {
      return <Text class='text-muted'> No hay valor ingresado</Text>
    }
    return <Text> {this.props.data.dni}</Text>      
  }

  renderDescripcion() {
    if (this.props.data.descripcion == null) {
      return <Text class='text-muted'> No hay valor ingresado</Text>
    }
    return <Text> {this.props.data.descripcion}</Text>      
  }  

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('LaunchScreen')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>

          
          
          <Body>
            <Title>Perfil</Title>
          </Body>


          <Right>
            <Button transparent onClick={this.props.switchToModificar}>
              <Icon type="FontAwesome" name="edit" />
            </Button>
          </Right>

        </Header>
        
        <Content>

          <Image
            source={{uri: getImagen(this.props.avatar.url) }}
          />
          
          <ListItem>
            <Label style={styles.label}>Nombre</Label>
            <Text>{this.props.nombre}</Text>
          </ListItem>

          <ListItem>
            <Label style={styles.label}>Apellido</Label>
            {this.renderApellido}
          </ListItem>

          <ListItem>
            <Label style={styles.label}>Mail</Label>
            <Text>{this.props.email}</Text>
          </ListItem>

          <ListItem>
            <Label style={styles.label}>Teléfono</Label>
            {this.renderTelefono}
          </ListItem>

          <ListItem>
            <Label style={styles.label}>DNI</Label>
            {this.renderDni}
          </ListItem>

          <ListItem>
            <Label style={styles.label}>Sexo</Label>
            {this.renderSexo}
          </ListItem>

          <ListItem>
            <Label style={styles.label}>Gustos</Label>
            {this.renderGustos}
          </ListItem>

          <ListItem>
            <Label style={styles.label}>Habilidades</Label>
            {this.renderHabilidades}
          </ListItem>

        </Content>
      </Container>
    );
  }
}

ConsultarPerfilVoluntario.propTypes = perfilPropTypes;

export default ConsultarPerfilVoluntario;