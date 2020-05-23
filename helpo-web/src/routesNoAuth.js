import React from 'react';
import Loadable from 'react-loadable'

import NoAuthLayout from './containers/NoAuthLayout';

function Loading() {
  return <div className="loader"/>;
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

const PageTyC = Loadable({
  loader: () => import('./views/Pages/PageTyC/PageTyC.js'),
  loading: Loading,
})

const EmpresasPage = Loadable({
  loader: () => import('./views/Empresas/EmpresasPage.js'),
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

const AlbumImagenes = Loadable({
  loader: () => import('./views/Actividades/ConsultarEventos/AlbumImagenes/AlbumImagenes'),
  loading: Loading,
})


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/noAuth', exact: true, name: 'Home', component: NoAuthLayout },
  { path: '/noAuth/dashboard', name: 'helpo', component: Dashboard },
  { path: '/noAuth/organizaciones', name: 'Organizaciones', component: OrganizacionesPage },
  { path: '/noAuth/tyc', name: 'Términos y condiciones', component: PageTyC },
  { path: '/noAuth/perfil/:usuarioId?', name: 'Perfil de usuario', component: ConsultarPerfil }
  //{ path: '/noAuth/actividades/consultar-eventos', name: 'Consultar actividades sociales', component: ConsultarEventosPage },
  //{ path: '/noAuth/actividades/consultar-evento/', name: 'Consultar actividad social', component: ConsultarEventosView },
  //{ path: '/noAuth/actividades/album/:eventoId', name: 'Album de Evento', component: AlbumImagenes },
  // { path: '/noAuth/empresas', name: 'Empresas', component: EmpresasPage },
  
];

export default routes;
