import React from "react";
import { Link } from "react-router-dom";
import { ProjectGridData } from "../projectGridData";


const ProjectGrid = () => {

    const createProjectRows = () => {
        const projectRows = {};
        Object.keys(ProjectGridData).forEach(key => {

            const projectRowNum = ProjectGridData[key].row;

            if (!Object.hasOwn(projectRows, projectRowNum)) {
                projectRows[projectRowNum] = [];
            }

            projectRows[projectRowNum][key] = ProjectGridData[key];
        });
        return projectRows;
    }

    const projectRows = createProjectRows();
    
    return (
        <div className="row homeItem homeProjectGrid">
            { Object.keys(projectRows).map(key => {
                const projectRow = projectRows[key];
                
                return (
                    <div key={ key } >
                        { Object.keys(projectRow).map( projectKey => {

                            const title = ProjectGridData[projectKey].title;
                            const type = ProjectGridData[projectKey].type;

                            return (
                                <ProjectTile key={key + "-" + projectKey} projectKey={projectKey} projectTitle={title} projectType={type} />
                            );
                        })}
                    </div>
                );
                
            })}
        </div>
    );
}

const ProjectTile = ({ projectKey, projectTitle, projectType }) => {
    const [isHovering, setHover] = React.useState(false);
    const [image, setImage] = React.useState("/images/" + projectKey + "_static.png");

    function animateTileImage() {
        setImage("/images/" + projectKey + ".gif");
        setHover(true);
    }
    function deanimateTileImage() {
        setImage("/images/" + projectKey + "_static.png");
        setHover(false);
    }
    
    return (
        <div className="homeProjectTile" 
            onMouseOver={animateTileImage} 
            onMouseLeave={deanimateTileImage}
        >

            <div className={ isHovering ? "homeProjectHeaderHover homeProjectHeader" : "homeProjectHeader" }>
                <div className="homeProjectTitle">
                    { projectTitle }
                </div>
                { projectType }
            </div>

            <Link to={"/projectPage?key=" + projectKey} >
                <img src={process.env.PUBLIC_URL + image} />
            </Link>

        </div>
    );
}

export default ProjectGrid;