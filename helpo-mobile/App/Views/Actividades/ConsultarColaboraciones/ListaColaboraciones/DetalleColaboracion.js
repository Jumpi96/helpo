import React from 'react'
import { connect } from 'react-redux'
import ContainerHeader from '../../../../Components/ContainerHeader'
import { Container, ListItem, Left, Body, Text, Icon } from 'native-base'
import { FlatList } from 'react-native'
import moment from 'moment'
import api from '../../../../api'
import ConsultarColabsActions from '../../../../Redux/ConsultarColabsRedux'

class DetalleColaboracion extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      retroalimentacion: this.props.colaboracion.retroalimentacion_ong
    }
    this.renderItem = this.renderItem.bind(this)
  }

  handleRetroalimentacion() {
    const mensaje = { 
      evento: this.props.eventoId, 
      voluntario: this.props.colaboracion.colaborador.id,
      es_colaboracion: true
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
    const entregadoItem = (
      <ListItem button onPress={() => 
        {
          this.props.handleEntregrado(this.props.colaboracion.id,
                                      !this.state.entregado,
                                      this.props.eventoId
                                      )
          this.setState({ entregado: !this.state.entregado})
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
    if(item.key === 'Entregado') {
      return entregadoItem
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
        <ContainerHeader titulo='Detalle Colaboracion' goBack={this.props.navigation.goBack}/>
        <FlatList
          data={[
            {key: 'Nombre', value: this.props.colaboracion.colaborador.nombre},
            {key: 'Apellido', value: this.props.colaboracion.colaborador.apellido},
            {key: 'Cantidad', value: this.props.colaboracion.cantidad},
            {key: 'Comentario', value: this.props.colaboracion.comentario},
            {key: 'Dni', value: this.props.colaboracion.colaborador.dni},
            {key: 'Entregados', value: this.props.colaboracion.entregados},
            {key: 'Entregado', value: this.props.colaboracion.entregados === this.props.colaboracion.cantidad},
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
  colaboracion: state.consultarColabs.detalle,
  eventoId: state.consultarColabs.data.id
})

const mapDispatchToProps = dispatch => ({
  handleEntregrado: (id, value, eventoId) => 
    dispatch(ConsultarColabsActions.consultarColabsChangeCol(id, value, eventoId))
})

export default connect(mapStateToProps, mapDispatchToProps)(DetalleColaboracion)

