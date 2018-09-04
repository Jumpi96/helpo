import React, { Component } from 'react';
import api from '../../../api'
import ModalGenerico from '../ModalGenerico'
import { uploadImage } from '../../../Lib/Imagen'
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
  Text,
  TextInput,
  Picker,
} from 'native-base';

class ModificarPerfilVoluntario extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      nombre: this.props.nombre,
      // Checkeo null porque si es null react tira un warning (https://github.com/reactstrap/reactstrap/issues/570)
      telefono: this.props.data.telefono == null ? '' : this.props.data.telefono,
      dni: this.props.data.dni == null ? '' : this.props.data.dni,
      sexo: this.props.data.sexo == null ? '' : this.props.data.sexo,
      gustos: this.props.data.gustos == null ? '' : this.props.data.gustos,
      habilidades: this.props.data.habilidades == null ? '' : this.props.data.habilidades,
      avatar_url: this.props.data.avatar.url,
      showModal: false,
      modalType: 'success',
      errors: [],
      avatar_changed: false,
    }
    this.renderNombre  = this.renderNombre.bind(this);
    this.renderDni = this.renderDni.bind(this);
    this.renderTelefono = this.renderTelefono.bind(this);
    this.handleNombreChange = this.handleNombreChange.bind(this);
    this.handleDniChange = this.handleDniChange.bind(this);
    this.handleTelefonoChange = this.handleTelefonoChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSelectFile = this.onSelectFile.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleAvatarChange = this.handleAvatarChange.bind(this);
    this.renderGustos = this.renderGustos.bind(this);
    this.handleGustosChange = this.handleGustosChange.bind(this);
    this.renderHabilidades = this.renderHabilidades.bind(this);
    this.handleHabilidadesChange = this.handleHabilidadesChange.bind(this);
    this.handleSexoChange = this.handleSexoChange.bind(this);
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        () =>
          this.setState({
            avatar_url: reader.result,
            avatar_changed: true,
          }),
        false
      )
      reader.readAsDataURL(event.target.files[0])
    }
  }
  /**/
  renderSexo() {
    return (
      <Picker
        selectedValue={this.state.sexo}
        onValueChange={(itemValue) => this.setState({sexo: itemValue})}>
        <Picker.Item label="Java" value="" />
        <Picker.Item label="JavaScript" value="Hombre" />
        <Picker.Item label="JavaScript" value="Mujer" />
        <Picker.Item label="JavaScript" value="Otro" />
      </Picker>
    );
  }

  renderGustos() {
    return (
      <TextInput
        multiline={true}
        numberOfLines={5}
        onChangeText={(text) => this.setState({gustos:text})}
        value={this.state.gustos}
      />
    );
  }

  renderHabilidades() {
    return (
      <TextInput
      multiline={true}
      numberOfLines={5}
      onChangeText={(text) => this.setState({habilidades:text})}
      value={this.state.habilidades}
    />
    );
  }

  renderNombre() {
    return (
      <Item floatingLabel>
        <Label>Nombre</Label>
        <Input
          value={this.state.nombre}
          onChangeText={text => this.setState({ nombre: text })}
        />
      </Item>
    );    
  }

  renderApellido() {
    return (
      <Item floatingLabel>
      <Label>Apellido</Label>
      <Input
        value={this.state.apellido}
        onChangeText={text => this.setState({ apellido: text })}
      />
    </Item>
    );    
  }

  renderEmail() {
    return (
      <Item floatingLabel>
      <Label>Email</Label>
      <Input
        value={this.state.email}
        onChangeText={text => this.setState({ email: text })}
      />
    </Item>
    );    
  }

  renderTelefono() {
    return (
      <Item floatingLabel>
        <Label>Teléfono</Label>
        <Input
          value={this.state.telefono}
          onChangeText={text => this.setState({ telefono: text })}
        />
      </Item>
    );      
  }

  renderDni() {
    return (
      <Item floatingLabel>
        <Label>DNI</Label>
        <Input
          value={this.state.dni}
          onChangeText={text => this.setState({ dni: text })}
        />
      </Item>
    );  
  }

  handleAvatarChange(avatar_url) {
    this.setState({
      avatar_url: avatar_url,
      avatar_changed: true,
    })
  }
  
  async prepareSubmitData() {
    const newData = this.state
    let avatar_url = this.props.data.avatar.url
    if (this.state.avatar_changed ) {
      const rx = /\/9j\/.*/gm
      const encondedAvatar = rx.exec(this.state.avatar_url)[0]
      avatar_url = await uploadImage(encondedAvatar)
      if (avatar_url === 'recall') {
        avatar_url = await uploadImage(encondedAvatar)
      }
    }
    const submitData = {
      avatar: {url: avatar_url},
    }    
    if (newData.dni !== "") {
      submitData.dni = newData.dni
    }
    if (newData.gustos !== "") {
      submitData.gustos = newData.gustos
    }
    if (newData.habilidades !== "") {
      submitData.habilidades = newData.habilidades
    }
    if (newData.sexo !== "") {
      submitData.sexo = newData.sexo
    }
    if (newData.telefono !== "") {
      submitData.telefono = newData.telefono
    }
    return submitData
  }

  validateData(submitData) {
    if (submitData.avatar.url === 'error' || submitData.avatar.url == null) {
      let errors = this.state.errors
      errors.push("Imagen upload failure")
      this.setState({
        errors: errors
      })
      return false
    }
    this.setState({
      avatar_url: submitData.avatar.url
    })
    return true
  }

  handleSubmit() {
    this.prepareSubmitData().then( submitData => {
      console.log("DATA")
      console.log(submitData)
      if (this.validateData(submitData)) {
        api.put(`/perfiles/perfil_voluntario/${this.props.data.usuario.id}/`, submitData)
        .then(res => {
          if (res.status === 200) {
            this.setState({
              showModal: true,
              modalType: 'success'
            })
          }
          else {
            this.setState({
              showModal: true, // Hay que poner alerts o algo, ver como lo resolvio la Juli
              modalType: 'failure',
            })
          }
        })
      }
      console.log(this.state.errors)
    }) 
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.("SwitchToConsultar")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Registrar evento</Title>
          </Body>
          <Right />
        </Header>

        <Content>
          <Form>
          <Thumbnail large center source={{uri: this.props.data.avatar.url}} />
          <Separator bordered noTopBorder>
            <Text>Datos personales</Text>
          </Separator>
            {this.renderNombre}
            <Text style={styles.validationMessage}>{this.state.errors.nombre}</Text>
            {this.renderAellido}
            <Text style={styles.validationMessage}>{this.state.errors.apellido}</Text>
            {this.renderEmail}
            <Text style={styles.validationMessage}>{this.state.errors.email}</Text>
            {this.renderTelefono}
            <Text style={styles.validationMessage}>{this.state.errors.telefono}</Text>
            {this.renderDni}
            <Text style={styles.validationMessage}>{this.state.errors.dni}</Text>
            {this.renderSexo}
            <Separator bordered noTopBorder>
            <Text>Extras</Text>
            </Separator>
            <Text style={styles.validationMessage}>{this.state.errors.sexo}</Text>
            {this.renderGustos}
            <Text style={styles.validationMessage}>{this.state.errors.gustos}</Text>
            {this.renderHabilidades}

            <Button
              block style={{ margin: 15, marginTop: 50 }}
              onPress={this.handleSubmit}
            >
              <Text>Guardar Evento</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default ModificarPerfilVoluntario;