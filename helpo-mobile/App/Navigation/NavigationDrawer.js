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
 
const NavigationDrawer = DrawerNavigator({
		LaunchScreen: { screen: LaunchScreen },
		Login: { screen: Login },
		SignUp: { screen: SignUp },
		Configuracion: { screen: Configuracion },
		ConsultarEventos: { screen: ConsultarEventos },
		ConsultarEvento: { screen: ConsultarEvento },
		RegistrarEvento: { screen: RegistrarEvento },
		RegistrarNecesidades: { screen: RegistrarNecesidades },
		MisEventos: { screen: MisEventos },
		VerEvento: { screen: VerEvento },
		EditarEvento: { screen: EditarEvento }
  },
  {
	initialRouteName: "LaunchScreen",
	contentComponent: props => <DrawerContent {...props} />,
  }
);

export default NavigationDrawer;