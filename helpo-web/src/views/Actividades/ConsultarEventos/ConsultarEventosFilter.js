import React from 'react';
import { Col, Row } from 'reactstrap';
import Select from 'react-select';
import moment from 'moment';
import api from '../../../api.js'

class ConsultarEventosFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFunciones: [],
      selectedMateriales: [],
      selectedRubros: [],
      selectedFecha: { value: 0, label: 'Todas' },
      selectedUbicacion: { value: 0, label: 'Todas' },
      optionsFunciones: [],
      optionsMateriales: [],
      optionsRubros: [],
      optionsFechas: this.loadOptionsFecha(),
      optionsUbicaciones: this.loadOptionsUbicaciones(),
      latitud: undefined, longitud: undefined
    };
    this.handleChangeFunciones = this.handleChangeFunciones.bind(this);
    this.handleChangeMateriales = this.handleChangeMateriales.bind(this);
    this.handleChangeRubros = this.handleChangeRubros.bind(this);
    this.handleChangeFecha = this.handleChangeFecha.bind(this);
    this.handleChangeUbicacion = this.handleChangeUbicacion.bind(this);
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

  loadOptions(rawOptions) {
    const options = [];
    rawOptions.forEach(function(o) {
      options.push({ value: o.id, label: o.nombre });
    });
    return options;
  }

  loadOptionsFecha() {
    return [
      { value: 0, label: 'Todas' },
      { value: 1, label: 'Esta semana' },
      { value: 2, label: 'Próxima semana' },
      { value: 3, label: 'Próximo mes' },
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

  handleChangeFunciones(selectedFunciones) {
    this.setState({ selectedFunciones });
    const { selectedRubros, selectedMateriales, selectedFecha, selectedUbicacion } = this.state;
    this.updatePath(selectedMateriales, selectedFunciones, selectedRubros, selectedFecha, selectedUbicacion);
  }

  handleChangeMateriales(selectedMateriales) {
    this.setState({ selectedMateriales });
    const { selectedFunciones, selectedRubros, selectedFecha, selectedUbicacion } = this.state;
    this.updatePath(selectedMateriales, selectedFunciones, selectedRubros, selectedFecha, selectedUbicacion);
  }

  handleChangeRubros(selectedRubros) {
    this.setState({ selectedRubros });
    const { selectedFunciones, selectedMateriales, selectedFecha, selectedUbicacion } = this.state;
    this.updatePath(selectedMateriales, selectedFunciones, selectedRubros, selectedFecha, selectedUbicacion);
  }

  handleChangeFecha(selectedFecha) {
    this.setState({ selectedFecha });
    const { selectedFunciones, selectedMateriales, selectedRubros, selectedUbicacion } = this.state;
    this.updatePath(selectedMateriales, selectedFunciones, selectedRubros, selectedFecha, selectedUbicacion);
  }

  handleChangeUbicacion(selectedUbicacion) {
    if (this.state.longitud) {
      this.setState({ selectedUbicacion });
      const { selectedFunciones, selectedMateriales, selectedRubros, selectedFecha } = this.state;
      this.updatePath(selectedMateriales, selectedFunciones, selectedRubros, selectedFecha, selectedUbicacion);
    }
  }

  getValorFecha(fecha) {
    const { value } = fecha;
    let desde, hasta;
    if (value === 1) {
      desde = moment();
      hasta = moment().add(7, 'days');
    } else if (value === 2) {
      desde = moment().add(7, 'days');
      hasta = moment().add(14, 'days');
    } else if (value === 3) {
      desde = moment();
      hasta = moment().add(1, 'months');
    }
    return 'fecha_desde=' + desde.toISOString() + '&fecha_hasta=' + hasta.toISOString();
  }

  updatePath(materiales, funciones, rubros, fecha, ubicacion) {
    let ruta = '?';
    if (this.props.organizacion) {
      ruta += 'organizacion=' + this.props.organizacion + '&';
    }
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
    if (fecha.value !== 0) {
      ruta += this.getValorFecha(fecha) + '&';
    }
    if (ubicacion.value !== 0) {
      ruta += this.getValorUbicacion(ubicacion) + '&';
    }
    ruta = ruta[ruta.length-1] === '&' ? ruta.substring(0, ruta.length-1) : ruta;
    this.props.updatePath(ruta);
  }

  getValorUbicacion(selectedUbicacion) {
    const kms = selectedUbicacion.value;
    return 'kms=' + kms + '&latitud=' + this.state.latitud + '&longitud=' + this.state.longitud;
  }

  render() {
    return (
      <div>
        <Row>
            <Col md="2">
                <label for="materiales">Materiales</label>
                <Select
                  name="materiales"
                  placeholder="Seleccione..."
                  options={this.state.optionsMateriales}
                  isMulti onChange={this.handleChangeMateriales}
                  value={this.state.selectedMateriales}
                />
            </Col>
            <Col md="2">
                <label for="funciones">Funciones</label>
                <Select
                  name="funciones"
                  placeholder="Seleccione..."
                  options={this.state.optionsFunciones}
                  value={this.state.selectedFunciones}
                  isMulti onChange={this.handleChangeFunciones}
                />
            </Col>
            <Col md="2">
              <label for="rubros">Rubros</label>
              <Select
                name="rubros"
                placeholder="Seleccione..."
                options={this.state.optionsRubros}
                isMulti onChange={this.handleChangeRubros}
                value={this.state.selectedRubros}
              />
            </Col>
            <Col md="3">
              <label for="fechas">Fecha</label>
              <Select
                name="fechas"
                placeholder="Seleccione..."
                options={this.state.optionsFechas}
                onChange={this.handleChangeFecha}
                value={this.state.selectedFecha}
              />
            </Col>
            <Col md="3">
              <label for="ubicaciones">Ubicación</label>
              <Select
                name="ubicaciones"
                placeholder="Seleccione..."
                options={this.state.optionsUbicaciones}
                onChange={this.handleChangeUbicacion}
                value={this.state.selectedUbicacion}
              />
            </Col>
        </Row>
    </div>
    );
  }  
};

export default ConsultarEventosFilter;