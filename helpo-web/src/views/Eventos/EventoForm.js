import React from 'react';  
import { PropTypes } from 'prop-types';

class EventoForm extends React.Component {  
  render() {
    return (
      <div>
        <form>
          <input
            name="nombre"
            label="nombre"
            value={this.props.evento.nombre}
            onChange={this.props.onChange}/>

          <input
            type="submit"
            disabled={this.props.saving}
            className="btn btn-primary"
            onClick={this.props.onSave}/>
        </form>
      </div>
  );
  }
}

EventoForm.propTypes = {  
  evento: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export default EventoForm;  