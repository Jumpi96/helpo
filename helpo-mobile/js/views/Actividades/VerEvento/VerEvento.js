import React from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
  Button,
  Container,
  Header,
  Left,
  Body,
  Title,
  Content,
  Form,
  Icon,
  Text,
} from 'native-base';
import { openDrawer } from '../../../actions/drawer';
import styles from './styles';

class VerEvento extends React.Component {

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Ver evento</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <Text>{this.props.evento.nombre}</Text>
          </Form>
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key))
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  themeState: state.drawer.themeState,
});

export default connect(mapStateToProps, bindAction)(VerEvento);
