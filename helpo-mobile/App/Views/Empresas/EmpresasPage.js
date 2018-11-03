import React from 'react';
import OrganizacionesPage from '../Organizaciones/OrganizacionesPage'

class EmpresasPage extends React.Component {
  render() {
    return (
      <OrganizacionesPage isAboutEmpresas={true} navigation={this.props.navigation} />
    );
  }
}

export default EmpresasPage;