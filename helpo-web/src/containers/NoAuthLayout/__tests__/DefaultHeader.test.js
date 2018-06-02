import React from 'react';
import ReactDOM from 'react-dom';
import NoAuthHeader from '../NoAuthHeader';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NoAuthHeader />, div);
  ReactDOM.unmountComponentAtNode(div);
});
