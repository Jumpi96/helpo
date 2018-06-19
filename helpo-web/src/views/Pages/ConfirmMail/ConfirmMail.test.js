import React from 'react';
import ReactDOM from 'react-dom';
import ConfirMail from './ConfirmMail';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ConfirMail />, div);
  ReactDOM.unmountComponentAtNode(div);
});
