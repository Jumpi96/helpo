import React from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Item,
  ListItem,
  Label,
  Input,
  Body,
  Left,
  Icon,
  Form,
  Text,
  View,
} from 'native-base';
import styles from '../RegistrarColaboraciones/styles';
import api from '../../../api';


class AgregarOfrecimiento extends React.Component {

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const colaboracion = params.colaboracion;
    this.state = {
      colaboracion,
      apiToken: false,
      error: undefined
    };

    this.handleCantidadChange = this.handleCantidadChange.bind(this);
    this.handleComentariosChange = this.handleComentariosChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleCantidadChange(cantidad) {
    const colaboracion = this.state.colaboracion;
    colaboracion.cantidad = cantidad;
    this.setState({ colaboracion });
  }

  handleComentariosChange(comentarios) {
    const colaboracion = this.state.colaboracion;
    colaboracion.comentarios = comentarios;
    this.setState({ colaboracion });
  }

  handleValidation() {
    let formIsValid = true;
    let error = this.state.error;

    if (this.state.colaboracion.cantidad <= 0) {
      formIsValid = false;
      error = 'La cantidad ingresada no es válida.';
    } else if (this.state.colaboracion.cantidad_restante < this.state.colaboracion.cantidad) {
      formIsValid = false;
      error = 'La cantidad ingresada es mayor al cupo disponible';
    }

    this.setState({ error });
    return formIsValid;
  }

  getEntregados() {
    if (!this.state.colaboracion.funcion) {
      if (this.state.colaboracion.entregados > 0) {
        return (
          <Item>
            <Label>Entregados</Label>
            <Text style={styles.label}>{this.state.colaboracion.entregados}</Text>
          </Item>
        );
      }
    } else {
      if (this.state.colaboracion.presencias > 0) {
        return (
          <Item>
            <Label>Presenecias</Label>
            <Text style={styles.label}>{this.state.colaboracion.presencias}</Text>
          </Item>
        )
      }
    }
  }

  handleSubmit() {
    this.setState({ apiToken: true });
    if (this.handleValidation()) {
      if (this.state.colaboracion.cantidad_anterior === 0) {
        this.newColaboracion();
      } else {
        this.editColaboracion();
      }
    } else {
      this.setState({ apiToken: false });
    }
  }

  editColaboracion() {
    var _this = this;
    const { colaboracion } = this.state;
    if (this.state.colaboracion.funcion) {
      const nuevaParticipacion = {
        id: colaboracion.colaboracion_anterior,
        cantidad: colaboracion.cantidad,
        comentario: colaboracion.comentarios,
        necesidad_voluntario_id: colaboracion.id,
      };
      api.put('/actividades/participaciones/' + colaboracion.colaboracion_anterior + '/', nuevaParticipacion)
        .then(() => {
          this.props.navigation.navigate('RegistrarOfrecimiento', { evento: this.getIdEvento() });
        }).catch(function (error) {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
          _this.setState({ error: "Hubo un problema al cargar su información." });
        });
    } else {
      const nuevaColaboracion = {
        id: colaboracion.colaboracion_anterior,
        cantidad: colaboracion.cantidad,
        comentario: colaboracion.comentarios,
        necesidad_material_id: colaboracion.id,
      };
      api.put('/actividades/colaboraciones/' + colaboracion.colaboracion_anterior + '/', nuevaColaboracion)
        .then(() => {
          this.props.navigation.navigate('RegistrarOfrecimiento', { evento: this.getIdEvento() });
        }).catch(function (error) {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
          _this.setState({ error: "Hubo un problema al cargar su información." });
        });

    }
  }

  newColaboracion() {
    var _this = this;
    const colaboracion = this.state.colaboracion;
    if (this.state.colaboracion.funcion) {
      const nuevaParticipacion = {
        comentario: colaboracion.comentarios,
        necesidad_voluntario_id: colaboracion.id,
        cantidad: colaboracion.cantidad
      };
      api.post('/actividades/participaciones/', nuevaParticipacion)
        .then(() => {
          this.props.navigation.navigate('RegistrarOfrecimiento', { evento: this.getIdEvento() });
        }).catch(function (error) {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
          _this.setState({ error: "Hubo un problema al cargar su información." });
        });
    } else {
      const nuevaColaboracion = {
        cantidad: colaboracion.cantidad,
        comentario: colaboracion.comentarios,
        necesidad_material_id: colaboracion.id,
      };
      api.post('/actividades/colaboraciones/', nuevaColaboracion)
        .then(() => {
          this.props.navigation.navigate('RegistrarOfrecimiento', { evento: this.getIdEvento() });
        }).catch(function (error) {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
          _this.setState({ error: "Hubo un problema al cargar su información." });
        });
    }
  }

  getInfoCategorias() {
    if (this.state.colaboracion.funcion) {
      return (
        <ListItem>
          <Label style={styles.label}>Función</Label>
          <Text style={styles.label}>{this.state.colaboracion.funcion.nombre}</Text>
        </ListItem>
      );
    }
    return (
      <View>
        <ListItem>
          <Label style={styles.label}>Categoría</Label>
          <Text style={styles.label}>{this.state.colaboracion.recurso.categoria.nombre}</Text>
        </ListItem>
        <ListItem>
          <Label style={styles.label}>Recurso</Label>
          <Text>{this.state.colaboracion.recurso.nombre}</Text>
        </ListItem>
      </View>
    );
  }

  getIdEvento() {
    if (this.state.colaboracion.evento.id) {
      return this.state.colaboracion.evento.id;
    } else {
      return this.state.colaboracion.evento;
    }
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('RegistrarOfrecimiento', { evento: this.getIdEvento() })}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Agregar ofrecimiento</Title>
          </Body>
        </Header>

        <Content>
          <Form>
            {this.getInfoCategorias()}
            <ListItem>
              <Label style={styles.label}>Descripción</Label>
              <Text>{this.state.colaboracion.descripcion}</Text>
            </ListItem>
            <Item>
              <Label>Cantidad</Label>
              <Input
                value={'' + this.state.colaboracion.cantidad} keyboardType="numeric"
                onChangeText={(text) => this.handleCantidadChange(text)}
              />
            </Item>
            {this.getEntregados()}
            <Item>
              <Label>Comentarios</Label>
              <Input
                value={this.state.colaboracion.comentarios}
                onChangeText={(text) => this.handleComentariosChange(text)}
              />
            </Item>
            <Text style={styles.validationMessage}>{this.state.error}</Text>
            <Button
              block style={{ margin: 15, marginTop: 50 }}
              onPress={this.handleSubmit}
            >
              <Text>Guardar</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default AgregarOfrecimiento;
