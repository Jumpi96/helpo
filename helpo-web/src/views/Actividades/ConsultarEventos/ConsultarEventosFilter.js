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
      optionsFunciones: [],
      optionsMateriales: [],
    };
    this.handleChangeFunciones = this.handleChangeFunciones.bind(this);
    this.handleChangeMateriales = this.handleChangeMateriales.bind(this);
  }

  componentDidMount() {
    api.get('/actividades/categorias_recurso/')
      .then((res) => {
        const optionsMateriales = this.loadOptions(res.data);
        api.get('/actividades/funciones/')
          .then((res) => {
              const optionsFunciones = this.loadOptions(res.data);
              this.setState({ optionsFunciones, optionsMateriales });
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
    this.updatePath(selectedMateriales, selectedFunciones);
  }

  handleChangeMateriales(selectedMateriales) {
    this.setState({ selectedMateriales });
    const { selectedFunciones } = this.state;
    this.updatePath(selectedMateriales, selectedFunciones);
  }

  updatePath(materiales, funciones) {
    let path = '?';
    if (materiales.length > 0) {
      path += 'necesidades=';
      materiales.forEach(function (m) {
        path += m.value + ',';
      });
      path = path[path.length-1] === ',' ? path.substring(0, path.length-1) : path;
      path += '&';
    }
    if (funciones.length > 0) {
      path += 'funciones=';
      funciones.forEach(function (m) {
        path += m.value + ',';
      });
      path = path.substring(0, path.length-1) + '&';
    }
    path = path[path.length-1] === '&' ? path.substring(0, path.length-1) : path;
    this.props.updatePath(path);
  }

  render() {
    return (
      <div>
        <Row>
            <Col md="3">
                <label for="materiales">Materiales</label>
                <Select
                  name="materiales"
                  options={this.state.optionsMateriales}
                  isMulti onChange={this.handleChangeMateriales}
                  value={this.state.selectedMateriales}
                />
            </Col>
            <Col md="3">
                <label for="funciones">Funciones</label>
                <Select
                  name="funciones"
                  options={this.state.optionsFunciones}
                  isMulti onChange={this.handleChangeFunciones}
                  value={this.state.selectedFunciones}
                />
            </Col>
        </Row>
    </div>
    );
  }  
};

export default ConsultarEventosFilter;  