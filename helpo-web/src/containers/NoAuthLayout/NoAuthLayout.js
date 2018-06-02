import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';

import { 
  AppFooter,
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
              <AppSidebarNav {...this.props} />
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              <Container fluid>
                <h1>Bienvenidos a helpo</h1>
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
