import React from "react";
import { DrawerNavigator } from "react-navigation";
import ListviewExample from "../Containers/ListviewExample";
import LaunchScreen from "../Containers/LaunchScreen";
import DrawerContent from "../Containers/DrawerContent";
import MisEventos from "../Views/Actividades/MisEventos/MisEventos";

const NavigationDrawer = DrawerNavigator({
		LaunchScreen: { screen: LaunchScreen },
		ListviewExample: { screen: ListviewExample },
		MisEventos: { screen: MisEventos },
  },
  {
	initialRouteName: "LaunchScreen",
	contentComponent: props => <DrawerContent {...props} />,
  }
);

export default NavigationDrawer;