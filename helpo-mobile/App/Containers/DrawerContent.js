import React, { Component } from "react";
import { Image } from "react-native";
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
	  'key': 'MisEventos',
	  'routeName': 'MisEventos',
	  'name': 'Mis actividades sociales',
	},
	{
	  'key': 'RegistrarEvento',
	  'routeName': 'RegistrarEvento',
	  'name': 'Nueva actividad social',
	},
	{
	  'key': 'ConsultarEventosInicial',
	  'routeName': 'ConsultarEventosInicial',
	  'name': 'Actividades sociales',
	},
	{
		'key': 'OrganizacionesPage',
		'routeName': 'OrganizacionesPage',
		'name': 'Organizaciones'
	},
	{
		'key': 'EmpresasPage',
		'routeName': 'EmpresasPage',
		'name': 'Empresas'
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
		'key': 'MisColaboraciones',
		'routeName': 'MisColaboraciones',
		'name': 'Mis colaboraciones'
	},
	{
		'key': 'ConsultarEventosInicial',
		'routeName': 'ConsultarEventosInicial',
		'name': 'Actividades sociales',
	},
	{
		'key': 'OrganizacionesPage',
		'routeName': 'OrganizacionesPage',
		'name': 'Organizaciones'
	},
	{
		'key': 'EmpresasPage',
		'routeName': 'EmpresasPage',
		'name': 'Empresas'
	},
	{
		'key': 'ConsultarPerfilGenerico',
		'routeName': 'ConsultarPerfilGenerico',
		'name': 'Mi perfil'
	},
	{
		'key': 'MisSuscripciones',
		'routeName': 'MisSuscripciones',
		'name': 'Mis suscripciones'
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
		'key': 'MisPropuestas',
		'routeName': 'MisPropuestas',
		'name': 'Mis propuestas'
	},
	{
	  'key': 'ConsultarEventosInicial',
	  'routeName': 'ConsultarEventosInicial',
	  'name': 'Actividades sociales',
	},
	{
		'key': 'OrganizacionesPage',
		'routeName': 'OrganizacionesPage',
		'name': 'Organizaciones'
	},
	{
		'key': 'EmpresasPage',
		'routeName': 'EmpresasPage',
		'name': 'Empresas'
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
 