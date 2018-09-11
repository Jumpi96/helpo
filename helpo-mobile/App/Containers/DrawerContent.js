import React, { Component } from "react";
import { ScrollView, Image, BackHandler } from "react-native";
import { List, ListItem, Text, View, Content } from "native-base";
import { connect } from 'react-redux' 

import styles from "./Styles/DrawerContentStyles";
import { helpoImages as Images } from "../Themes";

const itemsNoAuth = [
	{
		'key': 'LaunchScreen',
		'routeName': 'LaunchScreen',
		'name': 'Home'
	},
	{
		'key': 'Login',
		'routeName': 'Login',
		'name': 'Iniciar sesión'
	},
	{
		'key': 'SignUp',
		'routeName': 'SignUp',
		'name': 'Registrarse'
	}
]

const itemsOrg = [
	{
	  'key': 'LaunchScreen',
	  'routeName': 'LaunchScreen',
	  'name': 'Home'
	},
	{
	  'key': 'ConsultarEventos',
	  'routeName': 'ConsultarEventos',
	  'name': 'Eventos',
	},
	{
		'key': 'OrganizacionesPage',
		'routeName': 'OrganizacionesPage',
		'name': 'Organizaciones'
	},
	{
	  'key': 'RegistrarEvento',
	  'routeName': 'RegistrarEvento',
	  'name': 'Nuevo evento',
	},
	{
	  'key': 'MisEventos',
	  'routeName': 'MisEventos',
	  'name': 'Mis eventos',
	},
	{
		'key': 'ConsultarPerfilGenerico',
		'routeName': 'ConsultarPerfilGenerico',
		'name': 'Mi perfil'
	},
	{
	  'key': 'Configuracion',
	  'routeName': 'Configuracion',
	  'name': 'Configuración'
	}
]

const itemsVol = [
	{
		'key': 'LaunchScreen',
		'routeName': 'LaunchScreen',
		'name': 'Home'
	},
	{
		'key': 'ConsultarEventos',
		'routeName': 'ConsultarEventos',
		'name': 'Eventos'
	},
	{
		'key': 'OrganizacionesPage',
		'routeName': 'OrganizacionesPage',
		'name': 'Organizaciones'
	},
	{
		'key': 'MisColaboraciones',
		'routeName': 'MisColaboraciones',
		'name': 'Mis colaboraciones'
	},
	{
		'key': 'ConsultarPerfilGenerico',
		'routeName': 'ConsultarPerfilGenerico',
		'name': 'Mi perfil'
	},
	{
		'key': 'Configuracion',
		'routeName': 'Configuracion',
		'name': 'Configuración'
	}
	
]

const itemsEmp = [
	{
	  'key': 'LaunchScreen',
	  'routeName': 'LaunchScreen',
	  'name': 'Home'
	},
	{
	  'key': 'ConsultarEventos',
	  'routeName': 'ConsultarEventos',
	  'name': 'Eventos',
	},
	{
		'key': 'OrganizacionesPage',
		'routeName': 'OrganizacionesPage',
		'name': 'Organizaciones'
	},
	{
		'key': 'MisPropuestas',
		'routeName': 'MisPropuestas',
		'name': 'Mis propuestas'
	},
	{
		'key': 'OrganizacionesPage',
		'routeName': 'OrganizacionesPage',
		'name': 'Organizaciones Helpo'
	},
	{
		'key': 'ConsultarPerfilGenerico',
		'routeName': 'ConsultarPerfilGenerico',
		'name': 'Mi perfil'
	},
	{
	  'key': 'Configuracion',
	  'routeName': 'Configuracion',
	  'name': 'Configuración'
	}
]

class DrawerContent extends Component {

  render() {
		const navigation = this.props.navigation;
		let items;
		if (this.props.auth === null || this.props.auth.user === null) {
			items = itemsNoAuth;
		} else if (this.props.auth.user.user_type === 1) {
			items = itemsOrg;
		} else if (this.props.auth.user.user_type === 2) {
			items  = itemsVol;
		} else {
			items = itemsEmp;
		}
		return (
		  <View style={styles.container}>
		  	<Content>
			  <Image source={Images.drawerCover} style={styles.drawerCover}/>
			  <List
				dataArray={items}
				renderRow={item => (
				<ListItem onPress={() => navigation.navigate(item.routeName)}>
					<Text>{item.name}</Text>
				</ListItem>
				)}
			  />
			</Content>
			</View>
		);
  }
}


const mapStateToProps = state => ({ auth: state.auth })
export default connect(mapStateToProps)(DrawerContent)
 