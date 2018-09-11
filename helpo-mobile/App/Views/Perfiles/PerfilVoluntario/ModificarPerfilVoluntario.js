import React, { Component } from 'react';
import api from '../../../api'
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
  Thumbnail,
  Separator,
} from 'native-base';
import styles from './styles'

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
      errors: [],
      avatar_changed: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSelectFile = this.onSelectFile.bind(this);
    this.handleAvatarChange = this.handleAvatarChange.bind(this);
    this.validateData = this.validateData.bind(this);
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
            })
          }
          else {
            this.setState({
              showModal: true, // Hay que poner alerts o algo, ver como lo resolvio la Juli
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
            <Button transparent onPress={() => {this.props.switchToConsultar}}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Modificar perfil</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => {this.handleSubmit}}>
              <Icon name="confirm" />
            </Button>
          </Right>
        </Header>

        <Content>
          <Form>
          <Separator bordered noTopBorder>
            <Text>Datos personales</Text>
          </Separator>
          
            <Item floatingLabel>
              <Label>Nombre</Label>
              <Input
                value={this.state.nombre}
                onChangeText={text => this.setState({ nombre: text })}
              />
            </Item>
            <Text style={styles.validationMessage}>{this.state.errors.nombre}</Text>

            <Item floatingLabel>
              <Label>Apellido</Label>
              <Input
                value={this.state.apellido}
                onChangeText={text => this.setState({ apellido: text })}
              />
            </Item>
            <Text style={styles.validationMessage}>{this.state.errors.apellido}</Text>

            <Item floatingLabel>
              <Label>Email</Label>
              <Input
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
              />
            </Item>
            <Text style={styles.validationMessage}>{this.state.errors.email}</Text>

            <Item floatingLabel>
              <Label>Teléfono</Label>
              <Input
                value={this.state.telefono}
                onChangeText={text => this.setState({ telefono: text })}
              />
            </Item>
            <Text style={styles.validationMessage}>{this.state.errors.telefono}</Text>

            <Item floatingLabel>
              <Label>DNI</Label>
              <Input
                value={this.state.dni}
                onChangeText={text => this.setState({ dni: text })}
              />
            </Item>
            <Text style={styles.validationMessage}>{this.state.errors.dni}</Text>

            <Picker
              selectedValue={this.state.sexo}
              onValueChange={(itemValue) => this.setState({sexo: itemValue})}>
              <Picker.Item label="Java" value="" />
              <Picker.Item label="JavaScript" value="Hombre" />
              <Picker.Item label="JavaScript" value="Mujer" />
              <Picker.Item label="JavaScript" value="Otro" />
            </Picker>
            <Text style={styles.validationMessage}>{this.state.errors.sexo}</Text>

            <Separator bordered noTopBorder>
            <Text>Extras</Text>
            </Separator>

            <TextInput
              multiline={true}
              numberOfLines={5}
              onChangeText={(text) => this.setState({gustos:text})}
              value={this.state.gustos}
            />
            <Text style={styles.validationMessage}>{this.state.errors.gustos}</Text>

            <TextInput
              multiline={true}
              numberOfLines={5}
              onChangeText={(text) => this.setState({habilidades:text})}
              value={this.state.habilidades}
            />

          </Form>
        </Content>
      </Container>
    );
  }
}

export default ModificarPerfilVoluntario;