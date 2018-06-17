
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Content, Button, Item, Label, Input, Body, Left, Right, Icon, Form, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';

import styles from './styles';
import { login } from '../../actions/auth';

const {
  popRoute,
} = actions;

class Login extends Component {

  static propTypes = {
    popRoute: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
    login: React.PropTypes.func,
    auth: React.PropTypes.shape({
      isAuthenticated: React.PropTypes.bool,
    }),
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.login(this.state.email, this.state.password);
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  render() {
    if (this.props.auth.isAuthenticated) {
      Actions.home();
    }
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Iniciar sesión</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input onChangeText={text => this.setState({ email: text })} />
            </Item>
            <Item floatingLabel last>
              <Label>Contraseña</Label>
              <Input />
              <Input secureTextEntry onChangeText={text => this.setState({ password: text })} />
            </Item>
          </Form>
          <Button block style={{ margin: 15, marginTop: 50 }}
            onPress={this.handleSubmit} >
            <Text>Ingresar</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    popRoute: key => dispatch(popRoute(key)),
    login: (email, password) => dispatch(login(email, password)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
  auth: state.auth,
});

export default connect(mapStateToProps, bindAction)(Login);
