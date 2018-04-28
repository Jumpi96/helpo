import React from 'react';
import ReactDOM from 'react-dom';
import RegistroActividad from './RegistroActividad';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RegistroActividad />, div);
  ReactDOM.unmountComponentAtNode(div);
});