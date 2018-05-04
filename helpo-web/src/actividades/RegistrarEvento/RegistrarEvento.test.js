import React from 'react';
import ReactDOM from 'react-dom';
import RegistrarEvento from './RegistrarEvento';
import ShallowRenderer from 'react-test-renderer/shallow';

it('renders without crashing', () => {
  const renderer = new ShallowRenderer();
  renderer.render(
    <RegistrarEvento />
  );
  const result = renderer.getRenderOutput();
  expect(result.type).toBe('form');
});