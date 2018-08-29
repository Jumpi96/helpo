import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Card, CardHeader , Button } from 'reactstrap';
import { getImagen } from '../../../Lib/Imagen'

const perfilPropTypes = {
  nombre: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  data: PropTypes.shape({
    verificada: PropTypes.bool,
    telefono: PropTypes.number,
    dni: PropTypes.number,
    gustos: PropTypes.string,
    habilidades: PropTypes.string,
    sexo: PropTypes.string,
    apellido: PropTypes.string,
    avatar: PropTypes.shape({
      id: PropTypes.number,
      url: PropTypes.string,
    })
  }),
  switchToModificar: PropTypes.func.isRequired,
}

class ConsultarPerfilVoluntario extends Component {
  constructor(props) {
    super(props); 
    this.renderDni = this.renderDni.bind(this);
    this.renderDescripcion = this.renderDescripcion.bind(this);    
    this.renderTelefono = this.renderTelefono.bind(this);
    this.renderSexo = this.renderSexo.bind(this);
    this.renderApellido = this.renderApellido.bind(this);
    this.renderGustos = this.renderGustos.bind(this);
    this.renderHabilidades = this.renderHabilidades.bind(this);

  }
  renderSexo() {
    if (this.props.data.sexo == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.sexo}</p>      
  }

  renderApellido() {
    if (this.props.data.apellido == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.apellido}</p>      
  }

  renderGustos() {
    if (this.props.data.gustos == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.gustos}</p>      
  }

  renderHabilidades() {
    if (this.props.data.habilidades == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.habilidades}</p>      
  }

  renderTelefono() {
    //Si uso == va a dar True para null y undefined
    if (this.props.data.telefono == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.telefono}</p>      
  }

  renderDni() {
    if (this.props.data.dni == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.dni}</p>      
  }

  renderDescripcion() {
    if (this.props.data.descripcion == null) {
      return <p class='text-muted'> No hay valor ingresado</p>
    }
    return <p> {this.props.data.descripcion}</p>      
  }  

  render() {
    const { params } = this.props.navigation.state;
    const evento = params.evento;
    let listaContactos;
    if (evento.contacto.length > 0) {
      listaContactos = evento.contacto.map(contacto =>
        <ListItem key={contacto.nombre}>
          <Text>{contacto.nombre} - {contacto.telefono}</Text>
        </ListItem>
      );
    }
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('ConsultarEventos')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{evento.nombre}</Title>
          </Body>
          { this.props.auth.user.user_type === 2 ?
            <Right>
              <Button 
                transparent 
                onPress={() => this.props.navigation.navigate('RegistrarColaboraciones', { evento: evento.id })}>
                <Text>Colaborar</Text>
              </Button>
            </Right> : undefined
          }
        </Header>
        <Content>
          <Separator bordered noTopBorder>
            <Text>Información</Text>
          </Separator>
          <ListItem>
            <Label style={styles.label}>Nombre</Label>
            <Text>{evento.nombre}</Text>
          </ListItem>
          <ListItem>
            <Label style={styles.label}>Organización</Label>
            <Text>{evento.organizacion.nombre}</Text>
          </ListItem>
          <ListItem>
            <Label style={styles.label}>Descripción</Label>
            <Text>{evento.descripcion}</Text>
          </ListItem>
          <ListItem>
            <Label style={styles.label}>Rubro</Label>
            <Text>{evento.rubro.nombre}</Text>
          </ListItem>
          <Separator bordered noTopBorder>
            <Text>Fecha</Text>
          </Separator>
          <ListItem>
            <Label style={styles.label}>Inicio</Label>
            <Text>{moment(evento.fecha_hora_inicio).format('DD/MM/YYYY HH:mm')}</Text>
          </ListItem>
          <ListItem>
            <Label style={styles.label}>Fin</Label>
            <Text>{moment(evento.fecha_hora_fin).format('DD/MM/YYYY HH:mm')}</Text>
          </ListItem>
          {listaContactos ? (
            <View>
              <Separator bordered noTopBorder>
                <Text>Contactos</Text>
              </Separator>
              {listaContactos}
            </View>
            ) : undefined
          }
          {evento.necesidades.length > 0 ? (
            <View>
              <Separator bordered noTopBorder>
                <Text>Necesidades materiales</Text>
              </Separator>
              {this.getListaNecesidades(evento)}
            </View>
            ) : undefined
          }
          {evento.voluntarios.length > 0 ? (
            <View>
              <Separator bordered noTopBorder>
                <Text>Voluntarios</Text>
              </Separator>
              {this.getListaVoluntarios(evento)}
            </View>
            ) : undefined
          }
          {evento.comentarios.length > 0 ? (
            <View>
              <Separator bordered noTopBorder>
                <Text>Comentarios</Text>
              </Separator>
              {this.getListaComentarios(evento)}
            </View>
            ) : undefined
          }
        </Content>
      </Container>
    );
  }
}

  render() {    
    return (      
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"></i> Perfil
        </CardHeader>
        <div class='container'>
        
        <div style={{ alignItems: 'center' }} class='row'>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '150px'}} class='col-2'>            
            <p style={{ textAlign: 'right' }} 
               class='h4'>{this.props.nombre} {this.renderApellido()}</p>
          </div>
          <div class='col-6'>
            <img
              class='rounded-circle'
              src={getImagen(this.props.data.avatar.url)}
              alt="avatar"
              width="100" 
              height="100"
            />
          </div>
        </div>
          
        <div class='row'>
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="mail">Mail</p>
            <div class='col-6'><p>{this.props.email}</p></div>
        </div>

        <div class='row'>
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="telefono">Teléfono</p>
            <div class='col-6'>{this.renderTelefono()}</div>
        </div>

        <div class='row'>          
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="dni">DNI</p>
            <div class='col-6'>{this.renderDni()}</div>
        </div>
        
        {/**/}
        <div class='row'>        
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="sexo">Sexo</p>
            <div class='col-6'>{this.renderSexo()}</div>    
        </div>

        <div class='row'>        
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="gustos">Gustos</p>
            <div class='col-6'>{this.renderGustos()}</div>    
        </div>

        <div class='row'>        
            <p style={{ textAlign: 'right' }} class='font-weight-bold col-2' htmlFor="habilidades">Habilidades</p>
            <div class='col-6'>{this.renderHabilidades()}</div>    
        </div>
        {/**/}            

        <div style={{ width: '500px', justifyContent: 'center' ,display: 'flex', marginBottom: '10px' }} class='row offster-md-4'>         
          <Button onClick={this.props.switchToModificar} color='primary'>Modificar Datos</Button>
        </div>  
        </div>
      </Card>
    );
  }
}
ConsultarPerfilVoluntario.propTypes = perfilPropTypes;

export default ConsultarPerfilVoluntario;