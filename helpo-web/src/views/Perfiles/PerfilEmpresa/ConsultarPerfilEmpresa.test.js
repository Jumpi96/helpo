import React from 'react';
import ConsultarPerfilEmpresa from './ConsultarPerfilEmpresa';
import ShallowRenderer from 'react-test-renderer/shallow';
import { Card } from 'reactstrap'

const requiredProps = {
  id: 1,
  userType: 3,
  nombre: 'test',
  email: 'test@test.com',
  data: {
    avatar: {
      id: 1,
      url: 'https://i.imgur.com/cXItNWF.png',
    }
  },
  switchToModificar: () => {},
}

it('renders without crashing', () => {
  const renderer = new ShallowRenderer();
  renderer.render(
    <ConsultarPerfilEmpresa {...requiredProps} />
  );
  const result = renderer.getRenderOutput();    
  expect(result.type).toBe(div);
});