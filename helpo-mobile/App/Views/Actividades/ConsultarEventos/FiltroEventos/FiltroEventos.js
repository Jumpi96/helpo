import React from 'react';
import moment from 'moment';
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
import api from '../../../../api';
import styles from '../styles';
import { connect } from 'react-redux'
import FiltroActividadesActions from '../../../../Redux/FiltroActividadesRedux'

class FiltroEventos extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFunciones: [],
      selectedMateriales: [],
      selectedRubros: [],
      selectedFecha: 0,
      selectedUbicacion: 0,
      optionsFunciones: [],
      optionsMateriales: [],
      optionsRubros: [],
      optionsFechas: this.loadOptionsFecha(),
      optionsUbicaciones: this.loadOptionsUbicaciones(),
      latitud: undefined, longitud: undefined,
      verAntiguas: false      
    };
    this.handleChangeFuncion = this.handleChangeFuncion.bind(this);
    this.handleChangeMaterial = this.handleChangeMaterial.bind(this);
    this.handleChangeRubro = this.handleChangeRubro.bind(this);
    this.handleChangeFecha = this.handleChangeFecha.bind(this);
    this.handleChangeUbicacion = this.handleChangeUbicacion.bind(this);
  }

  getLink() {
    let ruta = '?';
    const {
      selectedFunciones,
      selectedMateriales,
      selectedRubros,
      selectedFecha,
      selectedUbicacion,
      optionsFunciones,
      optionsMateriales,
      optionsRubros,
      verAntiguas
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
    if (selectedRubros.filter(n => n !== false).length > 0) {
      ruta += 'rubros=';
      for (let i=0; i < optionsRubros.length; i++) {
        if (selectedRubros[i]) {
          ruta += optionsRubros[i].id + ',';
        }
      }
      ruta = ruta[ruta.length-1] === ',' ? ruta.substring(0, ruta.length-1) : ruta;
      ruta += '&';
    }
    if (selectedFecha !== 0) {
      ruta += this.getValorFecha(selectedFecha) + '&';
    }
    if (selectedUbicacion !== 0) {
      ruta += this.getValorUbicacion(selectedUbicacion) + '&';
    }
    if (verAntiguas) {
      ruta += 'antiguos=true&'
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
        const selectedMateriales = this.initialArray(optionsMateriales);
        api.get('/actividades/funciones/')
          .then((res) => {
            const optionsFunciones = res.data;
            const selectedFunciones = this.initialArray(optionsFunciones);
            api.get('/actividades/rubros_evento/')
              .then((res) => {
                const optionsRubros = res.data;
                const selectedRubros = this.initialArray(optionsRubros);
                this.setState({ 
                  optionsFunciones, 
                  optionsMateriales,
                  optionsRubros,
                  selectedFunciones,
                  selectedMateriales,
                  selectedRubros
                });
              })
          })
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
          });
        },
        (e) => {console.warn(e.message)},
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
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

  handleChangeRubro(i) {
    const { selectedRubros } = this.state;
    selectedRubros[i] = !selectedRubros[i];
    this.setState({ selectedRubros });
  }

  handleChangeFecha(selectedFecha) {
    this.setState({ selectedFecha });
  }

  handleChangeUbicacion(selectedUbicacion) {
    if (this.state.longitud) {
      this.setState({ selectedUbicacion });
    }
  }

  handleChangeVerAntiguas = () => {
    const verAntiguas = !this.state.verAntiguas
    this.setState({verAntiguas: verAntiguas})
    this.props.changeVerAntiguas(verAntiguas)
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

  getListaRubros() {
    let listaRubros = [];
    for (let i=0; i < this.state.optionsRubros.length; i++) {
      listaRubros.push(
        <ListItem>
          <CheckBox 
            onPress={() => this.handleChangeRubro(i)}
            checked={this.state.selectedRubros[i]}
            color="red"
          />
          <Body>
            <Text>{this.state.optionsRubros[i].nombre}</Text>
          </Body>
        </ListItem>
      );
    }
    return (
      <View>
        {listaRubros}
      </View>
    );
  }

  getListaFechas() {
    let listaFechas = [];
    this.state.optionsFechas.forEach((option) => {
      listaFechas.push(
        <ListItem>
          <CheckBox 
            onPress={() => this.handleChangeFecha(option.value)}
            checked={this.state.selectedFecha === option.value}
            color="orange"
          />
          <Body>
            <Text>{option.label}</Text>
          </Body>
        </ListItem>
      );
    });
    return (
      <View>
        {listaFechas}
      </View>
    )
  }

  getListaUbicaciones() {
    let listaUbicaciones = [];
    this.state.optionsUbicaciones.forEach((option) => {
      listaUbicaciones.push(
        <ListItem>
          <CheckBox 
            onPress={() => this.handleChangeUbicacion(option.value)}
            checked={this.state.selectedUbicacion === option.value}
            color="red"
          />
          <Body>
            <Text>{option.label}</Text>
          </Body>
        </ListItem>
      );
    });
    return (
      <View>
        {listaUbicaciones}
      </View>
    )
  }

  checkboxVerActividadesPasadas = () => {
    return (
    <ListItem>
      <CheckBox 
        onPress={this.handleChangeVerAntiguas}
        checked={this.state.verAntiguas}
        color="green"
      />
      <Body>
        <Text>¿Ver actividades pasadas?</Text>
      </Body>
    </ListItem>
    )
  }
  
  getValorFecha(selectedFecha) {
    let desde, hasta;
    if (selectedFecha === 1) {
      desde = moment();
      hasta = moment().add(7, 'days');
    } else if (selectedFecha === 2) {
      desde = moment();
      hasta = moment().add(15, 'days');
    } else if (selectedFecha === 3) {
      desde = moment();
      hasta = moment().add(1, 'months');
    }
    return 'fecha_desde=' + desde.toISOString() + '&fecha_hasta=' + hasta.toISOString();
  }

  getValorUbicacion(selectedUbicacion) {
    const kms = selectedUbicacion;
    return 'kms=' + kms + '&latitud=' + this.state.latitud + '&longitud=' + this.state.longitud;
  }

  loadOptionsFecha() {
    return [
      { value: 0, label: 'Todas' },
      { value: 1, label: 'Esta semana' },
      { value: 2, label: 'Próximos 15 días' },
      { value: 3, label: 'Este mes' },
    ];
  }

  loadOptionsUbicaciones() {
    return [
      { value: 0, label: 'Todas' },
      { value: 5, label: 'A menos de 5 km' },
      { value: 10, label: 'A menos de 10 km' },
      { value: 100, label: 'A menos de 100 km' },
    ];
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
          <Separator bordered noTopBorder>
            <Text>Rubros</Text>
          </Separator>
          {this.getListaRubros()}
          <Separator bordered noTopBorder>
            <Text>Fechas</Text>
          </Separator>
          {this.getListaFechas()}
          <Separator bordered noTopBorder>
            <Text>Ubicación</Text>
          </Separator>          
          {this.getListaUbicaciones()}
          <Separator bordered noTopBorder>
            <Text>Ver actividades finalizadas</Text>
          </Separator>
          {this.checkboxVerActividadesPasadas()}
        </Content>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changeVerAntiguas: (value) => dispatch(FiltroActividadesActions.verAntiguasChange(value))
})

export default connect(null, mapDispatchToProps)(FiltroEventos);
