import React, { Component } from 'react';
import facebook from '../../../assets/img/facebook.png';
import twitter from '../../../assets/img/twitter.png';
import google from '../../../assets/img/google.jpg';
import linkedin from '../../../assets/img/linkedin.png';

class ButtonsCompartirEvento extends Component {

    render() {
        const evento = this.props.evento;
        return (
            <div className="wrapper">
                <div className="btn-group form-group" role="group">
                    {
                        // Facebook
                    }
                    <a target="_blank" rel="noopener noreferrer"
                        href={"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2F" +
                            "redirect%2Fevento%3Fid%3D" + evento.id}>
                        <img src={facebook} alt="Compartir en Facebook" width="40" height="40" facebook-share-dialog="true" />
                    </a>
                    {
                        // Twitter
                    }
                    <a target="_blank" rel="noopener noreferrer"
                        href={"http://twitter.com/share?text=Sumate%20a%20este%20evento%20en%20Helpo%3A%20" + evento.nombre +
                            "&url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Fredirect%2Fevento%3Fid%3D" + evento.id + "&hashtags=Helpo"}>
                        <img src={twitter} alt="Compartir en Twitter" width="40" height="40" />
                    </a>
                    {
                        // LinkedIn
                    }
                    <a target="_blank" rel="noopener noreferrer"
                        href={"https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Fredirect%2Fevento%3Fid%3D" +
                            evento.id + "&summary=Sumate%20a%20este%20evento%20en%20Helpo%3A%20" + evento.nombre + "&source=Helpo"}>
                        <img src={linkedin} alt="Compartir en LinkedIn" width="40" height="40" />
                    </a>
                </div>
            </div>
        );
    }
}
export default ButtonsCompartirEvento;