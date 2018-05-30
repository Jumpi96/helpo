import React, { Component } from 'react';
import api from '../../../../api';


class SelectorItem extends Component {
  constructor(props){
    super(props);
    this.state = {
        categorias: [{ id: 0, nombre: 'Sin categorías' }],
        items: [{ id: 0, nombre: 'Sin ítems', categoria: {
          id: 0, nombre: 'Sin categorías' 
         } }],
        categoria_id: 0
      };
    this.handleChangeItem = this.handleChangeItem.bind(this); 
    this.handleChangeCategoria = this.handleChangeCategoria.bind(this);
  }

  handleChangeItem(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const selectedId = e.target.options[selectedIndex].getAttribute('data-key');
    this.props.onItemChange(selectedId);
  }

  handleChangeCategoria(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const selectedId = e.target.options[selectedIndex].getAttribute('data-key');
    // eslint-disable-next-line
    this.setState({ categoria_id: parseInt(selectedId) });
  }

  componentDidMount() {
    let listaCategorias, selectedCategoria;
    api.get('/actividades/categorias_recurso')
      .then(res => {
        const categoriasData = res.data;
        listaCategorias = categoriasData;
        selectedCategoria = categoriasData[0].id;
        api.get('/actividades/recursos')
          .then(res => {
            const recursosData = res.data;
            this.setState({ 
              categorias:listaCategorias, 
              categoria_id: selectedCategoria, 
              items: recursosData
            });
          })
          .catch(function (error) {
            if (error.response){ console.log(error.response.status) }
            else { console.log('Error: ', error.message) };
          })
      })
      .catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message) };
      })
  }

  render() {
    const listaCategorias = this.state.categorias.map((r) =>
      <option value={r.id} key={r.id} data-key={r.id}>{r.nombre}</option>
    );
    const listaItems = this.state.items.filter(i => i.categoria.id === this.state.categoria_id)
      .map((i) => <option value={i.id} key={i.id} data-key={i.id}>{i.nombre}</option>
    );
    return(
      <div className="row">
        <div className="col-md-6">
          <select
            value={this.state.categoria_id}
            className="form-control"
            onChange={this.handleChangeCategoria}>
              {listaCategorias}
          </select>
        </div>
        <div className="col-md-6">
          <select
            value={this.props.item}
            className="form-control"
            onChange={this.handleChangeItem}>
            {listaItems}
          </select>
        </div>
      </div>
    )
  }
}

SelectorItem.defaultProps = {
  item: 0
}

export default SelectorItem;

