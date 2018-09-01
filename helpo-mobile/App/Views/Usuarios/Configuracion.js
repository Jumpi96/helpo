
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Button, Item, Label, Input, Body, Left, Right, Icon, Form, Text } from 'native-base';

import styles from './styles';
import { logout } from '../../Redux/actions/auth';


class Configuracion extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.logout(this.props.auth.email);
    this.props.navigation.navigate("LaunchScreen");
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
            <Title>Configuración</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Button
            block
            style={{ margin: 15, marginTop: 50 }}
            onPress={this.logout}
          >
            <Text>Cerrar sesión</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {    
    logout: () => dispatch(logout()),
  };
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, bindAction)(Configuracion);
