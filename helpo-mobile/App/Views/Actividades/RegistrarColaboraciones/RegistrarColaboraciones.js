import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import {
  Button,
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Content,
  Form,
  Icon,
  Text,
  ListItem,
  ActionSheet,
  Separator,
} from 'native-base';
import styles from './../RegistrarColaboraciones/styles';
import api from '../../../api';


class RegistrarColaboraciones extends React.Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const evento = params.evento;
    this.state = {
      evento: { id: evento },
      necesidades: [],
      voluntarios: [],
      funcionVoluntario: undefined,
    };
    this.getParticipacionPorId = this.getParticipacionPorId.bind(this);
  }

  componentDidMount() {
    this.loadNecesidadesYVoluntarios();
  }

  loadNecesidadesYVoluntarios() {
    api.get('/actividades/consulta_necesidades/' + this.state.evento.id + '/')
      .then(res => {
        const necesidadesData = res.data;
        this.setState({
          necesidades: necesidadesData.necesidades,
          voluntarios: necesidadesData.voluntarios,
          evento: necesidadesData,
          funcionVoluntario: this.getNecesidadVoluntario(necesidadesData.voluntarios),
        });
      })
      .catch((error) => {
        this.setState({ error: "Hubo un problema al cargar su información." });
      })
  }

  getNecesidadVoluntario(necesidades) {
    const usuario = this.getUserId();
    for (let i = 0; i < necesidades.length; i++) {
      if (necesidades[i].participaciones.filter(c => c.colaborador.id === usuario).length > 0) {
        return necesidades[i].id;
      }
    }
    return 0;
  }

  getBotonesVoluntario(idVoluntario) {
    const voluntario = this.state.voluntarios.filter(n => n.id === idVoluntario)[0];
    if (voluntario.participaciones.filter(n => n.colaborador.id === this.getUserId()).length > 0) {
      return [
        { text: 'Eliminar', icon: 'trash', iconColor: '#fa213b' },
        { text: 'Cancelar', icon: 'close', iconColor: '#25de5b' },
      ];
    }
    return [
      { text: 'Participar', icon: 'hand', iconColor: '#fa213b' },
      { text: 'Cancelar', icon: 'close', iconColor: '#25de5b' },
    ];
  }

  getBotonesNecesidades(idNecesidad) {
    const necesidad = this.state.necesidades.filter(n => n.id === idNecesidad)[0];
    const colaboraciones_usuario = necesidad.colaboraciones.filter(n => n.colaborador.id === this.getUserId());
    if (colaboraciones_usuario.length > 0) {
      return [
        { text: 'Modificar', icon: 'color-filter', iconColor: '#fa213b' },
        { text: 'Eliminar', icon: 'trash', iconColor: '#fa213b' },
        { text: 'Cancelar', icon: 'close', iconColor: '#25de5b' },
      ];
    }
    return [
      { text: 'Colaborar', icon: 'hand', iconColor: '#fa213b' },
      { text: 'Cancelar', icon: 'close', iconColor: '#25de5b' },
    ];
  }

  getUserId() {
    return this.props.auth.user.id;
  }

  getListaVoluntarios() {
    let deleteButtons;
    return this.state.voluntarios.map((n) =>
      <ListItem icon key={n.id}>
        <Left>
          <Button style={{ backgroundColor: "#ffe859" }}
            onPress={() => {
              this.setState({ necesidadModificada: n.id });
              deleteButtons = this.getBotonesVoluntario(n.id);
              ActionSheet.show(
                {
                  options: deleteButtons,
                  cancelButtonIndex: 1,
                  destructiveButtonIndex: 0,
                  title: '¿Qué desea hacer?',
                },
                (buttonIndex) => {
                  this.handleActionVoluntario(deleteButtons[buttonIndex]);
                });
            }}
          >
            <Icon active name="hand" />
          </Button>
        </Left>
        <Body>
          <Text>
            {n.funcion.nombre}
          </Text>
          <Text numberOfLines={1} note>
            {n.descripcion}
          </Text>
        </Body>
        <Right>
          <Text>{this.getCantidadVoluntarios(n)}</Text>
        </Right>
      </ListItem>
    );
  }

  getCantidadVoluntarios(v) {
    let contador = 0;
    v.participaciones.forEach((p) => { contador += p.cantidad });
    return '' + contador + '/' + v.cantidad;
  }

  getCantidadNecesidades(n) {
    let contador = 0;
    n.colaboraciones.forEach((c) => { contador += c.cantidad });
    return '' + contador + '/' + n.cantidad;
  }

  getListaNecesidades() {
    let deleteButtons;
    return this.state.necesidades.map((n) =>
      <ListItem icon key={n.id}>
        <Left>
          <Button style={{ backgroundColor: "#ffe859" }}
            onPress={() => {
              this.setState({ necesidadModificada: n.id });
              deleteButtons = this.getBotonesNecesidades(n.id);
              ActionSheet.show(
                {
                  options: deleteButtons,
                  cancelButtonIndex: 1,
                  destructiveButtonIndex: 0,
                  title: '¿Qué desea hacer?',
                },
                (buttonIndex) => {
                  this.handleActionNecesidad(deleteButtons[buttonIndex]);
                });
            }}
          >
            <Icon active name="hand" />
          </Button>
        </Left>
        <Body>
          <Text>
            {n.recurso.nombre} - {n.recurso.categoria.nombre}
          </Text>
          <Text numberOfLines={1} note>
            {n.descripcion}
          </Text>
        </Body>
        <Right>
          <Text>{this.getCantidadNecesidades(n)}</Text>
        </Right>
      </ListItem>
    );
  }

  handleActionNecesidad(button) {
    if (button.text === 'Modificar') {
      const necesidad = this.state.necesidades.filter(v => v.id === this.state.necesidadModificada)[0];
      const colaboracionAnterior = necesidad.colaboraciones.filter(c => c.colaborador.id === this.getUserId())[0];
      const colaboracion = {
        id: this.state.necesidadModificada,
        colaboracion_anterior: colaboracionAnterior.id,
        cantidad_anterior: colaboracionAnterior.cantidad,
        cantidad: colaboracionAnterior.cantidad,
        cantidad_restante: this.getCantidadRestante(necesidad, colaboracionAnterior.cantidad),
        recurso: necesidad.recurso,
        descripcion: necesidad.descripcion,
        comentarios: colaboracionAnterior.comentario,
        evento: this.state.evento.id,
        entregados: colaboracionAnterior.entregados
      };
      this.setState({ necesidadModificada: undefined });
      this.props.navigation.navigate('AgregarColaboracion', { colaboracion });
    } else if (button.text === 'Eliminar') {
      this.deleteColaboracion(this.state.necesidadModificada);
    } else if (button.text === 'Colaborar') {
      const necesidad = this.state.necesidades.filter(v => v.id === this.state.necesidadModificada)[0];
      const colaboracion = {
        id: necesidad.id,
        cantidad_anterior: 0,
        cantidad: 0,
        cantidad_restante: this.getCantidadRestante(necesidad, 0),
        recurso: necesidad.recurso,
        descripcion: necesidad.descripcion,
        comentarios: undefined,
        evento: this.state.evento,
      };
      this.setState({ necesidadModificada: undefined });
      this.props.navigation.navigate('AgregarColaboracion', { colaboracion });
    }
  }

  getColaboracionAnterior(necesidadId) {
    const necesidad = this.state.necesidades.filter(n => n.id === necesidadId)[0];
    return necesidad.colaboraciones.filter(c => c.colaborador.id === this.getUserId())[0].id;
  }

  deleteColaboracion(idNecesidad) {
    const necesidad = this.state.necesidades.filter(n => n.id === idNecesidad)[0];
    const colaboracion = necesidad.colaboraciones.filter(c => c.colaborador.id === this.getUserId())[0];
    if (colaboracion.entregados === 0) {
      api.delete('/actividades/colaboraciones/' + colaboracion.id + '/')
        .then(() => {
          this.loadNecesidadesYVoluntarios();
        }).catch((error) => {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
          this.setState({ error_necesidad: "Hubo un problema al cargar su información." });
        });
    } else if (colaboracion.entregados === colaboracion.cantidad) {
      Alert.alert(
        "Eliminar colaboración",
        "No se puede eliminar una colaboración que ya ha sido entregada."
      );
      this.setState({ apiToken: false })
    } else if (colaboracion.entregados < colaboracion.cantidad) {
      const nuevaColaboracion = {
        id: colaboracion.id,
        cantidad: colaboracion.entregados,
        comentario: colaboracion.comentarios,
        necesidad_material_id: colaboracion.necesidad_material_id,
      }
      api.patch('/actividades/colaboraciones/' + colaboracion.id + '/', nuevaColaboracion)
        .then(res => {
          console.log(res);
          console.log(res.data);
          this.loadNecesidadesYVoluntarios();
        }).catch((error) => {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
          this.setState({ error_necesidad: "Hubo un problema al cargar su información.", apiToken: false });
        });
    }
  }

  handleActionVoluntario(button) {
    const voluntario = this.state.voluntarios.filter(v => v.id === this.state.necesidadModificada)[0];
    if (button.text === 'Participar') {
      const participacion = {
        id: voluntario.id,
        cantidad_anterior: 0,
        cantidad: 0,
        cantidad_restante: this.getCantidadRestante(voluntario, 0),
        funcion: voluntario.funcion,
        descripcion: voluntario.descripcion,
        comentarios: undefined,
        evento: this.state.evento.id,
      };
      if (!this.state.evento.campaña) {
        const necesidadVoluntario = this.getNecesidadVoluntario(this.state.voluntarios);
        if (necesidadVoluntario !== 0 && necesidadVoluntario !== this.state.necesidadModificada) {
          this.deleteParticipacion();
        }
      }
      this.setState({ necesidadModificada: undefined });
      this.props.navigation.navigate('AgregarColaboracion', { colaboracion: participacion });
    } else if (button.text === 'Eliminar') {
      this.deleteParticipacion(voluntario.id);
      this.setState({ necesidadModificada: undefined });
    }
  }

  getCantidadRestante(necesidad, aportado) {
    let contador = 0;
    if (!necesidad.funcion) {
      necesidad.colaboraciones.forEach((c) => { contador += c.cantidad; });
    } else {
      necesidad.participaciones.forEach((c) => { contador += c.cantidad; });
    }
    return necesidad.cantidad - contador + aportado;
  }

  getParticipacionPorId(id) {
    const { voluntarios } = this.state;
    let participaciones;
    for (let i = 0; i < voluntarios.length; i++) {
      participaciones = voluntarios[i].participaciones.filter(c => c.id === id);
      if (participaciones.length > 0) {
        return participaciones[0];
      }
    }
  }

  deleteParticipacion(idVoluntario=0) {
    const participacion = this.getParticipacionVoluntario(idVoluntario);
    if (participacion.presencias === 0) {
      api.delete('/actividades/participaciones/' + participacion.id + '/')
        .then(() => {
          this.loadNecesidadesYVoluntarios();
        }).catch(function (error) {
          if (error.response) { console.log(error.response.status) }
          else { console.log('Error: ', error.message) }
          _this.setState({ error_necesidad: "Hubo un problema al cargar su información." });
        });
    } else {
      Alert.alert(
        "Eliminar participación",
        "No se puede eliminar una participación que ya ha sido realizada."
      );
    }
  }

  getParticipacionVoluntario(id=0) {
    const necesidades = this.state.voluntarios;
    const usuario = this.getUserId();
    let participaciones;
    if (id === 0) {
      for (let i = 0; i < necesidades.length; i += 1) {
        participaciones = necesidades[i].participaciones.filter(c => c.colaborador.id === usuario);
        if (participaciones.length > 0) {
          return participaciones[0];
        }
      }
    }
    else {
      const necesidad = this.state.voluntarios.filter(v => v.id === id)[0];
      return necesidad.participaciones.filter(c => c.colaborador.id === usuario)[0];
    }
    return undefined;
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('MisColaboraciones')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Colaborar</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <Separator bordered noTopBorder>
              <Text>Necesidades materiales</Text>
            </Separator>
            {this.getListaNecesidades()}
            <Separator bordered noTopBorder>
              <Text>Voluntarios</Text>
            </Separator>
            {this.getListaVoluntarios()}
          </Form>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, undefined)(RegistrarColaboraciones);
