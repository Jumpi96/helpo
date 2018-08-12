
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Button, Item, Label, Input, Body, Left, Right, Icon, Form, Text } from 'native-base';

import styles from './styles';
import { login } from '../../Redux/actions/auth'


class Login extends Component {

  /*static propTypes = {
    login: React.PropTypes.func,
    auth: React.PropTypes.shape({
      isAuthenticated: React.PropTypes.bool,
    }),
  }*/

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    console.warn(this.props.auth)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.login(this.state.email, this.state.password);
  }


  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => undefined}>
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
