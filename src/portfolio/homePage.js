

import { Link } from 'react-router-dom';

import logo from '../lib/images/peltast-logo3.png';
import portrait from '../lib/images/portrait.png';


export const HomePage = () => {


    return (
        <div>
            <div className="container-fluid mainColumn">

                <img src={logo} style={{ padding: "40px 0px" }} />

                <div id="introduction" className="row homeItem">
                    <div className=" col-sm-8">
                        Hi, my name is Patrick and I am a game developer, designer, artist, and writer.
                    </div>

                    <div className="col-sm-4">
                        <img src={portrait} />
                    </div>
                </div>

                <div className="contentHeader">
                    Skills
                </div>
                <div className="row homeItem">
                    <ul>
                        <li>Skill 1</li>
                        <li>Skill 2</li>
                        <li>Skill 3</li>
                        <li>Skill 4</li>
                    </ul>
                </div>

                <div className="contentHeader">
                    Projects
                </div>

                <div>
                    <Link to="/projectPage/:waidas">WAIDAS</Link>
                    <Link to="/projectPage">Click me</Link>
                </div>

            </div>


        </div>
    );
}


export default HomePage;