import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout/DefaultLayout';

function Loading() {
  return <div>Cargando...</div>;
}

const RegistrarEvento = Loadable({
  loader: () => import('./views/Actividades/RegistrarEvento/RegistrarEvento'),
  loading: Loading,
});

const EventoPage = Loadable({
  loader: () => import('./views/Actividades/Eventos/EventoPage'),
  loading: Loading,
})

const ConsultarEventosPage = Loadable({
  loader: () => import('./views/Actividades/ConsultarEventos/ConsultarEventosPage'),
  loading: Loading,
})

const ConsultarEventosView = Loadable({
  loader: () => import('./views/Actividades/ConsultarEventos/ConsultarEventosView'),
  loading: Loading,
})

const RegistrarNecesidades = Loadable({
  loader: () => import('./views/Actividades/RegistrarNecesidades/RegistrarNecesidades'),
  loading: Loading,
});

const ModificarPerfilOrganizacion = Loadable({
  loader: () => import('./views/Perfiles/PerfilOrganizacion/ModificarPerfilOrganizacion'),
  loading: Loading,
});

const ConsultarPerfil = Loadable({
  loader: () => import('./views/Perfiles/ConsultarPerfilGenerico'),
  loading: Loading,
});

const ConsultarColaboraciones = Loadable({
  loader: () => import('./views/Actividades/ConsultarColaboraciones/ConsultarColaboraciones'),
  loading: Loading,
})

const Dashboard = Loadable({
  loader: () => import('./views/Home/Home'),
  loading: Loading,
});


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'helpo', component: Dashboard },

  { path: '/actividades/evento', name: 'Mis eventos', component: EventoPage },
  { path: '/actividades/consultar-eventos', name: 'Consultar eventos', component: ConsultarEventosPage },
  { path: '/actividades/consultar-evento/', name: 'Consultar evento', component: ConsultarEventosView },
  { path: '/actividades/registrar-evento', name: 'Registrar evento', component: RegistrarEvento },
  { path: '/actividades/registrar-necesidades', name: 'Registrar necesidades', component: RegistrarNecesidades },
  { path: '/actividades/consultar-colaboraciones/:eventoId', name: 'Consultar Colaboraciones', component: ConsultarColaboraciones },
  { path: '/perfiles/perfil-organizacion', name: 'Perfil organizacion', component: ModificarPerfilOrganizacion },
  { path: '/perfil/:usuarioId?', name: 'Perfil de usuario', component: ConsultarPerfil }
];

export default routes;
