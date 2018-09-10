import React from "react";
import { DrawerNavigator } from "react-navigation";
import LaunchScreen from "../Containers/LaunchScreen";
import DrawerContent from "../Containers/DrawerContent";
import Login from '../Views/Usuarios/Login';
import SignUp from '../Views/Usuarios/SignUp';
import Configuracion from '../Views/Usuarios/Configuracion';
import ConsultarEventos from '../Views/Actividades/ConsultarEventos/ConsultarEventos';
import ConsultarEvento from '../Views/Actividades/ConsultarEventos/ConsultarEvento';
import RegistrarEvento from '../Views/Actividades/RegistrarEvento/RegistrarEvento';
import RegistrarNecesidades from '../Views/Actividades/RegistrarNecesidades/RegistrarNecesidades';
import MisEventos from '../Views/Actividades/MisEventos/MisEventos';
import VerEvento from '../Views/Actividades/VerEvento/VerEvento';
import EditarEvento from '../Views/Actividades/EditarEvento/EditarEvento';	
import MisColaboraciones from '../Views/Actividades/MisColaboraciones/MisColaboraciones';
import VerColaboracionesEvento from '../Views/Actividades/MisColaboraciones/VerColaboracionesEvento';
import RegistrarColaboraciones from '../Views/Actividades/RegistrarColaboraciones/RegistrarColaboraciones';
import AgregarColaboracion from '../Views/Actividades/RegistrarColaboraciones/AgregarColaboracion';
import ComentarEvento from '../Views/Actividades/ComentarEvento/ComentarEvento';
import FiltroEventos from '../Views/Actividades/ConsultarEventos/FiltroEventos/FiltroEventos';
import MensajesEvento from '../Views/Actividades/MensajesEvento/MensajesEvento';
import NuevoMensaje from '../Views/Actividades/MensajesEvento/NuevoMensaje';
import OrganizacionesPage from '../Views/Organizaciones/OrganizacionesPage';
import AgregarOfrecimiento from "../Views/Actividades/RegistrarOfrecimiento/AgregarOfrecimiento";
import RegistrarOfrecimiento from "../Views/Actividades/RegistrarOfrecimiento/RegistrarOfrecimiento";
import MisPropuestas from '../Views/Actividades/MisPropuestas/MisPropuestas';
import VerPropuestaEvento from '../Views/Actividades/MisPropuestas/VerPropuestaEvento';

 
const NavigationDrawer = DrawerNavigator({
	LaunchScreen: { screen: LaunchScreen },
	Login: { screen: Login },
	SignUp: { screen: SignUp },
	Configuracion: { screen: Configuracion },
	ConsultarEventos: { screen: ConsultarEventos },
	ConsultarEvento: { screen: ConsultarEvento },
	RegistrarColaboraciones: { screen: RegistrarColaboraciones },
	AgregarColaboracion: { screen: AgregarColaboracion },
	RegistrarEvento: { screen: RegistrarEvento },
	RegistrarNecesidades: { screen: RegistrarNecesidades },
	MisEventos: { screen: MisEventos },
	VerEvento: { screen: VerEvento },
	EditarEvento: { screen: EditarEvento },
	MisColaboraciones: { screen: MisColaboraciones },
	VerColaboracionesEvento: { screen: VerColaboracionesEvento },
	ComentarEvento: { screen: ComentarEvento },
	FiltroEventos: { screen: FiltroEventos },
	MensajesEvento: { screen: MensajesEvento },
	NuevoMensaje: { screen: NuevoMensaje },
	OrganizacionesPage: { screen: OrganizacionesPage },
	AgregarOfrecimiento: { screen: AgregarOfrecimiento },
	RegistrarOfrecimiento: { screen: RegistrarOfrecimiento },
	MisPropuestas: { screen: MisPropuestas },
	VerPropuestaEvento: { screen: VerPropuestaEvento }
  },
  {
	initialRouteName: "LaunchScreen",
	contentComponent: props => <DrawerContent {...props} />,
  }
);

export default NavigationDrawer;