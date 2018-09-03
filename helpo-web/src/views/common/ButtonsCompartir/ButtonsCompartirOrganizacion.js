import React, { Component } from 'react';
import facebook from '../../../assets/img/facebook.png';
import twitter from '../../../assets/img/twitter.png';
import google from '../../../assets/img/google.jpg';
import linkedin from '../../../assets/img/linkedin.png';

class ButtonsCompartirOrganizacion extends Component {

    render() {
        const ong = this.props.ong;
        return (
            <div className="wrapper">
                <div className="btn-group form-group" role="group">
                    {
                        // Facebook
                    }
                    <a target="_blank" rel="noopener noreferrer"
                        href={"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2F" +
                            "redirect%2Fong%3Fid%3D" + ong.id}>
                        <img src={facebook} alt="Compartir en Facebook" width="40" height="40" facebook-share-dialog="true" />
                    </a>
                    {
                        // Twitter
                    }
                    <a target="_blank" rel="noopener noreferrer"
                        href={"http://twitter.com/share?text=Sumate%20a%20los%20eventos%20de%20" + ong.nombre + "%20en%20Helpo" +
                            "&url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Fredirect%2Fong%3Fid%3D" + ong.id + "&hashtags=Helpo"}>
                        <img src={twitter} alt="Compartir en Twitter" width="40" height="40" />
                    </a>
                    {
                        // Google+
                    }
                    <a target="_blank" rel="noopener noreferrer"
                        href={"https://plus.google.com/share?url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Fredirect%2Fong%3Fid%3D" + ong.id}>
                        <img src={google} alt="Compartir en Google+" width="40" height="40" />
                    </a>
                    {
                        // LinkedIn
                    }
                    <a target="_blank" rel="noopener noreferrer"
                        href={"https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Fredirect%2Fong%3Fid%3D" +
                            ong.id + "&summary=Sumate%20a%20los%20eventos%20de%20" + ong.nombre + "%20en%20Helpo&source=Helpo"}>
                        <img src={linkedin} alt="Compartir en LinkedIn" width="40" height="40" />
                    </a>
                </div>
            </div>
        );
    }
}
export default ButtonsCompartirOrganizacion;