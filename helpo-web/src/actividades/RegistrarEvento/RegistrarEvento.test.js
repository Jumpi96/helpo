import React from 'react';
import ReactDOM from 'react-dom';
import RegistrarEvento from './RegistrarEvento';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RegistrarEvento />, div);
  ReactDOM.unmountComponentAtNode(div);
});