import React from 'react';
import Loadable from 'react-loadable'

import NoAuthLayout from './containers/NoAuthLayout';

function Loading() {
  return <div>Cargando...</div>;
}

const ConsultarEventosPage = Loadable({
  loader: () => import('./views/Actividades/ConsultarEventos/ConsultarEventosPage.js'),
  loading: Loading,
})

const Dashboard = Loadable({
  loader: () => import('./views/Home/HomeNoAuth'),
  loading: Loading,
});


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/noAuth', exact: true, name: 'Home', component: NoAuthLayout },
  { path: '/noAuth/dashboard', name: 'helpo', component: Dashboard },

  { path: '/noAuth/actividades/consultar-eventos', name: 'Consultar eventos', component: ConsultarEventosPage },

];

export default routes;
