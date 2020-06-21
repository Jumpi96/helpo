import React from 'react';
import { Col, Row, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import LocationPicker from 'react-location-picker';
import Select from 'react-select';
import moment from 'moment';
import api from '../../api.js';

class VoluntariosFilter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedStates: [],
      selectedModalities: [],
      selectedSkills: [],
      selectedInterests: [],
      optionsStates: [],
      optionsSkills: [],
      optionsModalities: [],
      optionsInterests: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    api.get('/perfiles/rubros_organizacion/')
      .then((res) => {
        const optionsInterests = this.loadOptions(res.data);
        api.get('/users/modalities/')
          .then((res) => {
            const optionsModalities = this.loadOptions(res.data);
            api.get('/users/skills/')
              .then((res) => {
                  const optionsSkills = this.loadOptions(res.data);
                  api.get('/users/states/')
                    .then((res) => {
                        const optionsStates = this.loadOptions(res.data);
                        this.setState({ 
                            optionsInterests, 
                            optionsModalities, 
                            optionsSkills,
                            optionsStates
                        });
                    })
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

  handleChange(key, selected) {
    this.setState({ [key]: selected });
    const { selectedStates, selectedSkills, selectedModalities, selectedInterests } = this.state;
    this.updatePath(
        key == "selectedInterests" ? selected : selectedInterests,
        key == "selectedModalities" ? selected : selectedModalities,
        key == "selectedSkills" ? selected : selectedSkills,
        key == "selectedStates" ? selected : selectedStates
    );
  }

  updatePath(selectedInterests, selectedModalities, selectedSkills, selectedStates) {
    let ruta = '?';
    if (selectedInterests.length > 0) {
      ruta += 'interests=';
      selectedInterests.forEach(function (m) {
        ruta += m.value + ',';
      });
      ruta = ruta[ruta.length-1] === ',' ? ruta.substring(0, ruta.length-1) : ruta;
      ruta += '&';
    }
    if (selectedModalities.length > 0) {
      ruta += 'modalities=';
      selectedModalities.forEach(function (m) {
        ruta += m.value + ',';
      });
      ruta = ruta.substring(0, ruta.length-1) + '&';
    }
    if (selectedSkills.length > 0) {
      ruta += 'skills=';
      selectedSkills.forEach(function (f) {
        ruta += f.value + ',';
      });
      ruta = ruta.substring(0, ruta.length-1) + '&';
    }
    if (selectedStates.length > 0) {
        ruta += 'states=';
        selectedStates.forEach(function (f) {
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
                <label for="states">Provincia</label>
                <Select
                  name="states"
                  placeholder="Seleccione..."
                  options={this.state.optionsStates}
                  isMulti onChange={(s) => this.handleChange("selectedStates", s)}
                  value={this.state.selectedStates}
                />
            </Col>
            <Col md="3">
                <label for="modalities">Modalidad</label>
                <Select
                  name="modalities"
                  placeholder="Seleccione..."
                  options={this.state.optionsModalities}
                  value={this.state.selectedModalities}
                  isMulti onChange={(s) => this.handleChange("selectedModalities", s)}
                />
            </Col>
            <Col md="3">
              <label for="interests">Áreas de interés</label>
              <Select
                name="interests"
                placeholder="Seleccione..."
                options={this.state.optionsInterests}
                isMulti onChange={(s) => this.handleChange("selectedInterests", s)}
                value={this.state.selectedInterests}
              />
            </Col>
            <Col md="3">
              <label for="skills">Habilidades</label>
              <Select
                name="skills"
                placeholder="Seleccione..."
                options={this.state.optionsSkills}
                isMulti onChange={(s) => this.handleChange("selectedSkills", s)}
                value={this.state.selectedSkills}
              />
            </Col>
        </Row>
      </div>
    );
  }  
};

export default VoluntariosFilter;