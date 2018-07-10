import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Provider, connect } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import {auth} from "./actions";
import {helpo} from "./reducers";
import thunk from "redux-thunk";

// Styles
import './App.css';
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'
// Containers
import { DefaultLayout } from './containers';
import { NoAuthLayout } from './containers';
// Pages
import { Login, Page404, Page500, Register, ConfirmMail } from './views/Pages';
//ComponentRenderer
import ComponentRenderer from './utils/ComponentRenderer';

// import { renderRoutes } from 'react-router-config';

let store = createStore(helpo, applyMiddleware(thunk));

class RootContainerComponent extends Component {

  componentDidMount() {
    this.props.loadUser();
  }

  PrivateRoute = ({component: ChildComponent, ...rest}) => {
    return <Route {...rest} render={props => {
      if (this.props.auth.isLoading) {
        return <em>Cargando...</em>;
      } else if (!this.props.auth.isAuthenticated) {
        return <Redirect from="/" to="/home" />;
      } else {
        return <ChildComponent {...props} />
      }
    }} />
  }

  render() {
    let {PrivateRoute} = this;
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/home" name="Login Page" component={NoAuthLayout} />
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route exact path="/register" name="Register Page" component={Register} />
          <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} />
          <Route exact path="/prueba" name="PRUEBA" component={ComponentRenderer} />
          <Route path="/confirmMail/:token" name="Confirmar Email" component={ConfirmMail} />
          <PrivateRoute path="/" name="Dashboard" component={DefaultLayout} />
        </Switch>
      </HashRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadUser: () => {
      return dispatch(auth.loadUser());
    }
  }
}

let RootContainer = connect(mapStateToProps, mapDispatchToProps)(RootContainerComponent);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}
