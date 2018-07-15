import React from 'react'
import ConsultarPerfilOrganizacion from '../views/Perfiles/PerfilOrganizacion/ConsultarPerfilOrganizacion'

class ComponentRenderer extends React.Component {
    render() {
        return (
            <div>
              <ConsultarPerfilOrganizacion usuarioId='32'/>
            </div>
        )
    }
}
export default ComponentRenderer;