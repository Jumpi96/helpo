import React, { Component } from 'react';
import { Row, Col, Collapse, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem, Carousel, Card, Button, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap';
import './HomeNoAuth.css';
import imagen from "../../assets/img/home-noauth-background-converted.jpg";
import imagen2 from "../../assets/img/voluntario-converted.jpg";
import imagen3 from "../../assets/img/organizaciones-converted.jpg";
import imagenComoFuncionaVoluntario from "../../assets/img/home-como-funciona-converted.jpg";
import imagenComoFuncionaONG from "../../assets/img/home-como-funciona-ong-converted.jpg";
// import TwitterTimeline from 'react-twitter-embedded-timeline';
// import { FacebookProvider, Page } from 'react-facebook';

const items = [
  {
    src: imagen,
  },
  {
    src: imagen2,
  },
  {
    src: imagen3,
  }
];

class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      activeIndex: 0,
      open1: false,
      open2: false,
      open3: false,
      open4: false,
      showComoFunciona: false
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle(num) {
    if (num === 1) {
      this.setState({ collapse1: !this.state.collapse1 });
    }
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  renderModal() {
    if (this.state.showComoFunciona) {
      let comoFunciona = this.state.showComoFunciona === 'ONG' ? imagenComoFuncionaONG : imagenComoFuncionaVoluntario;
      return (
        <Modal isOpen={this.state.showComoFunciona} className="modalComoFunciona">
          <ModalHeader><span class="close" onClick={() => this.setState({ showComoFunciona: false })}>&times;</span></ModalHeader>
          <ModalBody>
            <img id="myImg" class="modalContent" src={comoFunciona} />
            <div id="myModal" class="modal">
              <img class="modal-content" id="img01" />
            </div>
          </ModalBody>
        </Modal>
      )
    }
  }

  render() {
    const { activeIndex } = this.state;

    const slides = items.map((item) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.src}
        >
          <img width="100%" height="100%" src={item.src} alt={item.altText} />
          <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
        </CarouselItem>
      );
    });

    return (
      <React.Fragment>
        <Card>
          <CardBody>
            <Carousel
              activeIndex={activeIndex}
              next={this.next}
              previous={this.previous}
            >
              <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
              {slides}
              <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
              <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
            </Carousel>
            <Row >
              <Col md="3" sm="12">
                <Button color="primary" onClick={() => this.setState({ open1: !this.state.open1 })} style={{ fontSize: '20px', marginTop: '10px', marginBottom: '1rem', height: '5em', width: '100%' }}>Sobre nosotros</Button>
                <Collapse isOpen={this.state.open1}>
                  <Card style={{ width: '100%', textAlign: 'center' }}>
                    <CardBody>
                      <p>Somos un grupo de jóvenes emprendedores independientes que decidimos combinar nuestras habilidades para crear una plataforma, que genere lazos entre diferentes actores de la comunidad para contribuir a construir una sociedad más justa y homogénea. </p>
                    </CardBody>
                  </Card>
                </Collapse>
              </Col>
              <Col md="3" sm="12">
                <Button color="primary" onClick={() => this.setState({ open2: !this.state.open2 })} style={{ fontSize: '20px', marginTop: '10px', marginBottom: '1rem', height: '5em', width: '100%' }}>Misión</Button>
                <Collapse isOpen={this.state.open2}>
                  <Card style={{ width: '100%', textAlign: 'center' }}>
                    <CardBody>
                      <p>"Fomentar las actividades de voluntariado, facilitando la vinculación entre organizaciones sin fines de lucro y entidades públicas con voluntarios, a través de una plataforma de acceso público y gratuito."</p>
                    </CardBody>
                  </Card>
                </Collapse>
              </Col>
              <Col md="3" sm="12">
                <Button color="primary" onClick={() => this.setState({ open3: !this.state.open3 })} style={{ fontSize: '20px', marginTop: '10px', marginBottom: '1rem', height: '5em', width: '100%' }}>Visión</Button>
                <Collapse isOpen={this.state.open3}>
                  <Card style={{ width: '100%', textAlign: 'center' }}>
                    <CardBody>
                      <p>"Ser la plataforma líder del país en soluciones de vinculación entre entidades y voluntarios, favoreciendo conexiones que trasciendan la vida comunitaria y la realidad sociocultural en la que se encuentran inmersas."</p>
                    </CardBody>
                  </Card>
                </Collapse>
              </Col>
              <Col md="3" sm="12">
                <Button color="primary" onClick={() => this.setState({ open4: !this.state.open4 })} style={{ fontSize: '20px', marginTop: '10px', marginBottom: '1rem', height: '5em', width: '100%' }}>Valores</Button>
                <Collapse isOpen={this.state.open4}>
                  <Card style={{ width: '100%', textAlign: 'center' }}>
                    <CardBody>
                      <p><strong>Empatía</strong><br />Hacemos Helpo <strong>para</strong> otros.</p>
                      <p><strong>Co-Elaboración</strong><br />No es suficiente hacer para otros, sino especialmente <strong>con</strong> otros.</p>
                      <p><strong>Impacto social</strong><br />Trabajamos para lograr una sociedad más <strong>justa</strong> y <strong>homogénea</strong></p>
                    </CardBody>
                  </Card>
                </Collapse>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <Button color="primary" onClick={() => this.setState({ showComoFunciona: 'Voluntario' })} style={{ fontSize: '20px', marginTop: '10px', marginBottom: '1rem', height: '5em', width: '100%' }}>Cómo colaboro como voluntario</Button>
              </Col>
              <Col md="6">
                <Button color="primary" onClick={() => this.setState({ showComoFunciona: 'ONG' })} style={{ fontSize: '20px', marginTop: '10px', marginBottom: '1rem', height: '5em', width: '100%' }}>Cómo participo como ONG</Button>
              </Col>
            </Row>
            {this.renderModal()}
            {/* TODO: Add new Twitter and FB timelines/feeds
            <Row>
              <div className="col-md-4">
                <Card><CardBody>
                  <TwitterTimeline loading={"HelpoApp"} user={"HelpoApp"} height={'500px'} width={'100%'} chrome="noborders noheader" />
                </CardBody></Card>
              </div>
              <div className="col-md-4 offset-md-4">
                <Card><CardBody>
                  <FacebookProvider appId="343119846258901">
                    <Page href="https://www.facebook.com/helpo.oficial" tabs="timeline" height={500} />
                  </FacebookProvider>
                </CardBody></Card>
              </div>
            </Row> */}
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}

export default Home;
