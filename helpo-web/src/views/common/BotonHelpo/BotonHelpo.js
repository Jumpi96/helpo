
import React from 'react';
import { Tooltip } from 'reactstrap';
import './BotonHelpo.css';

export default class BotonHelpo extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false
    };
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  render() {
    return (
      <div>
        <button className="btn btn-warning" id="btnHelpo" disabled={this.props.disabled} onClick={this.props.onClick}>
          <i className="icon-helpo"></i>{this.props.titulo}
        </button>
        <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="btnHelpo" toggle={this.toggle}>
          {this.props.mensaje}
        </Tooltip>
      </div>
    );
  }
}