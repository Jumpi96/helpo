import { StackNavigator } from 'react-navigation'
import MiScreen from '../Containers/MiScreen'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  MiScreen: { screen: MiScreen },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'MiScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
