import React from 'react';
import ModificarPerfilOrganizacion from './ModificarPerfilOrganizacion';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Card } from 'reactstrap'

const requiredProps = {
  nombre: 'test',
  email: 'test@test.com',
  data: {
    usuario: 1,
    avatar: {
      id: 1,
      url: 'https://i.imgur.com/cXItNWF.png',
    }
  },
  rubros: [],
  switchToConsultar: () => {}
}

it('renders without crashing', () => {
  const renderer = new ShallowRenderer();
  renderer.render(
    <ModificarPerfilOrganizacion {...requiredProps} />
  );
  const result = renderer.getRenderOutput();    
  expect(result.type).toBe(Card);
});