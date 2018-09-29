import React from 'react';
import ModificarPerfilVoluntario from './ModificarPerfilVoluntario';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Card } from 'reactstrap'

const requiredProps = {
  id: 1,
  userType: 2,
  nombre: 'test',
  email: 'test@test.com',
  data: {
    usuario: 1,
    avatar: {
      id: 1,
      url: 'https://i.imgur.com/cXItNWF.png',
    }
  },
  switchToConsultar: () => {}
}

it('renders without crashing', () => {
  const renderer = new ShallowRenderer();
  renderer.render(
    <ModificarPerfilVoluntario {...requiredProps} />
  );
  const result = renderer.getRenderOutput();    
  expect(result.type).toBe(Card);
});