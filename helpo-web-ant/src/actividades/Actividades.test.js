import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Actividades from './Actividades';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Router>
      <Actividades />
    </Router>
  , div);
  ReactDOM.unmountComponentAtNode(div);
});