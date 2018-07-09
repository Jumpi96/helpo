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
            <Title>Ver Perfil</Title>
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

            <Item floatingLabel>
              <Label>Descripción</Label>
              <Input
                value={this.state.descripcion}
              />
            </Item>

            <ListaRubrosOrganizacion
              name="listaRubros"
              rubro_id={this.state.rubro_id}              
            />           
           
            <Item>
              <SelectorUbicacion
                ubicacion={this.state.ubicacion}              
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

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="form-group col-md-6">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              placeholder="Nombre"
              htmlFor="disabled-input"
              value={this.state.nombre}
            />
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="cuit">CUIT</label>
            <input
              type="text"
              name="cuit"
              className="form-control"
              placeholder="CUIT"
              htmlFor="disabled-input"
              value={this.state.cuit}
     
            />
            <span style={{ color: 'red' }}>{this.state.errors.cuit}</span>
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="text"
              name="telefono"
              className="form-control"
              placeholder="Teléfono"
              htmlFor="disabled-input"
              value={this.state.telefono}            
            />           
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="telefono">Rubro</label>
            <input
              type="text"
              name="rubro"
              className="form-control"
              placeholder="Rubro"
              htmlFor="disabled-input"
              value={this.state.rubro_id}            
            />           
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="listaRubros">Rubro</label>
            <ListaRubrosOrganizacion
              name="listaRubros"
              rubro={this.state.rubro_id}             
            />
            <span style={{ color: 'red' }}>{this.state.errors.rubro}</span>
          </div>
          </div>

        <SelectorUbicacion
          name="selectorUbicacion"
          ubicacion={this.state.ubicacion}
        />

        <div className="form-group">
          <CargadorImagenPerfil />
        </div>

        <div className="form-group">
          <input type="submit" className="btn btn-primary" value="Modificar perfil" />
        </div>
      </form>
    );
  }
}
export default ConsultarPerfilOrganizacion;