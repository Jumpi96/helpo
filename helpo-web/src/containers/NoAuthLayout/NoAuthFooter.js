import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

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
              <a target="_blank" rel="noopener noreferrer" className="msn-ic" href="mailto:consultas@helpo.com.ar"><i style={{color:'white'}} className="fa fa-envelope-o fa-lg white-text mr-md-5 mr-3 fa-2x"> </i></a>                  
              <a target="_blank" rel="noopener noreferrer" className="fb-ic" href="https://fb.me/helpo.oficial"><i style={{color:'white'}} className="fa fa-facebook fa-lg white-text mr-md-5 mr-3 fa-2x"> </i></a>
              <a target="_blank" rel="noopener noreferrer" className="ins-ic" href="https://www.instagram.com/helpo.oficial/"><i style={{color:'white'}} className="fa fa-instagram fa-lg white-text mr-md-5 mr-3 fa-2x"> </i></a>
            </Col>
          </Row>
          <Row>
            <Col sm={{ size: 'auto', offset: 5}}>  
              <p style={{color:'white'}}>
                <a style={{color:'white'}} href="https://www.helpo.com.ar">Helpo</a> &copy; Copyright {(new Date().getFullYear())} 
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