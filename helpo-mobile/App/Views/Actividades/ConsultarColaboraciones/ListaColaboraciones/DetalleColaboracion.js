import React from 'react'
import { connect } from 'react-redux'
import ContainerHeader from '../../../../Components/ContainerHeader'
import { Container, ListItem, Left, Body, Text, Icon } from 'native-base'
import { FlatList } from 'react-native'
import ConsultarColabsActions from '../../../../Redux/ConsultarColabsRedux'

class DetalleColaboracion extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      entregado: this.props.colaboracion.entregado
    }
    this.renderItem = this.renderItem.bind(this)
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
    if(item.key === 'Entregado') {
      return entregadoItem
    }
    return defaultItem
  }

  render() {
    return (
      <Container>
        <ContainerHeader titulo='Detalle Colaboracion' goBack={this.props.navigation.goBack}/>
        <FlatList
          data={[
            {key: 'Nombre', value: this.props.colaboracion.voluntario.nombre},
            {key: 'Apellido', value: this.props.colaboracion.voluntario.apellido},
            {key: 'Cantidad', value: this.props.colaboracion.cantidad},
            {key: 'Comentario', value: this.props.colaboracion.comentario},
            {key: 'Dni', value: this.props.colaboracion.voluntario.dni},
            {key: 'Entregado', value: this.state.entregado}
          ]}
          renderItem={({item}) => this.renderItem(item)}
        />
      </Container>
    )
  }  
}

const mapStateToProps = state => ({
  colaboracion: state.consultarColabs.detalle,
  eventoId: state.consultarColabs.data.id
})

const mapDispatchToProps = dispatch => ({
  handleEntregrado: (id, value, eventoId) => 
    dispatch(ConsultarColabsActions.consultarColabsChangeCol(id, value, eventoId))
})

export default connect(mapStateToProps, mapDispatchToProps)(DetalleColaboracion)

