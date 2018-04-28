import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from './HeaderCSS';

class Header extends Component {
  render(){
    return (
      <View style={styles.appHeader}>
        <Text style={styles.appIntro}>We don't have a logo.</Text>
        <Text style={styles.appTitle}>Welcome to helpo</Text>
      </View>
    );
  }
}

export default Header;