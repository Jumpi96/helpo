const React = require('react-native');
const { Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
    container: {
      flex: 1,
      padding: 0,
      backgroundColor: '#fff'
    },
    logo: {
      width: 260,
      resizeMode: 'contain'
    },
    drawerCover: {
      alignSelf: 'stretch',
      // resizeMode: 'cover',
      height: deviceHeight / 3.5,
      width: null,
      position: 'relative',
      marginBottom: 10,
    },
  }