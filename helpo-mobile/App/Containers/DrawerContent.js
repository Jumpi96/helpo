import React, { Component } from "react";
import { ScrollView, Image, BackHandler } from "react-native";
import { List, ListItem, Text, View, Content } from "native-base";

import styles from "./Styles/DrawerContentStyles";
import { Images } from "../Themes";

const itemsNoAuth = [
	{
		'key': 'LaunchScreen',
		'routeName': 'LaunchScreen',
		'name': 'NoAuth'
	},
	{
		'key': 'Login',
		'routeName': 'Login',
		'name': 'NoAuth'
	}
]

const itemsOrg = [
	{
		'key': 'LaunchScreen',
		'routeName': 'LaunchScreen',
		'name': 'Org'
	}
]

class DrawerContent extends Component {

  render() {
	const navigation = this.props.navigation;
	let items;
	if (true) {
		items = itemsOrg;
	} else {
		items = itemsNoAuth;
	}
	return (
	  <View style={styles.container}>
		<Image source={Images.logoDark} style={styles.logo} />
		<Content>
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

export default DrawerContent;