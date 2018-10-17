import React, { Component } from 'react';
import {Row, Col, Collapse, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem, Carousel, Card , CardGroup, CardTitle, CardText, Button, CardBody, CardImg, CardSubtitle} from 'reactstrap';
import './HomeNoAuth.css';
import imagen from "../../assets/img/home-noauth-background.jpg";
import imagen1 from "../../assets/img/Empresas.png";
import imagen2 from "../../assets/img/ONG.png";
import imagen3 from "../../assets/img/Voluntarios.png";
import TwitterTimeline from 'react-twitter-embedded-timeline';
import { FacebookProvider, Page } from 'react-facebook';

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
    this.state = { activeIndex: 0, 
      open1: false,
      open2: false,
      open3: false};
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
          <Row style={{ marginRight:'-70px'}}>
            <Col>
              <Button color="primary" onClick={() => this.setState({ open1: !this.state.open1 })} style={{fontSize:'20px', marginTop: '10px', marginBottom: '1rem', height: '150px', width: '400px'}}>¿Quiénes somos?</Button>
              <Collapse isOpen={this.state.open1}>
                <Card style={{width: '400px'}}>
                  <CardBody>
                  Anim pariatur cliche reprehenderit,
                  enim eiusmod high life accusamus terry richardson ad squid. Nihil
                  anim keffiyeh helvetica, craft beer labore wes anderson cred
                  nesciunt sapiente ea proident.
                  </CardBody>
                </Card>
              </Collapse>
            </Col>
            <Col>
              <Button color="primary" onClick={() => this.setState({ open2: !this.state.open2 })} style={{fontSize:'20px', marginTop: '10px', marginBottom: '1rem', height: '150px', width: '400px' }}>¿Qué hacemos?</Button>
              <Collapse isOpen={this.state.open2}>
                <Card style={{width: '400px'}}>
                  <CardBody>
                  Anim pariatur cliche reprehenderit,
                  enim eiusmod high life accusamus terry richardson ad squid. Nihil
                  anim keffiyeh helvetica, craft beer labore wes anderson cred
                  nesciunt sapiente ea proident.
                  </CardBody>
                </Card>
              </Collapse>
            </Col>
            <Col>
              <Button color="primary" onClick={() => this.setState({ open3: !this.state.open3 })} style={{fontSize:'20px', marginTop: '10px', marginBottom: '1rem', height: '150px', width: '400px'}}>¿Cómo participar?</Button>
              <Collapse isOpen={this.state.open3}>
                <Card style={{width: '400px'}}>
                  <CardBody>
                  Anim pariatur cliche reprehenderit,
                  enim eiusmod high life accusamus terry richardson ad squid. Nihil
                  anim keffiyeh helvetica, craft beer labore wes anderson cred
                  nesciunt sapiente ea proident.
                  </CardBody>
                </Card>
              </Collapse>
            </Col>
          </Row>
          <Row>
            <TwitterTimeline loading={"HelpoApp"} user={"HelpoApp"} chrome="noborders noheader" height={500} width={500} />
            <FacebookProvider appId="343119846258901">
              <Page href="https://www.facebook.com/HelpoConsultas" tabs="timeline" height={500} width={500} />
            </FacebookProvider>  
          </Row>
      </React.Fragment>
    );
  }
}

export default Home;
