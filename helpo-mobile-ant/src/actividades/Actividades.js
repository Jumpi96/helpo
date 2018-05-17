import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Route, Link } from 'react-router-native';
import RegistrarEvento from './RegistrarEvento/RegistrarEvento';
import styles from './ActividadesCSS';

class Actividades extends Component {
    render(){
      return (
        <View>
          <Text style={styles.topic}>Actividades</Text>
          <View>
            <Link to={"/actividades/registrarEvento"}>
              <Text style={styles.navItem}>Registrar evento</Text>  
            </Link>
          </View>
          <Route exact path="/actividades" render={() => (<Text>Selecciona una opción</Text>)} />
          <Route path={"/actividades/registrarEvento"} component={RegistrarEvento} />
        </View>
      );
    }
  }
  
  export default Actividades;