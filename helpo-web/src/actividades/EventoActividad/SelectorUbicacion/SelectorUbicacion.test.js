import React from 'react';
import ReactDOM from 'react-dom';
import SelectorUbicacion from './SelectorUbicacion';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SelectorUbicacion />, div);
  ReactDOM.unmountComponentAtNode(div);
});