import React from "react";
import { StackNavigator } from "react-navigation";
import styles from "./Styles/NavigationStyles";

// screens identified by the router
import NavigationDrawer from "./NavigationDrawer";
import ConsultarColaboraciones from '../Views/Actividades/ConsultarColaboraciones/ConsultarColaboraciones'
import DetalleColaboracion from '../Views/Actividades/ConsultarColaboraciones/ListaColaboraciones/DetalleColaboracion'
import DetalleParticipacion from '../Views/Actividades/ConsultarColaboraciones/ListaVoluntarios/DetalleParticipacion'
import AlbumEvento from '../Views/Actividades/AlbumEvento/AlbumEvento'
import DetalleImagen from '../Views/Actividades/AlbumEvento/DetalleImagen'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
    NavigationDrawer: { screen: NavigationDrawer },
		ConsultarColaboraciones: { screen: ConsultarColaboraciones},
    DetalleColaboracion: {screen: DetalleColaboracion},
    DetalleParticipacion: {screen: DetalleParticipacion},
    AlbumEvento: { screen: AlbumEvento },
    DetalleImagen: { screen: DetalleImagen }
  },
  // Default config for all screens
  {
		initialRouteName: "NavigationDrawer",
		headerMode: "none",
  }
)

export default PrimaryNav
