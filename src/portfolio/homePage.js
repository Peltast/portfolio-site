
import logo from '../lib/images/peltast-logo3.png';
import portrait from '../lib/images/portrait.png';
import ProjectGrid from './projectGrid';


export const HomePage = () => {


    return (
        <div>
            <div className="container-fluid mainColumn">

                <img src={logo} style={{ padding: "40px 0px" }} />

                <div id="introduction" className="row homeItem">
                    <div className=" col-sm-8">
                        Hi, my name is Patrick and I am a game developer, designer, artist, and writer. 
                        I'm interested in creating systems within games to tell stories, whether in overt narrative or in played experience. 
                        I try to explore some meaning and emotion in the narrative/mechanical design of my projects, no matter how small or large they are. 
                        All of that said, I just really enjoy the process of creating games too!
                        <br/><br/>
                        My focus has been on 2D games that can run out of web browsers, which has led to most of my projects involving Flash, Haxe/OpenFL, or HTML5/Javascript. 
                        But I like to dabble and I'm always open to learning and using new languages and tools.
                        <br/><br/>
                        Outside of games I'm passionate about history (especially ancient), language, education, and the combination of any or all of those things.
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
                            <li>C#</li>
                            <li>Javascript / jQuery</li>
                            <li>HTML5 / CSS / Less</li>
                            <li>T-SQL</li>
                        </ul>
                    </div>
                    <div class="col-sm-4">
                        <ul>
                            <li>Actionscript 3</li>
                            <li>C / C++</li>
                            <li>Scheme</li>
                            <li>Python</li>
                        </ul>
                    </div>
                    <div class="col-sm-4">
                        <ul>
                            <li>Apex / SOQL</li>
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