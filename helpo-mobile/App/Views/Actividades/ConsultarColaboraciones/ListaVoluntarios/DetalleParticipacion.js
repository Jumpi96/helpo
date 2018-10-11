import React from 'react'
import { connect } from 'react-redux'
import ContainerHeader from '../../../../Components/ContainerHeader'
import { Container, ListItem, Left, Body, Text, Icon } from 'native-base'
import { FlatList } from 'react-native'
import moment from 'moment'
import api from '../../../../api'
import ConsultarColabsActions from '../../../../Redux/ConsultarColabsRedux'

class DetalleParticipacion extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      participo: this.props.participacion.participo,
      retroalimentacion: this.props.participacion.retroalimentacion_ong
    }
    this.renderItem = this.renderItem.bind(this)
  }

  handleRetroalimentacion() {
    const mensaje = { 
      evento: this.props.eventoId, 
      voluntario: this.props.participacion.colaborador.id,
      es_colaboracion: false
    };
    api.post('feedbacks/retroalimentacion_ong/', mensaje)
      .then((res) => {
        this.setState({ retroalimentacion: true })
      })
      .catch((error) => {
        if (error.response){ console.log(error.response.status) }
        else { console.log('Error: ', error.message)}
      })
  }

  renderItem = (item) => {
    const defaultItem = (
      (<ListItem>
        <Left>
          <Text style={{ fontWeight: 'bold' }}>{item.key}: </Text>
        </Left>
        <Body>
          <Text>{item.value}</Text>
        </Body>
      </ListItem>)
    )
    const participoItem = (
      <ListItem button onPress={() => 
        {
          this.props.handleParticipo(this.props.participacion.id,
                                      !this.state.participo,
                                      this.props.eventoId
                                      )
          this.setState({ participo: !this.state.participo})
        }}>
        <Left>
          <Text style={{ fontWeight: 'bold' }}>{item.key}: </Text>
        </Left>
        <Body>
          {item.value
          ? <Icon color='red' type='Entypo' name='check'/>
          : <Icon color='black' type='Entypo' name='cross'/>}
        </Body>
      </ListItem>
    )
    const retroalimentacionItem = (
      <ListItem button onPress={() => 
        {
          if (!this.state.retroalimentacion) {
            this.handleRetroalimentacion();
          }
        }}>
        <Left>
          <Text style={{ fontWeight: 'bold' }}>{item.key}: </Text>
        </Left>
        <Body>
          {item.value
          ? <Icon color='red' type='Entypo' name='check'/>
          : <Icon color='black' type='Entypo' name='cross'/>}
        </Body>
      </ListItem>
    )
    if(item.key === 'Participó') {
      return participoItem
    } else if (item.key === 'Retroalimentación') {
      if (moment(this.props.evento.fecha_hora_inicio) > moment()) {
        return undefined;
      }
      return retroalimentacionItem;
    }
    return defaultItem
  }

  render() {
    return (
      <Container>
        <ContainerHeader titulo='Detalle participación' goBack={this.props.navigation.goBack}/>
        <FlatList
          data={[
            {key: 'Nombre', value: this.props.participacion.colaborador.nombre},
            {key: 'Apellido', value: this.props.participacion.colaborador.apellido},
            {key: 'Comentario', value: this.props.participacion.comentario},
            {key: 'Dni', value: this.props.participacion.colaborador.dni},
            {key: 'Participó', value: this.state.participo},
            {key: 'Retroalimentación', value: this.state.retroalimentacion}
          ]}
          renderItem={({item}) => this.renderItem(item)}
        />
      </Container>
    )
  }  
}

const mapStateToProps = state => ({
  evento: state.consultarColabs.data,
  participacion: state.consultarColabs.detalle,
  eventoId: state.consultarColabs.data.id
})

const mapDispatchToProps = dispatch => ({
  handleParticipo: (id, value, eventoId) => 
    dispatch(ConsultarColabsActions.consultarColabsChangePar(id, value, eventoId))
})

export default connect(mapStateToProps, mapDispatchToProps)(DetalleParticipacion)

