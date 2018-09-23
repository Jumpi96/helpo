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

const RegistrarOfrecimientos = Loadable({
  loader: () => import('./views/Actividades/RegistrarOfrecimientos/RegistrarOfrecimientos'),
  loading: Loading,
});

const MisPropuestas = Loadable({
  loader: () => import('./views/Actividades/MisPropuestas/EventoPage.js'),
  loading: Loading,
})

const OrganizacionesPage = Loadable({
  loader: () => import('./views/Organizaciones/OrganizacionesPage.js'),
  loading: Loading,
})

const Dashboard = Loadable({
  loader: () => import('./views/Home/Home'),
  loading: Loading,
});

const AlbumImagenes = Loadable({
  loader: () => import('./views/Actividades/ConsultarEventos/AlbumImagenes/AlbumImagenes'),
  loading: Loading,
})


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'helpo', component: Dashboard },
  { path: '/actividades/consultar-eventos', name: 'Consultar eventos', component: ConsultarEventosPage },
  { path: '/actividades/consultar-evento/', name: 'Consultar evento', component: ConsultarEventosView },
  { path: '/perfiles/perfil-empresa', name: 'Perfil empresa', component: ModificarPerfilEmpresa },
  { path: '/actividades/registrar-colaboraciones', name: 'Registrar ofrecimiento', component: RegistrarOfrecimientos },
  { path: '/actividades/mis-propuestas', name: 'Mis propuestas', component: MisPropuestas },
  { path: '/actividades/album/:eventoId', name: 'Album de Evento', component: AlbumImagenes },
  { path: '/perfil/:usuarioId?', name: 'Perfil de usuario', component: ConsultarPerfil },
  { path: '/organizaciones', name: 'Organizaciones', component: OrganizacionesPage },
];

export default routes;
