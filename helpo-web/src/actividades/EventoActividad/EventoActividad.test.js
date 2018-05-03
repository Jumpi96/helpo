import React from 'react';
import ReactDOM from 'react-dom';
import EventoActividad from './EventoActividad';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<EventoActividad />, div);
  ReactDOM.unmountComponentAtNode(div);
});