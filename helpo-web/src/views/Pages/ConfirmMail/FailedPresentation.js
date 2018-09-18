import React, { Component } from 'react';
import logo from '../../../assets/img/brand/logo_principal.svg'
import { Button, Card, CardBody, CardGroup, Row } from 'reactstrap';

class FailedPresentation extends Component {
    render() {
        return (
            <div class="container">
                <div class="panel-heading">
                    <div class="panel-title text-center">
                        <img src={logo} alt="Helpo" width="150" height="150"></img>
                    </div>
                </div>

                <Row className="justify-content-center">
                    <CardGroup>
                        <Card className="p-5" col-md-6 col-xs-6>
                            <CardBody className="text-center">
                                <h1>¡Gracias por registrarte!</h1>
                                <p className="text-muted">Inicia sesión para comenzar a utilizar Helpo</p>
                                <Button color="primary" type="submit" className="px-4" onClick={() => this.props.history.push('login')}>Iniciar sesión</Button>
                            </CardBody>
                        </Card>
                    </CardGroup>
                </Row>
            </div>
        );
    }
}

export default FailedPresentation; 