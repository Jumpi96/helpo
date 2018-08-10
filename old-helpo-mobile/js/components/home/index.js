import React, { Component } from 'react';
import { Image, View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Container, Button, H3, Text } from 'native-base';

import { openDrawer } from '../../actions/drawer';
import styles from './styles';

const launchscreenBg = require('../../../img/launchscreen-bg.png');
const launchscreenLogo = require('../../../img/logo-kitchen-sink-orange.png');

class Home extends Component { // eslint-disable-line

  static propTypes = {
    openDrawer: React.PropTypes.func,
  }

  render() {
    return (
      <Container>
        <StatusBar barStyle='light-content'/>
        <Image source={launchscreenBg} style={styles.imageContainer}>
          <View style={styles.logoContainer}>
            <Image source={launchscreenLogo} style={styles.logo} />
          </View>
          <View style={{ alignItems: 'center', marginBottom: 50, backgroundColor: 'transparent' }}>
            <H3 style={styles.text}>Vos, yo, todos</H3>
            <View style={{ marginTop: 8 }} />
          </View>
          <View style={{ marginBottom: 80 }}>
            <Button
              style={{ backgroundColor: '#E94E1B', alignSelf: 'center' }}
              onPress={this.props.openDrawer}
            >
              <Text>¡Vamos!</Text>
            </Button>
          </View>
        </Image>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
  routes: state.drawer.routes,
});

export default connect(mapStateToProps, bindActions)(Home);
