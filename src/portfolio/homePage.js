
import logo from '../lib/images/peltast-logo3.png';
import portrait from '../lib/images/portrait.png';
import ProjectGrid from './projectGrid';


export const HomePage = () => {


    return (
        <div>
            <div className="container-fluid mainColumn">

                <img src={logo} style={{ padding: "40px 0px" }} />

                <div id="introduction" className="row homeItem">

                    <div className="col-sm-8">
                        Hi, my name is Patrick and I am a game developer.  My primary focus is on programming, but in my independent projects I have also been responsible for game design, art, and writing.
                        <br/><br/>
                        My focus has been on 2D online/instant play games - I started out making Flash games, and while I have branched out into other engines/platforms like Unity and Godot, I have remained interested in anything that can directly target browsers, such as OpenFL, CreateJS and PixiJS.
                        <br/><br/>
                        My first games were a short series of mystery games that added a supernatural twist to adventure game mechanics.  I've also worked on action, puzzle, and platforming games and have an ever-growing list of ideas to work on.  I'm particularly interested in bringing narrative and systems together, and evoking feeling through mechanics.
                        <br/><br/>
                        Outside of games, I'm passioniate in history, language, education, and the combination of any or all of those things.
                    </div>

                    <div className="col-sm-4">
                        <img src={portrait} />
                    </div>
                </div>

                <div className="projectHeader">
                    Skills
                </div>
                <div className="row homeItem">
                    <div class="col-sm-4">
                        <ul>
                            <li>Godot</li>
                            <li>CreateJS / PixiJS</li>
                            <li>Monogame</li>
                            <li>Actionscript 3 / Flash</li>
                        </ul>
                    </div>
                    <div class="col-sm-4">
                        <ul>
                            <li>C#</li>
                            <li>Javascript / Typescript</li>
                            <li>C / C++</li>
                            <li>T-SQL</li>
                        </ul>
                    </div>
                    <div class="col-sm-4">
                        <ul>
                            <li>React / React Native</li>
                            <li>HTML5 / CSS / Less</li>
                            <li>.NET / Miscrosoft SQL Server</li>
                            <li>Git / TFS / SVN</li>
                        </ul>
                    </div>
                </div>

                <div className="projectHeader">
                    Projects
                </div>

                <ProjectGrid />


            </div>


        </div>
    );
}


export default HomePage;