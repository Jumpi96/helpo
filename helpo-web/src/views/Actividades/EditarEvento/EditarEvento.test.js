import React from 'react';
import ReactDOM from 'react-dom';
import EditarEvento from './EditarEvento';
import ShallowRenderer from 'react-test-renderer/shallow';

it('renders without crashing', () => {
  const renderer = new ShallowRenderer();
  renderer.render(
    <EditarEvento />
  );
  const result = renderer.getRenderOutput();
  expect(result.type).toBe('form');
});