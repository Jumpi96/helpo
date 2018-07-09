import React, { Component } from 'react';

class SuccessPresentation extends Component {
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
            <h4>Su correo ha sido verificado</h4>
        </div>        
     )
    }
}

export default SuccessPresentation; 