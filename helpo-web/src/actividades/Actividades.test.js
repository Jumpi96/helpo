import React from 'react';
import ReactDOM from 'react-dom';
import Actividades from './Actividades';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Actividades />, div);
  ReactDOM.unmountComponentAtNode(div);
});