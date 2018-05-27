import React, { Component } from 'react';
import api from '../../../../api';


class SelectorItem extends Component {
  constructor(props){
    super(props);
    this.state = {
        categorias: [{ id: 0, nombre: 'Sin categorías' }],
        items: [{ id: 0, nombre: 'Sin ítems', categoria: {} }],
        categoria_id: 0
      };
    this.handleSelectItem = this.handleSelectItem.bind(this); 
    this.handleChangeCategoria = this.handleChangeCategoria.bind(this);
  }

  handleSelectItem(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const selectedId = e.target.options[selectedIndex].getAttribute('data-key');
    this.handleChangeItem(selectedId);
  }
  
  handleChangeItem(selectedId){
    this.props.onItemChange(selectedId);
  }

  handleChangeCategoria(e) {
    const selectedIndex = e.target.options.selectedIndex;
    const selectedId = e.target.options[selectedIndex].getAttribute('data-key');
    this.setState({ categoria_id: selectedId });
  }

  getCategoriaByItem(item) {
    api.get('/actividades/recursos/' + item + '/')
      .then(res => {
        const recursoData = res.data;
        return recursoData.categoria.id;
      })
      .catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  getItems(categoria) {
    api.get('/actividades/recursos/?categoria=' + categoria)
      .then(res => {
        const recursosData = res.data;
        return recursosData;
      })
      .catch(function (error) {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message) };
      })
  }

  componentDidMount() {
    let listaCategorias, selectedCategoria;
    api.get('/actividades/categorias_recurso')
      .then(res => {
        const categoriasData = res.data;
        listaCategorias = categoriasData;
        selectedCategoria = categoriasData[0].id;
        api.get('/actividades/recursos/?categoria=' + selectedCategoria)
          .then(res => {
            const recursosData = res.data;
            this.setState({ categorias:listaCategorias, categoria_id: selectedCategoria, items: recursosData});
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

  componentDidUpdate() {
    if (this.state.categoria_id !== 0) {
      api.get('/actividades/recursos/?categoria=' + this.state.categoria_id)
        .then(res => {
          const listaItems = res.data;
          this.setState({ items: listaItems });
        });
    }
  }


  render() {
    const listaCategorias = this.state.categorias.map((r) =>
      <option value={r.id} key={r.id} data-key={r.id}>{r.nombre}</option>
    );
    const listaItems = this.state.items.map((i) =>
      <option value={i.id} key={i.id} data-key={i.id}>{i.nombre}</option>
    );
    //alert(this.state.categoria_id + "a" + this.props.item);
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
            onChange={this.handleSelectItem}>
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

