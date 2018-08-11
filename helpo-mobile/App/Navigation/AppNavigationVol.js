import React from "react";
import { StackNavigator } from "react-navigation";
import styles from "./Styles/NavigationStyles";

// screens identified by the router
import NavigationDrawer from "./NavigationDrawerVol";

// Manifest of possible screens
const PrimaryNav = StackNavigator({
    NavigationDrawer: { screen: NavigationDrawer },
  }, 
  // Default config for all screens
  {
		initialRouteName: "NavigationDrawer",
		headerMode: "none",
  }
)

export default PrimaryNav
