import React from "react";
import { DrawerNavigator } from "react-navigation";
import LaunchScreen from "../Containers/LaunchScreen";
import DrawerContent from "../Containers/DrawerContent";
import Login from '../Views/Usuarios/Login';
import SignUp from '../Views/Usuarios/SignUp';
import Configuracion from '../Views/Usuarios/Configuracion';

import ListviewExample from "../Containers/ListviewExample";

const NavigationDrawer = DrawerNavigator({
		LaunchScreen: { screen: LaunchScreen },
		Login: { screen: Login },
		SignUp: { screen: SignUp },
		Configuracion: { screen: Configuracion },
		ListviewExample: { screen: ListviewExample },
  },
  {
	initialRouteName: "LaunchScreen",
	contentComponent: props => <DrawerContent {...props} />,
  }
);

export default NavigationDrawer;