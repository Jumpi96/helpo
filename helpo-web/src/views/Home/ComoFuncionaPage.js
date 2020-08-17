import React, { Component } from 'react';
import { Row, Col, Collapse, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem, Carousel, Card, Button, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import './ComoFuncionaPage.css';
import imagenComoFuncionaVoluntario from "../../assets/img/home-como-funciona-converted.jpg";
import imagenComoFuncionaONG from "../../assets/img/home-como-funciona-ong-converted.jpg";
import createFacadeUrl from '../../utils/AppsRouterHelper';
import { Redirect } from 'react-router-dom';


class Home extends Component {
  renderModal(showComoFunciona) {
    let comoFunciona = showComoFunciona === 'ONG' ? imagenComoFuncionaONG : imagenComoFuncionaVoluntario;
    return (
      <Modal isOpen={showComoFunciona} className="modalComoFunciona">
        <ModalHeader><span class="close" onClick={() => this.props.history.push({ pathname: '/' })}>&times;</span></ModalHeader>
        <ModalBody>
          <img id="myImg" class="modalContent" src={comoFunciona} />
          <div id="myModal" class="modal">
            <img class="modal-content" id="img01" />
          </div>
        </ModalBody>
      </Modal>
    )
  }

  render() {
    const params = this.props.match.params;
    if (params.userType) {
      return (
        <React.Fragment>
          <Card>
            <CardBody>
              {this.renderModal(params.userType)}
            </CardBody>
          </Card>
        </React.Fragment>
      );
    } else {
      return (
        <Redirect to="/" />
      );
    }
  }
}

export default Home;
