import React, { Component } from 'react';
import { CardFooter, Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import sygnet from '../../assets/img/brand/sygnet.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class NoAuthFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <Container>
          <Row className="py-4">
            <Col sm={{ size: 'auto', offset: 5 }}>
              <a className="msn-ic" href="mailto:helpoconsultas@helpo.com.ar"><i style={{color:'white'}} className="fa fa-envelope-o fa-lg white-text mr-md-5 mr-3 fa-2x"> </i></a>                  
              <a className="fb-ic" href="https://fb.me/HelpoConsultas"><i style={{color:'white'}} className="fa fa-facebook fa-lg white-text mr-md-5 mr-3 fa-2x"> </i></a>
              <a className="ins-ic" href="https://www.instagram.com/helpoconsultas/"><i style={{color:'white'}} className="fa fa-instagram fa-lg white-text mr-md-5 mr-3 fa-2x"> </i></a>
            </Col>
          </Row>
          <Row>
            <Col sm={{ size: 'auto', offset: 5}}>  
              <p style={{color:'white'}}>
                <a style={{color:'white'}} href="https://www.helpo.com.ar">helpo</a> &copy; Copyright {(new Date().getFullYear())} 
              </p>
            </Col>
          </Row>
        </Container>
      </React.Fragment>    );
  }
}

NoAuthFooter.propTypes = propTypes;
NoAuthFooter.defaultProps = defaultProps;

export default NoAuthFooter;