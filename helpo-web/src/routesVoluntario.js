import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';

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

const RegistrarColaboraciones = Loadable({
  loader: () => import('./views/Actividades/ConsultarEventos/RegistrarColaboraciones/RegistrarColaboraciones'),
  loading: Loading,
});

const ConsultarPerfil = Loadable({
  loader: () => import('./views/Perfiles/ConsultarPerfilGenerico'),
  loading: Loading,
});

const MisColaboraciones = Loadable({
  loader: () => import('./views/Actividades/MisColaboraciones/EventoPage.js'),
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

const MisSuscripciones = Loadable({
  loader: () => import('./views/Suscripcion/MisSuscripciones/MisSuscripciones'),
  loading: Loading,
})

const AlbumImagenes = Loadable({
  loader: () => import('./views/Actividades/ConsultarEventos/AlbumImagenes/AlbumImagenes'),
  loading: Loading,
})


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'helpo', component: Dashboard },
  { path: '/actividades/consultar-eventos', name: 'Consultar actividades sociales', component: ConsultarEventosPage },
  { path: '/actividades/consultar-evento/', name: 'Consultar evento', component: ConsultarEventosView },
  { path: '/actividades/registrar-colaboraciones', name: 'Registrar colaboraciones', component: RegistrarColaboraciones },
  { path: '/actividades/mis-colaboraciones', name: 'Mis colaboraciones', component: MisColaboraciones },
  { path: '/actividades/album/:eventoId', name: 'Album de Evento', component: AlbumImagenes },
  { path: '/perfil/:usuarioId', name: 'Perfil de usuario', component: ConsultarPerfil },
  { path: '/perfil/', name: 'Mi perfil', component: ConsultarPerfil },
  { path: '/organizaciones', name: 'Organizaciones', component: OrganizacionesPage },
  { path: '/suscripciones', name: 'Mis suscripciones', component: MisSuscripciones }
];

export default routes;
