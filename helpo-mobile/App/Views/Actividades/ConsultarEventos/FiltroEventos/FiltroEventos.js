import React from 'react';
import api from '../../../../api';
import {
  Button,
  Container,
  Header,
  Left,
  Right,
  Body,
  Title,
  Content,
  Separator,
  ListItem,
  Icon,
  Text,
  CheckBox,
  View
} from 'native-base';
import styles from '../styles';

class FiltroEventos extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFunciones: [],
      selectedMateriales: [],
      optionsFunciones: [],
      optionsMateriales: [],
    };
    this.handleChangeFuncion = this.handleChangeFuncion.bind(this);
    this.handleChangeMaterial = this.handleChangeMaterial.bind(this);
  }

  getLink() {
    let ruta = '?';
    const {
      selectedFunciones,
      selectedMateriales,
      optionsFunciones,
      optionsMateriales
    } = this.state;
    if (selectedMateriales.filter(n => n !== false).length > 0) {
      ruta += 'necesidades=';
      for (let i=0; i < optionsMateriales.length; i++) {
        if (selectedMateriales[i]) {
          ruta += optionsMateriales[i].id + ',';
        }
      }
      ruta = ruta[ruta.length-1] === ',' ? ruta.substring(0, ruta.length-1) : ruta;
      ruta += '&';
    }
    if (selectedFunciones.filter(n => n !== false).length > 0) {
      ruta += 'funciones=';
      for (let i=0; i < optionsFunciones.length; i++) {
        if (selectedFunciones[i]) {
          ruta += optionsFunciones[i].id + ',';
        }
      }
      ruta = ruta[ruta.length-1] === ',' ? ruta.substring(0, ruta.length-1) : ruta;
      ruta += '&';
    }
    ruta = ruta[ruta.length-1] === '&' ? ruta.substring(0, ruta.length-1) : ruta;
    return ruta;
  }

  initialArray(array) {
    return new Array(array.length).fill(false);
  }

  componentDidMount() {
    api.get('/actividades/categorias_recurso/')
      .then((res) => {
        const optionsMateriales = res.data;
        const selectedMateriales = this.initialArray(optionsMateriales)
        api.get('/actividades/funciones/')
          .then((res) => {
            const optionsFunciones = res.data;
            const selectedFunciones = this.initialArray(optionsFunciones)
            this.setState({ 
              optionsFunciones, 
              optionsMateriales,
              selectedFunciones,
              selectedMateriales
            });
          })
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      });
  }

  handleChangeFuncion(i) {
    const { selectedFunciones } = this.state;
    selectedFunciones[i] = !selectedFunciones[i];
    this.setState({ selectedFunciones });
  }

  handleChangeMaterial(i) {
    const { selectedMateriales } = this.state;
    selectedMateriales[i] = !selectedMateriales[i];
    this.setState({ selectedMateriales });
  }

  getListaMateriales() {
    let listaMateriales = [];
    for (let i=0; i < this.state.optionsMateriales.length; i++) {
      listaMateriales.push(
        <ListItem>
          <CheckBox 
            onPress={() => this.handleChangeMaterial(i)}
            checked={this.state.selectedMateriales[i]}
            color="red"
          />
          <Body>
            <Text>{this.state.optionsMateriales[i].nombre}</Text>
          </Body>
        </ListItem>
      );
    }
    return (
      <View>
        {listaMateriales}
      </View>
    );
  }

  getListaFunciones() {
    let listaFunciones = [];
    for (let i=0; i < this.state.optionsFunciones.length; i++) {
      listaFunciones.push(
        <ListItem>
          <CheckBox 
            onPress={() => this.handleChangeFuncion(i)}
            checked={this.state.selectedFunciones[i]}
            color="orange"
          />
          <Body>
            <Text>{this.state.optionsFunciones[i].nombre}</Text>
          </Body>
        </ListItem>
      );
    }
    return (
      <View>
        {listaFunciones}
      </View>
    );
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('ConsultarEventos')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Filtrar eventos</Title>
          </Body>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('ConsultarEventos', { link: this.getLink() })}>
              <Text>Filtrar</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <Separator bordered noTopBorder>
            <Text>Materiales</Text>
          </Separator>
          {this.getListaMateriales()}
          <Separator bordered noTopBorder>
            <Text>Funciones</Text>
          </Separator>
          {this.getListaFunciones()}
        </Content>
      </Container>
    );
  }
}

export default FiltroEventos;