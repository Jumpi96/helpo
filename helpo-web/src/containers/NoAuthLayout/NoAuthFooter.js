import React, { Component } from 'react';
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
        <span><a href="https://coreui.io">CoreUI</a> &copy; 2018 creativeLabs.</span>
      </React.Fragment>
    );
  }
}

NoAuthFooter.propTypes = propTypes;
NoAuthFooter.defaultProps = defaultProps;

export default NoAuthFooter;
