import React from 'react';
import ModificarPerfilEmpresa from './ModificarPerfilEmpresa';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Card } from 'reactstrap'

const requiredProps = {
  id: 1,
  userType: 3,
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
    <ModificarPerfilEmpresa {...requiredProps} />
  );
  const result = renderer.getRenderOutput();    
  expect(result.type).toBe(Card);
});