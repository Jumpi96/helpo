import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import { 
  AppFooter,
  AppBreadcrumb,
  AppHeader, 
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react'; 
import NoAuthFooter from './NoAuthFooter';
import NoAuthHeader from './NoAuthHeader';

import { connect } from "react-redux";
import routes from '../../routesNoAuth';
import {auth} from "../../../src/actions";

class NoAuthLayout extends Component {
  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    } else {
      return(
        <div className="app">
          <AppHeader fixed>
            <NoAuthHeader />
          </AppHeader>
          <div className="app-body">
            <AppSidebar fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <AppSidebarNav navConfig={navigation}  {...this.props} />
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              <AppBreadcrumb appRoutes={routes}/>
              <Container fluid>
                <Switch>
                  {routes.map((route, idx) => {
                      return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                          <route.component {...props} />
                        )} />)
                        : (null);
                    },
                  )}
                  <Redirect from="/noAuth/" to="/noAuth/dashboard" />
                </Switch>
              </Container>
            </main>
          </div>
          <AppFooter>
            <NoAuthFooter />
          </AppFooter>
        </div>
      );
    }
  }
}

const navigation = {
  items: [
    {
      name: 'Dashboard',
      url: '/noAuth/dashboard',
      icon: 'icon-speedometer'
    },
    {
      name: 'Eventos',
      url: '/noAuth/actividades/consultar-eventos',
      icon: 'icon-cursor'
    },
  ]
}


const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
}

const mapDispatchToProps = dispatch => {
  return {
    login: (email, password) => {
      return dispatch(auth.login(email, password));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NoAuthLayout);
