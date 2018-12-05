const React = require('react-native');
const { Dimensions } = React;
const deviceWidth = Dimensions.get('window').width;

export default {
  container: {
    backgroundColor: "#FFF"
  },
  validationMessage: {
    color: '#ff0000',
    marginTop: 5,
    marginLeft: 20,
    marginBottom: 2.5,
  },
  horariosPicker: {
    width: deviceWidth/3
  },
  labelPicker: {
    marginTop: 12
  }
};
