import React, { Component } from 'react';
import ListaRubrosOrganizacion from './ListaRubrosOrganizacion/ListaRubrosOrganizaciones';
import SelectorUbicacion from '../Actividades/RegistrarEvento/SelectorUbicacion/SelectorUbicacion';
import api from '../../api';
import CargadorImagenPerfil from './CargadorImagenPerfil/CargadorImagenPerfil';


class ConsultarPerfilOrganizacion extends Component {
  constructor(props) {
    super(props); //Llama a las props del padre
    this.state = {

      nombre: '',
      cuit: '',
      // TODO: ubicacion que pasamos por defecto debería ser la de la ONG. Ahora, Córdoba.
      ubicacion: { latitud: -31.4201, longitud: -64.1888, notas: '' },
      mail: '',
      telefono: '',
      rubro_id: 0,
      foto_perfil: undefined,
      descripcion: '',
      errors: {},

    };
  }


  handleSubmit(event) {
    event.preventDefault();
        
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>

          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>

          <Body>
            <Title>Perfil</Title>
          </Body>
          <Right />

        </Header>

        <Content>

          <Form>

            <Item>
              <Image
               style={{width: 50, height: 50}}
               source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
              />
            </Item>

            <Item floatingLabel>
              <Label>Nombre</Label>
              <Text
                value={this.state.nombre}
              />
            </Item>

            <Item floatingLabel>
              <Label>Mail</Label>
              <Text
                value={this.state.mail}
              />
            </Item>

            <Item floatingLabel>
              <Label>Teléfono</Label>
              <Text
                value={this.state.telefono}
              />
            </Item>
            
            <Item floatingLabel>
              <Label>CUIT</Label>
              <Text
                value={this.state.cuit}
              />
            </Item>

            <Item floatingLabel>
              <Label>Rubro</Label>
              <ListaRubrosOrganizacion
              name="listaRubros"
              rubro_id={this.state.rubro_id}              
            />               
            </Item>

            <Item>
              <SelectorUbicacion
                ubicacion={this.state.ubicacion}              
              />
            </Item>              

            <Item floatingLabel>
              <Label>Descripción</Label>
              <Input
                value={this.state.descripcion}
              />
            </Item>     
            
            <Button
              block style={{ margin: 15, marginTop: 50 }}
              onPress={this.handleSubmit}
            >
              <Text>ModificarPerfilOrganizacion</Text>
            </Button>

          </Form>

        </Content>

      </Container>
    );
  }

}
export default ConsultarPerfilOrganizacion;