import React, { Component } from 'react';
import SuccessPresentation from './SuccessPresentation'
import FailedPresentation from './FailedPresentation'
import Loading from './Loading'
import api from '../../../api'

class ConfirmMail extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoaded: false,
            isConfirmed: false,
            error: '',
        }
    }

    checkConfirmation(verification_response) {
        if(verification_response === 'Success'){
            this.setState({
                isConfirmed: true,
                isLoaded: true,
            })
        }
        else {
            this.setState({                
                isLoaded: true,
            })
        }
        
    }

    componentDidMount() {
        const token = this.props.match.params.token
        api.post('/verify_email/', {
            token            
        })
        .then((res) => {console.log(res);this.checkConfirmation(res.data.verification);})
        .catch((error) => {
            //TODO: Handle error better
            this.setState({ error: JSON.stringify(error) }) 
        }
     )
    }

    render() {
        const {error, isLoaded, isConfirmed} = this.state
        if (error !== '') {
            return (<div><p>Error: {error}</p></div>)
        }
        else if (!isLoaded) {
            return (<Loading/>)
        }
        else if (isConfirmed){
            return (
                <SuccessPresentation/>
            )
        }
        else {
            return (
                <FailedPresentation/>
            )
        }
    }
}
export default ConfirmMail;