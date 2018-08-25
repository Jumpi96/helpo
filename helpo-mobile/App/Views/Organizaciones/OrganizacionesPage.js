import React, { Component } from 'react';
import { Container, Header, Title, Content, Button, Icon, Left, Right, Body, Item, Label, Input, Text } from 'native-base';
import api from '../../api';
import styles from './styles';
import moment from 'moment';

import OrganizacionCard from './OrganizacionCard';

class OrganizacionesPage extends React.Component {  

  constructor(props) {
    super(props);
    this.state = {
      nombre: '',
      error:'',
      organizaciones:[],
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.buscarOrganizaciones = this.buscarOrganizaciones.bind(this);
  }

  componentDidMount() {  // Suponiendo  que res son todas las organizaciones
    api.get(`/perfiles/perfil_organizacion/`)
    .then( (res) => {
      this.setState({
        organizaciones: res.data,        
      })
    })
  }  

  renderListadoOrganizaciones(organizaciones){
    if(organizaciones.length === 0){
      return(
        <Text>Todavía no hay Organizaciones Helpo registradas.</Text>
      )
    }
    else{
      return(
        organizaciones.map(organizacion =>      
          <OrganizacionCard
            organizacion={organizacion}
            key={organizacion.id} footer
            color="primary" auth={this.props.auth}
            link={'/perfiles/perfil_organizacion/' + organizacion.usuario.id} // Ver que link va
          />
        )
      )
    }
  }

  buscarOrganizaciones(organizaciones){
    if(this.state.nombre !== ''){
      const organizacionesFiltradas = organizaciones.filter(organizacion => this.contieneNombre(organizacion));
      return organizacionesFiltradas;
    }
    else return organizaciones;
  }

  contieneNombre(organizacion){
    return organizacion.usuario.nombre.toLowerCase().includes(this.state.nombre.toLowerCase())
  }

  mostrarError(organizaciones){
    if(organizaciones.length === 0){
      <Text style={styles.validationMessage}>No se encontraron coincidencias.</Text>
    }        
  }

  render() {
    const organizaciones = this.buscarOrganizaciones(this.state.organizaciones);
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("LaunchScreen")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Organizaciones Helpo</Title>
          </Body>
        </Header>

        <Item>
        <Label>Buscar una Organización Helpo:</Label>
        <Input
        value={this.state.nombre}
        onChangeText={text => this.setState({ nombre: text })}
        />
        {this.mostrarError}
        </Item>

        <Content padder>
          {this.renderListadoOrganizaciones(organizaciones)}
        </Content>

      </Container>
    );
  }
}
  
export default OrganizacionesPage;