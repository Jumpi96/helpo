import React from 'react';
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
  View,
  Fab,
  IconNB
} from 'native-base';
import styles from './styles';
import api from '../../../api';

class RegistrarNecesidades extends React.Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const idEvento = params.id;
    this.state = {
      evento: idEvento,
      necesidades: [],
      voluntarios: [],
      fabActive: false,
      error: undefined
    };
  }

  componentDidMount() {
    this.loadNecesidades();
  }

  handleConfirmDeleteNecesidad(b) {
    if (b.text === "Eliminar") {
      api.delete("/actividades/necesidades/" + this.state.necesidadModificada + "/")
        .then(res => {
          console.log(res);
          console.log(res.data);
          this.loadNecesidades();
        }).catch(function (error) {
          if (error.response) { console.log(error.response.status); }
          else { console.log("Error: ", error.message); }
          this.setState({ error: "Hubo un problema al cargar su información." });
        });
    }
    this.setState({
      necesidadModificada: { recurso: {} },
    });
  }

  handleConfirmDeleteVoluntario(b) {
    if (b.text === "Eliminar") {
      api.delete("/actividades/voluntarios/" + this.state.necesidadModificada + "/")
        .then(res => {
          this.loadNecesidades();
        }).catch(function (error) {
          this.setState({ error: "Hubo un problema al cargar su información." });
        });
    }
    this.setState({
      necesidadModificada: { funcion: {} }
    });
  }

  loadNecesidades() {
    api.get("/actividades/necesidades/?evento=" + this.state.evento)
      .then(res => {
        const necesidadesData = res.data;
        api.get("/actividades/voluntarios/?evento=" + this.state.evento)
          .then(res => {
            const voluntariosData = res.data;
            this.setState({ necesidades: necesidadesData, voluntarios: voluntariosData });
          });
      })
      .catch((error) => {
        this.setState({ error: "Hubo un problema al cargar su información." });
      });
  }

  getListaVoluntarios() {
    const deleteButtons = [
      { text: "Eliminar", icon: "trash", iconColor: "#fa213b" },
      { text: "Cancelar", icon: "close", iconColor: "#25de5b" }
    ];
    return this.state.voluntarios.map((n) =>
      <ListItem icon key={n.id}>
        <Left>
          <Button style={{ backgroundColor: "#FD3C2D" }}
            onPress={() => {
              this.setState({ necesidadModificada: n.id });
              ActionSheet.show(
                {
                  options: deleteButtons,
                  cancelButtonIndex: 1,
                  destructiveButtonIndex: 0,
                  title: "¿Está seguro que desea eliminarlo?"
                },
                buttonIndex => {
                  this.handleConfirmDeleteVoluntario(deleteButtons[buttonIndex]);
                });
            }
            }>
            <Icon active name="trash" />
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
    return v.cantidad;
  }

  render() {
    const deleteButtons = [
      { text: "Eliminar", icon: "trash", iconColor: "#fa213b" },
      { text: "Cancelar", icon: "close", iconColor: "#25de5b" }
    ];
    const listaNecesidades = this.state.necesidades.map((n) =>
      <ListItem icon key={n.id}>
        <Left>
          <Button style={{ backgroundColor: "#FD3C2D" }}
            onPress={() => {
              this.setState({ necesidadModificada: n.id });
              ActionSheet.show(
                {
                  options: deleteButtons,
                  cancelButtonIndex: 1,
                  destructiveButtonIndex: 0,
                  title: "¿Está seguro que desea eliminarlo?"
                },
                buttonIndex => {
                  this.handleConfirmDeleteNecesidad(deleteButtons[buttonIndex]);
                });
            }
            }>
            <Icon active name="trash" />
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
          <Text>{n.cantidad}</Text>
        </Right>
      </ListItem>
    );
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('MisEventos')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Registrar necesidades</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <Separator bordered noTopBorder>
              <Text>Necesidades materiales</Text>
            </Separator>
            {listaNecesidades}
            <Separator bordered noTopBorder>
              <Text>Voluntarios</Text>
            </Separator>
            {this.getListaVoluntarios()}
          </Form>
        </Content>
        <View style={{ flex: 0.1 }}>
          <Fab
            direction="left"
            containerStyle={{}}
            active={this.state.fabActive}
            style={{ backgroundColor: '#E94E1B' }}
            position="bottomRight"
            onPress={() => this.setState({ fabActive: !this.state.fabActive })}
          >
            <IconNB name="md-add" />
            <Button style={{ backgroundColor: '#F4BF42' }}
              onPress={() => { this.props.navigation.navigate('AgregarVoluntario', { evento: this.state.evento })}}
            >
              <Icon name="person" />
            </Button>
            <Button style={{ backgroundColor: '#34A34F' }}
              onPress={() => { this.props.navigation.navigate('AgregarNecesidad', { evento: this.state.evento })}}
            >
              <Icon name="medkit" />
            </Button>
          </Fab>
        </View>
      </Container>
    );
  }
}

export default RegistrarNecesidades;
