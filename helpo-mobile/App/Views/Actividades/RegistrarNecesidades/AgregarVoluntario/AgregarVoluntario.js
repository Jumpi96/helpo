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
  Picker,
} from "native-base";
import api from '../../../../api';
import styles from '../styles';

class AgregarVoluntario extends React.Component {

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const { evento } = params;
    this.state = {
      evento: evento,
      cantidad: undefined,
      funcion_id: 0,
      descripcion: undefined,
      funciones: [],
      error: undefined
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFuncionChange = this.handleFuncionChange.bind(this);
    this.addVoluntario = this.addVoluntario.bind(this);
  }

  componentDidMount() {
    api.get("/actividades/funciones/")
      .then(res => {
        const funcionesData = res.data;
        this.setState({ funciones: funcionesData, funcion_id: funcionesData[0].id });
      }
      );
  }
  handleSubmit(event) {
    event.preventDefault();
    if (this.handleValidation()) {
      const voluntario = {
        evento: this.state.evento,
        funcion_id: this.state.funcion_id,
        descripcion: this.state.descripcion,
        cantidad: this.state.cantidad,
      };
      this.addVoluntario(voluntario);
    }
  }

  addVoluntario(voluntario) {
    api.post("/actividades/voluntarios/", voluntario)
      .then(() => {
        this.props.navigation.navigate('RegistrarNecesidades', { id: this.state.evento });
      }).catch(() => {
        this.setState({ error: "Hubo un problema al cargar su información." });
      });
  }

  handleValidation() {
    let formIsValid = true;
    let error = "";
    if (this.state.funcion_id === 0 ||
      !this.state.funcion_id) {
      formIsValid = false;
      error = "Hubo un problema al cargar las funciones.";
    }
    // eslint-disable-next-line
    if (!isNaN(this.state.cantidad) && parseInt(this.state.cantidad) <= 0) {
      formIsValid = false;
      error = "La cantidad ingresada no es válida.";
    }
    if (!this.state.descripcion) {
      formIsValid = false;
      error = "La descripción ingresada no es válida.";
    }
    this.setState({ error });
    return formIsValid;
  }

  handleFuncionChange(f) {
    this.setState({ funcion_id: f });
  }

  getListaFunciones() {
    return this.state.funciones.map(r =>
      <Item value={r.id} key={r.id} label={r.nombre} />
    );
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('RegistrarNecesidades', { id: this.state.evento })}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Agregar voluntario</Title>
          </Body>
        </Header>

        <Content>
          <Form>
            <ListItem>
              <Left>
                <Text>Función</Text>
              </Left>
              <Body>
                <Picker
                  note
                  mode="dropdown"
                  selectedValue={this.state.funcion_id}
                  onValueChange={this.handleFuncionChange}
                >
                  {this.getListaFunciones()}
                </Picker>
              </Body>
            </ListItem>
            <Item floatingLabel>
              <Label>Descripción</Label>
              <Input value={this.state.descripcion}
                onChangeText={(text) => this.setState({ descripcion: text })} />
            </Item>
            <Item floatingLabel>
              <Label>Cantidad</Label>
              <Input value={this.state.cantidad} keyboardType="numeric"
                onChangeText={(text) => this.setState({ cantidad: text })} />
            </Item>
            <Text style={styles.validationMessage}>{this.state.error}</Text>
            <Button block style={{ margin: 15, marginTop: 50 }}
              onPress={this.handleSubmit} >
              <Text>Guardar voluntario</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default AgregarVoluntario;
