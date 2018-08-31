import React, { Component } from 'react';

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
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png"
                            alt="Compartir en Facebook" width="40" height="40" facebook-share-dialog="true" />
                    </a>
                    {
                        // Twitter
                    }
                    <a target="_blank" rel="noopener noreferrer"
                        href={"http://twitter.com/share?text=Sumate%20a%20este%20evento%20en%20Helpo%3A%20" + evento.nombre +
                            "&url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Fredirect%2Fevento%3Fid%3D" + evento.id + "&hashtags=Helpo"}>
                        <img src="https://seeklogo.com/images/T/twitter-2012-negative-logo-5C6C1F1521-seeklogo.com.png"
                            alt="Compartir en Twitter" width="40" height="40" />
                    </a>
                    {
                        // Google+
                    }
                    <a target="_blank" rel="noopener noreferrer"
                        href={"https://plus.google.com/share?url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Fredirect%2Fevento%3Fid%3D" + evento.id}>
                        <img src="https://i.ebayimg.com/images/g/jqIAAOSwnHZYX128/s-l1600.jpg"
                            alt="Compartir en Google+" width="40" height="40" />
                    </a>
                    {
                        // LinkedIn
                    }
                    <a target="_blank" rel="noopener noreferrer"
                        href={"https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.helpo.com.ar%2F%23%2Fredirect%2Fevento%3Fid%3D" +
                            evento.id + "&summary=Sumate%20a%20este%20evento%20en%20Helpo%3A%20" + evento.nombre + "&source=Helpo"}>
                        <img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-linkedin-512.png"
                            alt="Compartir en LinkedIn" width="40" height="40" />
                    </a>
                </div>
            </div>
        );
    }
}
export default ButtonsCompartirEvento;