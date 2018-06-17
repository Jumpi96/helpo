
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Content, Button, Item, Label, Input, Body, Left, Right, Icon, Form, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';

import styles from './styles';
import { logout } from '../../actions/auth';

const {
  popRoute,
} = actions;

class Configuracion extends Component {

  static propTypes = {
    popRoute: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
    logout: React.PropTypes.func,
    auth: React.PropTypes.shape({
      isAuthenticated: React.PropTypes.bool,
    }),
  }

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.logout();
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  render() {
    if (!this.props.auth.isAuthenticated) {
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
    popRoute: key => dispatch(popRoute(key)),
    logout: () => dispatch(logout()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
  auth: state.auth,
});

export default connect(mapStateToProps, bindAction)(Configuracion);
