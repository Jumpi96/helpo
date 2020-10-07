import React, { Component } from 'react';
import { Separator, Text } from 'native-base';
import { Linking, Image, TouchableHighlight, View } from 'react-native';

class CompartirOrganizacion extends Component {

  render() {
    const ong = this.props.ong;
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
              "https%3A%2F%2Fapp.helpo.com.ar%2F%23%2Fredirect%2Fong%3Fid%3D" + ong.id;
            Linking.openURL(url);
          }}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require('../../../Images/facebook.png')}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {
            // Twitter
            var url = "http://twitter.com/share?text=Sumate%20a%20los%20eventos%20de%20" + ong.nombre + "%20en%20Helpo"
              + "&url=https%3A%2F%2Fapp.helpo.com.ar%2F%23%2Fredirect%2Fong%3Fid%3D" +
              ong.id + "&hashtags=Helpo";
            Linking.openURL(url);
          }}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require('../../../Images/twitter.png')}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {
            // Google+
            var url = "https://plus.google.com/share?url=https%3A%2F%2Fapp.helpo.com.ar%2F%23%2Fredirect%2Fong%3Fid%3D" + ong.id;
            Linking.openURL(url);
          }}>
            <Image
              style={{ width: 50, height: 50 }}
              source={require('../../../Images/google.jpg')}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {
            // LinkedIn
            var url = "https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fapp.helpo.com.ar%2F%23%2Fredirect%2Fong%3Fid%3D" +
              ong.id + "&summary=Sumate%20a%20los%20eventos%20de%20" + ong.nombre + "%20en%20Helpo" + "&source=Helpo";
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

export default CompartirOrganizacion;
