import React from 'react'
import { ScrollView, Image, Dimensions, Modal, TouchableHighlight } from 'react-native'
import { Container, Fab, Icon, Text, View } from 'native-base'

/*
Modal para confirmar desuscripcion

Props:
  open
  toggle
  deleteSuscripcion
*/

class ModalDesubscribir extends React.Component {

  render() {
    return (
      <Modal
        visible={this.props.open}
        transparent={false}
        animationType="fade"
        onRequestClose={this.props.toggle}
        onDismiss={this.props.toggle}
      >
        <View style={{ marginTop: 22, backgroundColor: 'white', height: 100 }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
              Desea realmente cancelar la suscripcion?
              </Text>
            <TouchableHighlight
              style={{ backgroundColor: 'red', padding: 10, marginTop: 10, borderRadius: 10 }}
              onPress={() => { this.props.deleteSuscripcion(); this.props.toggle() }}>
              <Text style={{ color: 'white' }}>
                Remover
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )
  }
}

export default ModalDesubscribir

