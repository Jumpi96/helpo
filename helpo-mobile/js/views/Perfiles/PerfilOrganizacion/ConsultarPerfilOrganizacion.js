import React, { Component } from 'react';
import ListaRubrosOrganizacion from './ListaRubrosOrganizacion/ListaRubrosOrganizaciones';
import SelectorUbicacion from '../Actividades/RegistrarEvento/SelectorUbicacion/SelectorUbicacion';
import api from '../../api';
import CargadorImagenPerfil from './CargadorImagenPerfil/CargadorImagenPerfil';

class ConsultarPerfilOrganizacion extends Component {
  constructor(props) {
    super(props); //Llama a las props del padre
    this.state = {nombre: 'organizacion',
    cuit: '',
    ubicacion: { latitud: 0, longitud: 0, notas:'#!None#!'},
    mail: '',
    telefono: '',
    rubro: { id: 0, nombre: "none"},
    avatar_url: 'assets/user.png',
    descripcion: '',
    errors: {},
    };
  }


  componentDidMount() {
    api.get(`/perfiles/perfil_organizacion/${this.props.usuarioId}`)
    .then( (res) => {
      let rubro = res.rubro
      let ubicacion = res.ubicacion
      if ( rubro == null ) {
        rubro = { id: 0, nombre: 'none'}
      }
      if ( ubicacion == null ) {
        ubicacion = { latitud: 0, longitud: 0, notas:'#!None#!'}
      }
      this.setState({
        cuit: res.cuit,
        telefono: res.telefono,
        descripcion: res.descripcion,
        rubro_id: rubro.id,
        rubro_nombre: rubro.nombre,
        avatar_url: res.avatar.url,        
      })
    })
  }  

  mostrarUbicacion(){
    if(this.state.ubicacion.latitud === 0 && this.state.ubicacion.longitud === 0){
    }
    else{
      return      
        <SelectorUbicacion
        name="selectorUbicacion"
        ubicacion={this.state.ubicacion}
      />             
    }
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

            <Item floatingLabel>
              <Label>Nombre</Label>
              <Text
                value={this.state.nombre}
              />
            </Item>

            <Item>
              <Image
               style={{width: 50, height: 50}}
               source={this.avatar_url}
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
              <Text
                value={this.state.rubor.nombre}
              />         
            </Item>

            <Item>
            {this.mostrarUbicacion()} 
            </Item>              

            <Item floatingLabel>
              <Label>Descripción</Label>
              <Input
                value={this.state.descripcion}
              />
            </Item>     
            
            <Button
              block style={{ margin: 15, marginTop: 50 }}
              onPress={<ModificarPerfilOrganizacion />}            
              title="Modificar Perfil"
              >
            </Button>

          </Form>

        </Content>

      </Container>
    );
  }

}
export default ConsultarPerfilOrganizacion;