
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Button, Body, Left, Right, Icon, Text } from 'native-base';

import styles from './styles';
import { logout } from '../../Redux/actions/auth';
import { GoogleSignin } from 'react-native-google-signin';


class Configuracion extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.googleSignOut = this.googleSignOut.bind(this);
  }

  googleSignOut = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
    } catch (error) {
      console.error(error);
    }
  };

  logout() {
    this.googleSignOut();
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
            onPress={() => this.props.navigation.navigate('ChangePassword')}
          >
            <Text>Cambiar contraseña</Text>
          </Button>
          <Button
            block
            style={{ margin: 15 }}
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
