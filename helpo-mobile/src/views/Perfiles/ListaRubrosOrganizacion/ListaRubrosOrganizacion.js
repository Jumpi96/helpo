import React from "react";
import {
  Picker,
  Item,
  Body,
  Left,
  ListItem,
  Text,
} from "native-base";
import api from "../../../../../api";


class ListaRubrosOrganizacion extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      rubros: [{ id: 0, nombre: "Sin rubros" }]
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(value, index) {
    this.props.onRubroChange(value);
  }

  componentDidMount(){
    api.get("/perfiles/rubros_organizacion")
      .then(res => {
        const rubrosData = res.data;
        this.setState({ rubros: rubrosData });
        this.props.rubro_id = rubrosData[0].id;
      })
      .catch(function (error) {
        if (error.response){ console.log(error.response.status); }
        else { console.log("Error: ", error.message); }
      });
  }

  render(){
    const ListaRubrosOrganizacion = this.state.rubros.map((r) =>
      <Item value={r.id} key={r.id} label={r.nombre}/>
    );
    return (
      <ListItem>
        <Left>
          <Text>Rubro</Text>
        </Left>
        <Body>
          <Picker
            note
            mode="dropdown"
            selectedValue={this.props.rubro_id}
            onValueChange={this.handleChange}
          >
            {ListaRubrosOrganizacion}
          </Picker>
        </Body>
      </ListItem>
    );
  }
}

export default ListaRubrosOrganizacion;
