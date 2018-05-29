import React from "react";
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
  Fab,
  IconNB,
  View
} from "native-base";
import styles from "./styles";
import api from "../../../../api";

class RegistrarNecesidades extends React.Component {
  constructor(props){
    super(props);
    const evento = this.props.navigation.getParam("evento", undefined);
    this.state = {
      evento: evento,
      necesidades: [],
      error: undefined
    };
  }

  deleteNecesidad(id) {
    this.setState({ necesidadModificada: id });
  }

  componentDidMount() {
    this.loadNecesidades();
  }

  handleConfirmDelete(b) {
    console.log(b.text === "Eliminar");
    if (b.text === "Eliminar" ) {
      api.delete("/actividades/necesidades/" + this.state.necesidadModificada + "/")
      .then(res => {
        console.log(res);
        console.log(res.data);
        this.loadNecesidades();
      }).catch(function (error) {
        if (error.response){ console.log(error.response.status); }
        else { console.log("Error: ", error.message); }
        this.setState({ error: "Hubo un problema al cargar su información." });
      });
    }
    this.setState({
      necesidadModificada: { recurso: {} }
    });
  }

  loadNecesidades() {
    api.get("/actividades/necesidades/?evento=" + this.state.evento)
      .then(res => {
        const necesidadesData = res.data;
        this.setState({ necesidades: necesidadesData});
        console.log(necesidadesData);
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status); }
        else { console.log("Error: ", error.message); }
        this.setState({ error: "Hubo un problema al cargar su información." });
      });
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
                    this.handleConfirmDelete(deleteButtons[buttonIndex]);
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
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Registrar necesidades</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            {listaNecesidades}
          </Form>
        </Content>
        <View style={{ flex: 1 }}>
          <Fab
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: "#5067FF" }}
            position="bottomRight"
            onPress={() => this.props.navigation.navigate("AgregarNecesidad", {evento: this.state.evento})}
          >
            <IconNB name="md-add" />
          </Fab>
        </View>
      </Container>
    );
  }
}

export default RegistrarNecesidades;
