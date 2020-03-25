import * as React from "react";
import devices from './images/devices.png';
import planet from './images/planet.png';
import rakete from './images/rakete.png';
import './WelcomeComponent.css';

class WelcomeComponent extends React.Component {
    public render() {
        return (

            <div id="welcomeScreen">
                <div>
                    <div id="row">


                        <div className="col-6 col-s-9">
                            <img src={rakete} width="200px" alt="Simple.Chat"/>
                        </div>

                        <div className="col-6 col-s-9">
                            <h1>Private Chat</h1>
                            <p>
                                Simple.Chat bringt privatsphäre mit. Diskutiere in einem privaten Chat über wichtige
                                Themen, bevor diese im Team geteilt werden.
                            </p>
                        </div>

                    </div>

                    <div id="row">
                        <div className="col-7 col-s-7"/>

                        <div className="col-5 col-s-5">
                            <img src={devices} width="500px" alt="Simple.Chat"/></div>
                    </div>

                    <div id="row">
                        <div className="col-6 col-s-9">
                            <h1>Group Chat</h1>

                            <p> Simple.Chat bringt dein Team und dessen Ressourcen auf einem zentralen Workspace
                                zusammen.
                                Diskussionen sind übersichtlich in Channels organisiert. Erstelle für jedes Team einen
                                eigenen Channel.</p>
                        </div>
                        <div className="col-6 col-s-9">
                            <img src={planet} width="200px" alt="Simple.Chat"/>
                        </div>


                    </div>


                </div>
            </div>

        );
    }
}

export default WelcomeComponent;