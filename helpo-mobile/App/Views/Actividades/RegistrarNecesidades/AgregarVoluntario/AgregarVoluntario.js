import React from "react";
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { actions } from 'react-native-navigation-redux-helpers';
import { FormValidationMessage } from "react-native-elements";
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
import { openDrawer } from '../../../../actions/drawer';
import api from '../../../../api';

const {
  popRoute,
} = actions;


class AgregarNecesidad extends React.Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
    popRoute: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
    evento: React.PropTypes.number,
  }

  constructor(props) {
    super(props);
    const evento = this.props.evento;
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
        Actions.registrarNecesidades({ id: this.state.evento });
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
    if (!isNaN(this.state.cantidad) && parseInt(this.state.cantidad)<=0) {
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
            <Button transparent onPress={() => Actions.pop()}>
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
                onChangeText={(text) => this.setState({descripcion: text})}/>
            </Item>
            <Item floatingLabel>
              <Label>Cantidad</Label>
              <Input value={this.state.cantidad} keyboardType="numeric"
                onChangeText={(text) => this.setState({cantidad: text})}/>
            </Item>

            <FormValidationMessage>{this.state.error}</FormValidationMessage>
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

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
});

export default connect(mapStateToProps, bindAction)(AgregarNecesidad);
