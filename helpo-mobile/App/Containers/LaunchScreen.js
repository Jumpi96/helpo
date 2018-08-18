import React, { Component } from 'react'
import { ScrollView, Text, Image, View, ImageBackground } from 'react-native'
import { Button, Text as NBText } from "native-base";
import { helpoImages as Images } from '../Themes'

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {
  render () {
    return (
      <View style={styles.mainContainer}>
        <ImageBackground source={Images.background} style={{width: '100%', height: '100%'}}>

          <ScrollView style={styles.container}>
            <View style={styles.centered}>
              <Image source={Images.launchscreenLogo} style={styles.logo} />
            </View>

            <View style={styles.section} >
              <Image source={Images.ready} />
              <Text style={styles.subText}>
                Uniendo manos
              </Text>
            </View>
            <Button
              style={{ alignSelf: "center" }}
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
            >
              <NBText>¡Vamos!</NBText>
  </Button>
          </ScrollView>
        </ImageBackground>
      </View>
    )
  }
}
