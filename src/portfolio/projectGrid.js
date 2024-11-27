import React from "react";
import { Link } from "react-router-dom";


const ProjectGrid = () => {
    const [isHovering, setHover] = React.useState(false);
    const [image, setImage] = React.useState("/images/waidas_static.png");

    function animateTileImage() {
        setImage("/images/waidas.gif");
        setHover(true);
    }
    function deanimateTileImage() {
        setImage("/images/waidas_static.png");
        setHover(false);
    }

    return (
        <div className="homeProjectTile" 
        onMouseOver={animateTileImage} 
        onMouseLeave={deanimateTileImage}>
            <div>
                <div className={ isHovering ? "homeProjectHeaderHover homeProjectHeader" : "homeProjectHeader" }>
                    <div className="homeProjectTitle">Why Am I Dead at Sea</div>
                    Premium
                </div>
                {/* <a className="homeProjectTile" href=""> */}
                <Link to="/projectPage/waidas">
                    <img
                        src={process.env.PUBLIC_URL + image}
                    />
                {/* </a> */}
                </Link>
            </div>
        </div>
    );
}

export default ProjectGrid;