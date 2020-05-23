import React, { Component } from 'react';
import { Row, Col, Collapse, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem, Carousel, Card, Button, CardBody } from 'reactstrap';
import './HomeNoAuth.css';
import imagen from "../../assets/img/home-noauth-background.jpg";
import imagen2 from "../../assets/img/foto_celular.jpg";
import imagen3 from "../../assets/img/organizaciones.jpg";
import imagen4 from "../../assets/img/empresas.jpg";
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
  },
  {
    src: imagen4
  }

];

class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      activeIndex: 0,
      open1: false,
      open2: false,
      open3: false
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
              <Col>
                <Button color="primary" onClick={() => this.setState({ open1: !this.state.open1 })} style={{ fontSize: '20px', marginTop: '10px', marginBottom: '1rem', height: '150px', width: '100%' }}>¿Quiénes somos?</Button>
                <Collapse isOpen={this.state.open1}>
                  <Card style={{ width: '100%', textAlign: 'center' }}>
                    <CardBody>
                      Helpo es una plataforma orientada a vincular organizaciones sin fines de lucro,
                      voluntarios y empresas. Nuestro objetivo es incrementar el flujo de recursos de las
                      organizaciones, brindar oportunidades para colaborar y adquirir experiencia a
                      voluntarios y maxizimizar la visibilidad de las empresas.
                  </CardBody>
                  </Card>
                </Collapse>
              </Col>
              <Col>
                <Button color="primary" onClick={() => this.setState({ open2: !this.state.open2 })} style={{ fontSize: '20px', marginTop: '10px', marginBottom: '1rem', height: '150px', width: '100%' }}>¿Qué hacemos?</Button>
                <Collapse isOpen={this.state.open2}>
                  <Card style={{ width: '100%', textAlign: 'center' }}>
                    <CardBody>
                      Permitimos que las organizaciones sin fines de lucro registren sus actividades sociales a fin
                      de que voluntarios y empresas puedan conocerlas y colaborar, ya sea donando o participando
                      en los eventos o campañas.
                  </CardBody>
                  </Card>
                </Collapse>
              </Col>
              <Col>
                <Button color="primary" onClick={() => this.setState({ open3: !this.state.open3 })} style={{ fontSize: '20px', marginTop: '10px', marginBottom: '1rem', height: '150px', width: '100%' }}>¿Cómo participar?</Button>
                <Collapse isOpen={this.state.open3}>
                  <Card style={{ width: '100%', textAlign: 'center' }}>
                    <CardBody>
                      Si sos una organización sin fines de lucro, una persona interesada en adquirir
                      experiencia en voluntariado o una empresa que desea realizar voluntariado corporativo,
                      registrate en nuestra plataforma y conocé nuestras soluciones
                  </CardBody>
                  </Card>
                </Collapse>
              </Col>
            </Row>
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
