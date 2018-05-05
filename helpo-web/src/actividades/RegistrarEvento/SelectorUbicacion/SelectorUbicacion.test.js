import React from 'react';
import ReactDOM from 'react-dom';
import SelectorUbicacion from './SelectorUbicacion';
import ShallowRenderer from 'react-test-renderer/shallow';

it('renders without crashing', () => {
  const renderer = new ShallowRenderer();
  const ubi = { latitud: 0, longitud: 0, notas: ''};
  const onUbicacionChange = function () {}
  renderer.render(
    <SelectorUbicacion 
      name="selectorUbicacion"
      ubicacion={ubi}
      onUbicacionChange={onUbicacionChange}/>
  );
  const result = renderer.getRenderOutput();
  expect(result.type).toBe('div');
});