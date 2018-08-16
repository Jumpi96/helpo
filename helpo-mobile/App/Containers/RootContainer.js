import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import { Root } from 'native-base'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import { loadUser } from '../Redux/actions/auth'
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
        <View style={styles.applicationView}>
          <StatusBar barStyle='light-content' />
          <ReduxNavigation />
        </View>
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
