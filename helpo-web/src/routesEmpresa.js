import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout/DefaultLayout';

function Loading() {
  return <div>Cargando...</div>;
}

const ConsultarEventosPage = Loadable({
  loader: () => import('./views/Actividades/ConsultarEventos/ConsultarEventosPage'),
  loading: Loading,
})

const ConsultarEventosView = Loadable({
  loader: () => import('./views/Actividades/ConsultarEventos/ConsultarEventosView'),
  loading: Loading,
})

const ModificarPerfilEmpresa = Loadable({
  loader: () => import('./views/Perfiles/PerfilEmpresa/ModificarPerfilEmpresa'),
  loading: Loading,
});

const ConsultarPerfil = Loadable({
  loader: () => import('./views/Perfiles/ConsultarPerfilGenerico'),
  loading: Loading,
});

const Dashboard = Loadable({
  loader: () => import('./views/Home/Home'),
  loading: Loading,
});


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'helpo', component: Dashboard },

  { path: '/actividades/consultar-eventos', name: 'Consultar eventos', component: ConsultarEventosPage },
  { path: '/actividades/consultar-evento/', name: 'Consultar evento', component: ConsultarEventosView },
  { path: '/perfiles/perfil-empresa', name: 'Perfil empresa', component: ModificarPerfilEmpresa },
  { path: '/perfil/:usuarioId?', name: 'Perfil de usuario', component: ConsultarPerfil }
];

export default routes;