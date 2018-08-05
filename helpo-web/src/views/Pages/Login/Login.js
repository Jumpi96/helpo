import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { connect } from "react-redux";
import {auth} from "../../../actions";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.login(this.state.email, this.state.password);
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    } else {
      return (
        <form onSubmit={this.onSubmit}>
          <div className="app flex-row align-items-center">
            <Container>
              <Row className="justify-content-center">
                <Col md="8">
                  <CardGroup>
                    <Card className="p-4">
                      <CardBody>
                        <h1>Ingresar</h1>
                        <p className="text-muted">Ingresá con tu cuenta</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" placeholder="Email" 
                            onChange={(e) => this.setState({email: e.target.value})}/>
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="password" placeholder="Contraseña"
                            onChange={(e) => this.setState({password: e.target.value})}/>
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button color="primary" type="submit"
                              className="px-4">Ingresá!</Button>
                          </Col>
                          <Col xs="6" className="text-right">
                            <Button color="link" className="px-0">¿Olvidaste tu contraseña?</Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                    <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                      <CardBody className="text-center">
                        <div>
                          <h2>Registrarse</h2>
                          <p>¿No estás registrado todavía en <strong>helpo</strong>?</p>
                          <Button onClick={() => this.props.history.push('register')} 
                             color="primary">Regístrate!</Button>
                        </div>
                        <br />
                        <div>
                          {this.props.errors.length > 0 && (
                            <div>
                              {this.props.errors.map(error => (
                                <p key={error.field}>{error.message}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </CardGroup>
                </Col>
              </Row>
            </Container>
          </div>
        </form>
      );
    } 
  }
}


const mapStateToProps = state => {
  let errors = [];
  if (state.auth.errors) {
    errors = Object.keys(state.auth.errors).map(field => {
      return {field, message: state.auth.errors[field]};
    });
  }
  return {
    errors,
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);