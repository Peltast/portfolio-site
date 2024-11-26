import { Link } from "react-router-dom";

import headerLogo from "../lib/images/peltast-logo-whiteheader.png";
import headerLogoHover from "../lib/images/peltast-logo-redheader.png";
import { ProjectData } from "../project_content/projectData";
import ProjectMediaGallery from "./projectMediaGallery";

export const ProjectPage = ({projectKey}) => {

    const key = projectKey ?? "";
    const project = ProjectData[key];

    const imageNumber = Object.hasOwn(project, 'images') ? project.images : -1;
    const gifNumber = Object.hasOwn(project, 'gifs') ? project.gifs : -1;
    const projectHasMedia = imageNumber > 0 || gifNumber > 0;
    
    return (
        <div>

            <div className="header">
                <Link to="/">
                    <div>
                        <img id="headerLogo" src={headerLogo} />
                        <img id="headerLogoHover" src={headerLogoHover} />
                        <span>Home</span>
                    </div>
                </Link>
            </div>

            <div className="container-fluid mainColumn">
                <div className="row projectTitle">
                    <div className="" id="projectTitle">
                        {project.title}
                    </div>
                </div>

                { project.subjectHTML && 
                    <div className="row">
                        <div className="projectSubject" id="projectSubject">
                            { project.subjectHTML() }
                        </div>
                    </div>
                }

                <div id="projectInfo" className="row">

                    { project.audienceTextHTML &&
                        <div className="projectDescription">
                            { project.audienceTextHTML() }
                        </div>
                    }

                    { project.devTextHTML && 
                        <>
                            <div className="projectHeader" id="devHeader" >
                                About
                            </div>

                            <div className="projectDescription">
                                { project.devTextHTML() }
                            </div>
                        </>
                    }
                </div>

                { projectHasMedia &&
                    <div className="row" id="projectGallery">
                        <div className="projectHeader" id="mediaHeader" >
                            Media
                        </div>

                        <ProjectMediaGallery projectKey={projectKey} fileFormat={'png'} numOfFiles={imageNumber} />

                    </div>
                }

                { project.reviewsHTML &&
                    <div className="row" id="projectReviews">
                        <div className="projectHeader" id="reviewsHeader">
                            Reviews
                        </div>
                        { project.reviewsHTML() }
                    </div>
                }
                { project.links &&
                    <div className="row" id="projectLinks">
                        <div className="projectHeader" id="linksHeader" >
                            Links
                        </div>
                    </div>
                }


            </div>

        </div>
    );

}


export default ProjectPage;