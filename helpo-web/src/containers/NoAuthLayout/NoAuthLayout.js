import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';

import { 
  AppBreadcrumb,
  AppFooter,
  AppHeader, 
} from '@coreui/react'; 
import NoAuthFooter from './NoAuthFooter';
import NoAuthHeader from './NoAuthHeader';

import { connect } from "react-redux";
import {auth} from "../../../src/actions";

class NoAuthLayout extends Component {
  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/dashboard" />
    } else {
      return(
        <div className="app">
          <AppHeader fixed>
            <NoAuthHeader />
          </AppHeader>
          <div className="app-body">
            <main className="main">
              <AppBreadcrumb/>
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
