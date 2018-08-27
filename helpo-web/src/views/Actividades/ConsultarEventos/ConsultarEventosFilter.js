import React from 'react';
import { Col, Row } from 'reactstrap';
import Select from 'react-select';
import api from '../../../api.js'

class ConsultarEventosFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFunciones: [],
      selectedMateriales: [],
      selectedRubros: [],
      optionsFunciones: [],
      optionsMateriales: [],
      optionsRubros: [],
    };
    this.handleChangeFunciones = this.handleChangeFunciones.bind(this);
    this.handleChangeMateriales = this.handleChangeMateriales.bind(this);
    this.handleChangeRubros = this.handleChangeRubros.bind(this);
  }

  componentDidMount() {
    api.get('/actividades/categorias_recurso/')
      .then((res) => {
        const optionsMateriales = this.loadOptions(res.data);
        api.get('/actividades/funciones/')
          .then((res) => {
            const optionsFunciones = this.loadOptions(res.data);
            api.get('/actividades/rubros_evento/')
              .then((res) => {
                const optionsRubros = this.loadOptions(res.data);
                this.setState({ optionsFunciones, optionsMateriales, optionsRubros });
              })
          })
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      });
  }

  loadOptions(rawOptions) {
    const options = [];
    rawOptions.forEach(function(o) {
      options.push({ value: o.id, label: o.nombre });
    });
    return options;
  }

  handleChangeFunciones(selectedFunciones) {
    this.setState({ selectedFunciones });
    const { selectedMateriales } = this.state;
    const { selectedRubros } = this.state;
    this.updatePath(selectedMateriales, selectedFunciones, selectedRubros);
  }

  handleChangeMateriales(selectedMateriales) {
    this.setState({ selectedMateriales });
    const { selectedFunciones } = this.state;
    const { selectedRubros } = this.state;
    this.updatePath(selectedMateriales, selectedFunciones, selectedRubros);
  }

  handleChangeRubros(selectedRubros) {
    this.setState({ selectedRubros });
    const { selectedFunciones } = this.state;
    const { selectedMateriales } = this.state;
    this.updatePath(selectedMateriales, selectedFunciones, selectedRubros);
  }

  updatePath(materiales, funciones, rubros) {
    let ruta = '?';
    if (materiales.length > 0) {
      ruta += 'necesidades=';
      materiales.forEach(function (m) {
        ruta += m.value + ',';
      });
      ruta = ruta[ruta.length-1] === ',' ? ruta.substring(0, ruta.length-1) : ruta;
      ruta += '&';
    }
    if (funciones.length > 0) {
      ruta += 'funciones=';
      funciones.forEach(function (m) {
        ruta += m.value + ',';
      });
      ruta = ruta.substring(0, ruta.length-1) + '&';
    }
    if (rubros.length > 0) {
      ruta += 'rubros=';
      rubros.forEach(function (f) {
        ruta += f.value + ',';
      });
      ruta = ruta.substring(0, ruta.length-1) + '&';
    }
    ruta = ruta[ruta.length-1] === '&' ? ruta.substring(0, ruta.length-1) : ruta;
    this.props.updatePath(ruta);
  }

  render() {
    return (
      <div>
        <Row>
            <Col md="3">
                <label for="materiales">Materiales</label>
                <Select
                  name="materiales"
                  placeholder="Seleccione..."
                  options={this.state.optionsMateriales}
                  isMulti onChange={this.handleChangeMateriales}
                  value={this.state.selectedMateriales}
                />
            </Col>
            <Col md="3">
                <label for="funciones">Funciones</label>
                <Select
                  name="funciones"
                  placeholder="Seleccione..."
                  options={this.state.optionsFunciones}
                  isMulti onChange={this.handleChangeFunciones}
                  value={this.state.selectedFunciones}
                />
            </Col>
            <Col md="3">
              <label for="rubros">Rubros</label>
              <Select
                name="rubros"
                placeholder="Seleccione..."
                options={this.state.optionsRubros}
                isMulti onChange={this.handleChangeRubros}
                value={this.state.selectedRubros}
              />
            </Col>
        </Row>
    </div>
    );
  }  
};

export default ConsultarEventosFilter;  