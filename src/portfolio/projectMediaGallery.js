import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export const ProjectMediaGallery = ({projectKey, numOfFiles, fileFormat}) => {
    const [open, setOpen] = React.useState(false);
    const [index, setIndex] = React.useState(-1);

    const getImagePath = (index, isThumbnail) => {
        return (process.env.PUBLIC_URL + mediaPath + fileFormat + "_" + index + (isThumbnail? "_thumb." : "." ) + fileFormat);
    }
    
    const mediaPath = "/project_content/" + projectKey + "/images/";
    const mediaLinks = [];

    const indices = [];
    for (let i = 1; i <= numOfFiles; i++) {
        indices.push(i);

        mediaLinks.push( {src: getImagePath(i, false)} );
    }


    return (
        <div className=" projectGallery">
            
            { indices.map(index => {
                return (
                    <img
                        src={getImagePath(index, true)}
                        key={index}
                        onClick={({}) => { 
                            setIndex(index - 1);
                            setOpen(true); 
                        }}
                    />
                ); })
            }
            
            <Lightbox 
                open={open} 
                close={() => {
                    setIndex(-1);
                    setOpen(false);
                }}
                slides={mediaLinks} 
                index={index}
                plugins={[Thumbnails]}
            />
        
        </div>
    );


}


export default ProjectMediaGallery;