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
  Label,
  Input,
  Body,
  Left,
  Icon,
  Form,
  Text
} from "native-base";
import { openDrawer } from '../../../../actions/drawer';
import api from '../../../../api';
import SelectorItem from './SelectorItem/SelectorItem';

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

  constructor(props){
    super(props);
    const evento = this.props.evento;
    this.state = {
        evento: evento,
        cantidad: undefined,
        recurso_id: 0,
        descripcion: undefined,
        error: undefined
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.addNecesidad = this.addNecesidad.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.handleValidation()) {
      const necesidad = {
        evento: this.state.evento,
        recurso_id: this.state.recurso_id,
        descripcion: this.state.descripcion,
        cantidad: this.state.cantidad
      };
      this.addNecesidad(necesidad);
    }
  }

  addNecesidad(necesidad) {
    api.post("/actividades/necesidades/", necesidad)
      .then(res => {
        console.log(res);
        console.log(res.data);
        Actions.registrarNecesidades({ id: this.state.evento });
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status); }
        else { console.log("Error: ", error.message); }
        this.setState({ error: "Hubo un problema al cargar su información." });
      });
  }

  handleValidation() {
    let formIsValid = true;
    let error = "";
    if (this.state.recurso_id === 0 ||
      !this.state.recurso_id) {
      formIsValid = false;
      error = "Hubo un problema al cargar los recursos.";
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
    this.setState({error: error});
    return formIsValid;
  }

  handleItemChange(r) {
    // eslint-disable-next-line
    this.setState({ recurso_id: parseInt(r) });
  }

  render(){
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Agregar necesidad</Title>
          </Body>
        </Header>

        <Content>
          <Form>
            <SelectorItem
              item={this.state.recurso_id}
              onItemChange={this.handleItemChange}/>
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
              <Text>Guardar necesidad</Text>
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
