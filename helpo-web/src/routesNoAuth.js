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

const ConsultarEventosView = Loadable({
  loader: () => import('./views/Actividades/ConsultarEventos/ConsultarEventosView'),
  loading: Loading,
})
 
const OrganizacionesPage = Loadable({
  loader: () => import('./views/Organizaciones/OrganizacionesPage.js'),
  loading: Loading,
})

const ConsultarPerfil = Loadable({
  loader: () => import('./views/Perfiles/ConsultarPerfilGenerico'),
  loading: Loading,
});

const Dashboard = Loadable({
  loader: () => import('./views/Home/HomeNoAuth'),
  loading: Loading,
});


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/noAuth', exact: true, name: 'Home', component: NoAuthLayout },
  { path: '/noAuth/dashboard', name: 'helpo', component: Dashboard },
  { path: '/noAuth/actividades/consultar-eventos', name: 'Consultar eventos', component: ConsultarEventosPage },
  { path: '/noAuth/actividades/consultar-evento/', name: 'Consultar evento', component: ConsultarEventosView },
  { path: '/noAuth/organizaciones', name: 'Organizaciones', component: OrganizacionesPage },
  { path: '/noAuth/perfil/:usuarioId?', name: 'Perfil de usuario', component: ConsultarPerfil }
];

export default routes;
