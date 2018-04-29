import React from 'react';
import ReactDOM from 'react-dom';
import ListaOrganizaciones from './ListaOrganizaciones';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const organizaciones = [
    {
        id: 1,
        nombre: 'Patitas de perro'
    },
    {
        id: 2,
        nombre: 'Cáritas'
    }
  ];
  const org = 'Patitas de perro';
  ReactDOM.render(<ListaOrganizaciones name="listaOrganizaciones"
    organizacion={org}
    organizaciones={organizaciones}
    />, div);
  ReactDOM.unmountComponentAtNode(div);
});