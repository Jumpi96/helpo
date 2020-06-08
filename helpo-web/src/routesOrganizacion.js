import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout/DefaultLayout';

function Loading() {
  return <div className="loader"/>;
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

const AjustesPage = Loadable({
  loader: () => import('./views/Pages/Ajustes/AjustesPage.js'),
  loading: Loading,
});

const ConsultarColaboraciones = Loadable({
  loader: () => import('./views/Actividades/ConsultarColaboraciones/ConsultarColaboraciones'),
  loading: Loading,
})

const AlbumImagenes = Loadable({
  loader: () => import('./views/Actividades/ConsultarEventos/AlbumImagenes/AlbumImagenes'),
  loading: Loading,
})

const ListadoMensajes = Loadable({
  loader: () => import('./views/Actividades/MensajesEvento/ListadoMensajes'),
  loading: Loading,
})

const OrganizacionesPage = Loadable({
  loader: () => import('./views/Organizaciones/OrganizacionesPage.js'),
  loading: Loading,
})

const EmpresasPage = Loadable({
  loader: () => import('./views/Empresas/EmpresasPage.js'),
  loading: Loading,
})

const ConsultarPatrocinadores = Loadable({
  loader: () => import('./views/Actividades/ConsultarPatrocinadores/ConsultarPatrocinadores'),
  loading: Loading,
})

const Dashboard = Loadable({
  loader: () => import('./views/Home/Home'),
  loading: Loading,
});

const DashboardReportes = Loadable({
  loader: () => import('./views/Reportes/DashboardReportes'),
  loading: Loading,
});

const PlanificadorEvento = Loadable({
  loader: () => import('./views/Recomendaciones/PlanificadorEvento'),
  loading: Loading,
});


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Helpo', component: Dashboard },

  /*
  { path: '/actividades/patrocinadores', name: 'Administración de patrocinadores', component: ConsultarPatrocinadores },
  { path: '/empresas', name: 'Empresas', component: EmpresasPage },
  { path: '/planificador', name: 'Planificador', component: PlanificadorEvento },
  { path: '/reportes', name: 'Reportes', component: DashboardReportes },
  */
  { path: '/actividades/evento', name: 'Mis actividades sociales', component: EventoPage },
  { path: '/actividades/consultar-eventos', name: 'Consultar actividades sociales', component: ConsultarEventosPage },
  { path: '/actividades/consultar-evento/', name: 'Consultar actividad social', component: ConsultarEventosView },
  { path: '/actividades/registrar-evento', name: 'Registrar actividad social', component: RegistrarEvento },
  { path: '/actividades/registrar-necesidades', name: 'Registrar necesidades', component: RegistrarNecesidades },
  { path: '/actividades/consultar-colaboraciones', name: 'Consultar Colaboraciones', component: ConsultarColaboraciones },
  { path: '/actividades/mensajes', name: 'Mensajes de evento', component: ListadoMensajes },
  { path: '/actividades/album/:eventoId', name: 'Album de Evento', component: AlbumImagenes },
  { path: '/perfiles/perfil-organizacion', name: 'Perfil organizacion', component: ModificarPerfilOrganizacion },
  { path: '/perfil/:usuarioId', name: 'Perfil de usuario', component: ConsultarPerfil },
  { path: '/perfil/', name: 'Mi perfil', component: ConsultarPerfil },
  { path: '/ajustes/', name: 'Ajustes', component: AjustesPage },
  { path: '/organizaciones', name: 'Organizaciones', component: OrganizacionesPage },
];

export default routes;
