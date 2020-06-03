import React, { Component } from 'react';
import logo from '../../../assets/img/brand/logo_principal.svg'
import { Button, Card, CardBody, CardGroup, Row } from 'reactstrap';

class FailedPresentation extends Component {
   
    constuctor() {
        this.handlePageChange = this.handlePageChange.bind(this);
      }
  
    handlePageChange() {
      window.location.hash = "/login";
    }

    render() {
        return (
            <div class="container">
                <div class="panel-heading">
                    <div class="panel-title text-center" style={{ margin: '20px' }}>
                        <img src={logo} alt="Helpo" width="150" height="150"></img>
                    </div>
                </div>

                <Row className="justify-content-center">
                    <CardGroup>
                        <Card className="p-5" col-md-6 col-xs-6>
                            <CardBody className="text-center">
                                <h1>¡Gracias por registrarte!</h1>
                                <p className="text-muted">Inicia sesión para comenzar a utilizar Helpo</p>
                                <Button onClick={this.handlePageChange} color="primary" type="submit" className="px-4">Iniciar sesión</Button>
                            </CardBody>
                        </Card>
                    </CardGroup>
                </Row>
            </div>
        );
    }
}

export default FailedPresentation; 