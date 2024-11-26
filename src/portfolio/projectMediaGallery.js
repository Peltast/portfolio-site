
export const ProjectMediaGallery = ({projectKey, numOfFiles, fileFormat}) => {


    const mediaPath = "/project_content/" + projectKey + "/images/";

    const indices = [];
    for (let i = 1; i <= numOfFiles; i++) {
        indices.push(i);
    }

    const getImagePath = (index, isThumbnail) => {
        return (process.env.PUBLIC_URL + mediaPath + fileFormat + "_" + index + (isThumbnail? "_thumb." : "." ) + fileFormat);
    }

    return (
        <div className="col projectGallery">
            
            { indices.map(index => {
                return (
                    <a href={getImagePath(index, false)} key={index} data-lightbox={fileFormat}>
                        <img src={getImagePath(index, true)} key={index} />
                    </a>
                ); })
            }
        
        </div>
    );


}


export default ProjectMediaGallery;