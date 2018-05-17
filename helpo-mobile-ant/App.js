import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import Header from './src/common/Header/Header';
import Actividades from './src/actividades/Actividades'

export default class App extends React.Component {
  render() {
    return (
      <NativeRouter>
        <View style={styles.container}>
          <View style={styles.nav}>
            <Link
              to="/"
              style={styles.navItem}>
                <Text>Home</Text>
            </Link>
            <Link
              to="/actividades"
              style={styles.navItem}>
                <Text>Actividades</Text>
            </Link>
          </View>
          <Route exact path="/" component={Home} />
          <Route path="/actividades" component={Actividades} />
        </View>
      </NativeRouter>
    );
  }
}

class Home extends React.Component {
  render() {
    return (
      <View>
        <Text style={styles.header}>Open up App.js to start working on your app!</Text>
        <Text style={styles.header}>Changes you make will automatically reload.</Text>
        <Text style={styles.header}>Shake your phone to open the developer menu.</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10,
  },
  header: {
    fontSize: 20,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  subNavItem: {
    padding: 5,
  },
  topic: {
    textAlign: 'center',
    fontSize: 15,
  }
});
