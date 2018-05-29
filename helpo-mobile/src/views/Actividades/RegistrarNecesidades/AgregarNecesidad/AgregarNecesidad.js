import React from "react";
import { Alert } from "react-native";
import { FormValidationMessage } from "react-native-elements";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Item,
  Label,
  Input,
  Body,
  Left,
  Right,
  Icon,
  Form,
  Text
} from "native-base";
import api from "../../../../../api";
import moment from "moment";
import SelectorItem from "./SelectorItem/SelectorItem";
import styles from "./styles";


class AgregarNecesidad extends React.Component {
  constructor(props){
    super(props);
    const evento = this.props.navigation.getParam("evento", undefined);
    if (!evento) { this.props.navigation.goBack(); }
    this.state = {
        cantidad: undefined,
        recurso_id: 0,
        descripcion: undefined,
        error: undefined
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.saveNecesidad = this.saveNecesidad.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.handleValidation()) {
      const necesidad = {
        recurso_id: this.state.recurso_id,
        descripcion: this.state.descripcion,
        cantidad: this.state.cantidad,
        evento: this.state.evento
      };
      this.addNecesidad(necesidad);
    }
  }

  addNecesidad(necesidad) {
    api.post("/actividades/necesidades/", necesidad)
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.cleanNecesidad();
        this.loadNecesidades();
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status); }
        else { console.log("Error: ", error.message); }
        this.setState({ error: "Hubo un problema al cargar su información." });
      });
  }

  handleValidation() {
    let formIsValid = true;
    var error = this.state.error;
    if (this.state.recurso_id === 0 ||
      !this.state.recurso_id) {
      formIsValid = false;
      error = "Hubo un problema al cargar los recursos.";
    } else {
      error = undefined;
    }
    this.setState({error: error});
    return formIsValid;
  }

  cleanNecesidad() {
    this.setState({
      descripcion: undefined,
      cantidad: undefined,
      recurso_id: undefined,
      necesidad: undefined
    });
  }

  handleItemChange(r) {
    // eslint-disable-next-line
    this.setState({ recurso_id: parseInt(r) });
  }

  handleRubroChange(r) {
    this.setState({rubro_id: r});
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.handleValidation()) {
      const evento = {
        nombre: this.state.nombre,
        descripcion: this.state.descripcion,
        fecha_hora_inicio: this.state.fecha_hora_inicio.toISOString(),
        fecha_hora_fin: this.state.fecha_hora_fin.toISOString(),
        rubro_id: this.state.rubro_id,
        ubicacion: this.state.ubicacion
      };
      api.post("/actividades/eventos/", evento)
        .then(res => {
          console.log(res);
          console.log(res.data);
          Alert.alert(
            "Registrar evento",
            "Se registró el evento con éxito."
          );
          this.props.navigation("RegistrarNecesidades", {evento: res.data.id});
        }).catch(function (error) {
          if (error.response) { console.log(error.response); }
          else { console.log("Error: ", error.message); }
        });
    }
  }

  handleValidation(event) {
    let formIsValid = true;
    var errors = this.state.errors;

    if (!this.state.nombre) {
      formIsValid = false;
      errors.nombre = "Debe ingresar un nombre.";
    }

    if (isNaN(Date.parse(this.state.fecha_hora_inicio)) ||
        isNaN(Date.parse(this.state.fecha_hora_fin))) {
      formIsValid = false;
      errors.fechas = "Las fechas ingresadas no son válidas.";
    } else {
      const inicio = moment(this.state.fecha_hora_inicio);
      const fin = moment(this.state.fecha_hora_fin);
      const ahora = moment(new Date());
      if (moment.duration(fin.diff(inicio)).asHours() > 24 ||
          inicio < ahora ||
          moment.duration(fin.diff(inicio)).asHours() < 0) {
        formIsValid = false;
        errors.fechas = "Las fecha de fin debe ser mayor a la de inicio y " +
          "la actividad no durar más de 24 horas.";
      }
    }
    if (this.state.rubro_id === 0) {
      formIsValid = false;
      errors.rubro = "Hubo un problema al cargar los rubros.";
    }

    this.setState({errors: errors});
    return formIsValid;
  }

  handleUbicacionChange(ubi) {
    this.setState({ubicacion: ubi});
  }

  handleFechaHoraInicioChange(f_h) {
    this.setState({fecha_hora_inicio: f_h, fecha_hora_fin: f_h});
  }

  handleFechaHoraFinChange(f_h) {
    this.setState({fecha_hora_fin: f_h});
  }

  render(){
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Agregar necesidad</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Form>
            <SelectorItem
              item={this.state.recurso_id}
              onItemChange={this.handleItemChange}/>
            <Item floatingLabel>
              <Label>Descripción</Label>
              <Input value={this.state.descripcion}
                onChangeText={(text) => this.setState({descripcion: text})}/>
            </Item>
            <Item floatingLabel>
              <Label>Cantidad</Label>
              <Input value={this.state.cantidad}
                onChangeText={(text) => this.setState({cantidad: text})}/>
            </Item>

            <FormValidationMessage>{this.state.error}</FormValidationMessage>
            <Button block style={{ margin: 15, marginTop: 50 }}
              onPress={this.handleSubmit} >
              <Text>Guardar necesidad</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default AgregarNecesidad;
