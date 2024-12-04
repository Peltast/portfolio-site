import { Link } from "react-router-dom";

import { ProjectData } from "../project_content/projectData";
import ProjectMediaGallery from "./projectMediaGallery";

import headerLogo from "../lib/images/peltast-logo-whiteheader.png";
import headerLogoHover from "../lib/images/peltast-logo-redheader.png";


export const ProjectPage = ({projectKey}) => {

    const key = projectKey ?? "";
    const project = ProjectData[key];
    
    let imageNumber, gifNumber = -1;
    let projectHasMedia = false;

    if (project) {
        imageNumber = Object.hasOwn(project, 'images') ? project.images : -1;
        gifNumber = Object.hasOwn(project, 'gifs') ? project.gifs : -1;
        projectHasMedia = imageNumber > 0 || gifNumber > 0;
    }

    return (
        <div>
            <div className="header">
                <Link to="/">
                    <div>
                        <img id="headerLogo" src={headerLogo} />
                        <img id="headerLogoHover" src={headerLogoHover} />
                        &nbsp;<span>Home</span>
                    </div>
                </Link>
            </div>

            { project && <>

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
                            <br/>
                            <ProjectMediaGallery projectKey={projectKey} fileFormat={'gif'} numOfFiles={gifNumber} />

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
                    { project.userReviewsHTML &&
                        <div className="row" id="projectLinks">
                            <div className="projectHeader" id="linksHeader" >
                                User Reviews
                            </div>
                            { project.userReviewsHTML() }
                        </div>
                    }
                    { project.linksHTML &&
                        <div className="row" id="projectLinks">
                            <div className="projectHeader" id="linksHeader" >
                                Links
                            </div>
                            { project.linksHTML() }
                        </div>
                    }

                </div>
            </>
        }
        </div>
    );

}


export default ProjectPage;