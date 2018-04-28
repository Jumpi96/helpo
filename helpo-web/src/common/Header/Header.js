import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
  render(){
    return (
      <header className="App-header">
        <img src={this.props.logo} className="App-logo" alt="logo" />
        <h2 className="App-intro">We don't have a logo.</h2>
        <h1 className="App-title">Welcome to helpo</h1>
      </header>
    );
  }
}

export default Header;