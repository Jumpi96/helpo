
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Button, Item, Label, Input, Body, Left, Right, Icon, Form, Text } from 'native-base';

import styles from './styles';
import { login } from '../../Redux/actions/auth'


class Login extends Component {

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
    const auth = this.props.auth;
    this.props.login(this.state.email, this.state.password);
    if (auth.isAuthenticated) {
      this.props.navigation.navigate("LaunchScreen");
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent 
              onPress={() => this.props.navigation.navigate("LaunchScreen")}>
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
          {this.props.errors.length > 0 && (
            <Item>
              <Text style={styles.validationMessage}>{this.props.errors[0].message}</Text>
            </Item>
          )}
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    login: (email, password) => dispatch(login(email, password)),
  };
}

const mapStateToProps = (state) => {
  let errors = [];
  if (state.auth.errors) {
    errors = Object.keys(state.auth.errors).map((field) => {
      return { field, message: state.auth.errors[field] };
    });
  }
  return {
    errors,
    auth: state.auth,
  };
};

export default connect(mapStateToProps, bindAction)(Login);
