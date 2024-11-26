
export const ProjectType = {
    PREMIUM: "Premium",
    FREEWARE: "Freeware",
    PROTOTYPE: "Prototype",
    GAMEJAM: "Game Jam Submission"
};


export const ProjectData = {

    "waidas": {
        title: "Why Am I Dead at Sea",
        logo: "waidas_logo.png",

        subjectHTML: () => {
            return (
                <div>
                    <iframe style={{width: "100%", maxWidth: "640px" }} width="640" height="360" src="//www.youtube.com/embed/dy2j7qpt7v0?autohide=1&showinfo=0&rel=0\" allowFullScreen></iframe>
                    <br/>
                </div>
            );
        },

        audienceTextHTML: () => {
            return (
                <span>
                    You are on a boat at sea.
                    <br/><br/>
                    Also, you are dead.
                    <br/><br/>
                    To figure out why, you will need to inhabit the other residents of the ship and use them to investigate what led to your untimely demise. 
                    As a ghost, you can take control of characters in the game, and talk to others - based on who you are controlling and who you are talking to, there is a unique conversation. 
                    With each combination of characters leading to a different interaction based on their relationship or chemistry, 
                    your challenge is to find the interactions that will reveal pertinent information. Understand what makes your shipmates tick, and uncover the secrets that they hold.
                    <br/><br/>
                    <ul>
                        <li>Investigate an intricate mystery where few are who they seem and everyone has a secret.</li>
                        <li>Meet nine unique and developed characters, with their own personal fears and ambitions.</li>
                        <li>Use your ghost powers to possess bodies and read minds.</li>
                        <li>Recover your former identity to upgrade your ghastly powers.</li>
                        <li>Unlock multiple endings and decide the fate of the story.</li>
                    </ul>
                    <br/>
                    The game also features <a href="https://billkiley.bandcamp.com/album/why-am-i-dead-at-sea-ost\">an amazing soundtrack by Bill Kiley.</a>
                </span>
            );
        },

        images: 6,
        gifs: 6,

        reviewsHTML: () => {
            return (
                <>
                    <p>
                        "Why Am I Dead At Sea is certainly worth playing for the incredible atmosphere and compelling characters."<br/>
                        <a href="https://gamerant.com/why-am-i-dead-at-sea-reviews/">- GameRant</a>  
                    </p>
                    <p>
                        "If you like mysteries, are in the mood for something a little different, and don't mind a game that's mostly reading dialogue, there's a lot to enjoy in this indie title.\"<br/>
                        <a href="https://adventuregamers.com/articles/view/29081">- Adventure Gamers</a>
                    </p>
                    <p>
                        "The characters are suspicious or endearing, relatable or repulsive. They have depth and the story kept me guessing. 
                        Every time I thought I'd solved a mystery, two stranger ones took its place. There is much more to this story than I expected when starting it up for the first time."
                        <br/>
                        <a href="https://techraptor.net/gaming/previews/coverage-club-why-am-i-dead-at-sea-asks-real-questions">- TechRaptor</a>
                    </p>
                </>
            );
        }
        
    }

}

