import React from 'react';
import ReactDOM from 'react-dom';
import NoAuthFooter from '../NoAuthFooter';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NoAuthFooter />, div);
  ReactDOM.unmountComponentAtNode(div);
});
