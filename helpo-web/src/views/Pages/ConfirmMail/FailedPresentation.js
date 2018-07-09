import React, { Component } from 'react';

class FailedPresentation extends Component {
    render() {
        return (            
            <div class="card" 
                style={
                    {width: "18rem",
                     margin: "auto",
                     padding: "10px",
                     marginTop: "30px",
                    }
                    }>
                <h4>Hubo un error al querer verificar su correo</h4>
                <hr/>
                <p>Ingrese a su cuenta y reenvie el correo de verificación</p>
            </div>        
         )
    }
}

export default FailedPresentation; 