import React, { Component } from 'react';
import { Container, Header, Title, Content, Button, Icon, Left, Right, Body } from 'native-base';
import api from '../../api';
import styles from './styles';
import moment from 'moment';

import OrganizacionCard from './OrganizacionCard';

class OrganizacionesPage extends React.Component {  

  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(this.props.location.search)
    const id = urlParams.get('id');
    this.state = {
      nombre: '',
      error:'',
      organizaciones:[]
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  }

  buscarOrganizaciones(organizaciones){
    if(this.state.nombre !== ''){
      const organizacionesFiltradas = organizaciones.filter(organizacion => this.contieneNombre(organizacion));
      return organizacionesFiltradas;
    }
    else return organizaciones;
  }

  contieneNombre(organizacion){
    return organizacion.usuario.nombre.toLowerCase().includes(this.state.nombre)
  }

  mostrarError(organizaciones){
    if(organizaciones.length() === 0){
      <Text style={styles.validationMessage}>No se encontraron coincidencias.</Text>
    }        
  }

  render() {
    const organizaciones = this.buscarOrganizaciones(this.props.organizaciones);
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
        <Label>Buscar</Label>
        <Input
        value={this.state.nombre}
        onChangeText={this.handleInputChange}
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