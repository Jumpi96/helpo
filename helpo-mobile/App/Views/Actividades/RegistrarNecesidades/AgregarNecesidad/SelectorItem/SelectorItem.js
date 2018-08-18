import React from "react";
import {
    Picker,
    ListItem,
    Item,
    Left,
    Body,
    Text,
    View
}
from "native-base";
import api from '../../../../../api';


class SelectorItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        categorias: [{ id: 0, nombre: "Sin categorías" }],
        items: [{ id: 0, nombre: "Sin ítems", categoria: {
          id: 0, nombre: "Sin categorías"
         } }],
        categoria_id: 0
      };
    this.handleChangeItem = this.handleChangeItem.bind(this);
    this.handleChangeCategoria = this.handleChangeCategoria.bind(this);
  }

  handleChangeItem(value, index) {
    this.props.onItemChange(value);
  }

  handleChangeCategoria(value, index) {
    this.setState({ categoria_id: value });
  }

  componentDidMount() {
    let listaCategorias, selectedCategoria;
    api.get("/actividades/categorias_recurso/")
      .then(res => {
        const categoriasData = res.data;
        listaCategorias = categoriasData;
        selectedCategoria = categoriasData[0].id;
        api.get("/actividades/recursos/")
          .then(re => {
            const recursosData = re.data;
            this.setState({
              categorias:listaCategorias,
              categoria_id: selectedCategoria,
              items: recursosData
            });
          })
          .catch(function (error) {
            if (error.response){ console.log(error.response.status); }
            else { console.log("Error: ", error.message); }
          });
      })
      .catch(function (error) {
        if (error.response){ console.log(error.response.status); }
        else { console.log("Error: ", error.message); }
      });
  }

  render() {
    const listaCategorias = this.state.categorias.map((r) =>
      <Item value={r.id} key={r.id} label={r.nombre}/>
    );
    const listaItems = this.state.items.filter(i => i.categoria.id === this.state.categoria_id)
      .map((i) => <Item value={i.id} key={i.id} label={i.nombre}/>
    );
    return (
      <View>
        <ListItem>
          <Left>
            <Text>Categoría</Text>
          </Left>
          <Body>
            <Picker
              note
              mode="dropdown"
              selectedValue={this.state.categoria_id}
              onValueChange={this.handleChangeCategoria}>
                {listaCategorias}
            </Picker>
          </Body>
        </ListItem>
        <ListItem>
          <Left>
            <Text>Recurso</Text>
          </Left>
          <Body>
            <Picker
              note
              mode="dropdown"
              selectedValue={this.props.item}
              onValueChange={this.handleChangeItem}>
                {listaItems}
            </Picker>
          </Body>
        </ListItem>
      </View>
    );
  }
}

export default SelectorItem;
