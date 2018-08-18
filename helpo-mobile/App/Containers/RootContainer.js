import React, { Component } from 'react'
import { StatusBar } from 'react-native'
import { View, Root, StyleProvider } from 'native-base'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import { loadUser } from '../Redux/actions/auth'
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import StartupActions from '../Redux/StartupRedux'

// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {
  componentDidMount () {
    this.props.startup()
    this.props.loadUser()
  }

  render () {
    return (
      <Root>
        <StyleProvider style={getTheme(material)}>
          <View style={styles.applicationView}>
            <StatusBar barStyle='light-content' />
            <ReduxNavigation />
          </View>
        </StyleProvider>
      </Root>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  loadUser: () => dispatch(loadUser())
})
const mapStateToProps = state => ({ auth: state.auth })

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
