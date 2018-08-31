import React, { Component } from 'react';
import { Separator, Text } from 'native-base';
import { Linking, Image, TouchableHighlight, View } from 'react-native';

class CompartirEvento extends Component {

  render() {
    const evento = this.props.evento;
    return (
      <View>
        <Separator bordered noTopBorder>
          <Text>Compartir</Text>
        </Separator>
        <View style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
          <TouchableHighlight onPress={() => {
            // Facebook
            var url = "https://www.facebook.com/sharer/sharer.php?u=" +
              "https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Fredirect%2Fevento%3Fid%3D" + evento.id;
            Linking.openURL(url);
          }}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require('../../../Images/facebook.png')}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {
            // Twitter
            var url = "http://twitter.com/share?text=Sumate%20a%20este%20evento%20en%20Helpo%3A%20" +
              evento.nombre + "&url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Fredirect%2Fevento%3Fid%3D" +
              evento.id + "&hashtags=Helpo";
            Linking.openURL(url);
          }}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require('../../../Images/twitter.png')}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {
            // Google+
            var url = "https://plus.google.com/share?url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Fredirect%2Fevento%3Fid%3D" + evento.id;
            Linking.openURL(url);
          }}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require('../../../Images/google.jpg')}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {
            // LinkedIn
            var url = "https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Fredirect%2Fevento%3Fid%3D" +
              evento.id + "&summary=Sumate%20a%20este%20evento%20en%20Helpo%3A%20" + evento.nombre + "&source=Helpo";
            Linking.openURL(url);
          }}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require('../../../Images/linkedin.png')}
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default CompartirEvento;
