
export const ProjectType = {
    PREMIUM: "Premium",
    FREEWARE: "Freeware",
    PROTOTYPE: "Prototype",
    GAMEJAM: "Game Jam Submission"
};


export const ProjectData = {

    "waid": {
        title: "Why Am I Dead",
        logo: "waid_logo.png",
        contentType: "flash",        

        subjectHTML: () => {
            return (
                <object type="application/x-shockwave-flash" data="../project_content/waid/Shade.swf" height="540" width="400"></object>
            );
        },
        audienceTextHTML: () => {
            return ( 
                <span>
                    <p>
                        Why Am I Dead is a retro-style mystery game in which you play as a disembodied ghost. Your goal is to take control of the inhabitants of the hotel in which you died, and use their perspectives to figure out who killed you. It's not about finding physical clues, but instead about figuring out how to get information out of people using your ability to take on different forms.
                    </p>
                </span>
            );
        },
        devTextHTML: () => {
            return (<>
                <p>
                    Why Am I Dead is the first game I published, made in order to to help teach myself Flash and Actionscript 3. The original idea was more of a puzzle game where the player would take control of and directly move abstract 'pieces' around, but it quickly became an investigative/mystery game with distinct characters and a supernatural premise.
                </p>
                <p>
                    The game received a limited-exclusivity sponsorship and was then released to major web portals to a generally positive reception.
                </p>
            </>
        ); },
        linksHTML: () => { return (
            <>
                <p>
                    "...it is an ambitious, atmospheric work reminiscent of Hotel Dusk or Colonel's Bequest, and it has quite the killer ending."
                    <br />
                    <a href="https://jayisgames.com/review/why-am-i-dead.php">- JayisGames Review</a>
                </p>
                <p>
                    "Why Am I Dead? is full of potential...With such a promising mechanic, I hope WAID ends up being more of a proof of concept for a bigger project."
                    <br />
                    <a href="https://gamecola.net/2012/11/nsfw-why-am-i-dead-pc/">- GameCola Review</a>"
                </p>
                <p>
                    "Why Am I Dead? is brilliant enough to be worth a few confused hours this late Sunday evening.",
                    <br />
                    <a href="https://indiegamesplus.com/2012/11/browser_game_pick_why_am_i_dea">- IndieGames.com</a>
                </p>
                <p>
                    <a href="https://www.newgrounds.com/portal/view/606173">Newgrounds Page</a>
                </p>
                <p>
                    <a href="https://www.kongregate.com/games/peltast/why-am-i-dead">Kongregate Page</a>
                </p>
            </>
        ); },
        
        "images": 5
    },
    "waidr": {
        title: "Why Am I Dead: Rebirth",
        logo: "waidr_logo.png",
        contentType: "flash",        

        subjectHTML: () => {
            return (
                <object type="application/x-shockwave-flash" data="../project_content/waidr/WhyAmIDeadRebirth.swf" height="540" width="400"></object>
            );
        },
        audienceTextHTML: () => {
            return ( 
                <span>
                    <p>
                        Why Am I Dead: Rebirth is an adventure game where you are trying to solve your own murder. As a ghost, you have the ability to control other people and use them to investigate your untimely demise.
                    </p>
                    <p>
                        This is a remake of the original Flash game "Why Am I Dead" in an updated code-base. All of the original art and writing were redone, edited, or added to, and new content was added in the form of brand new endings for the player to find.
                    </p>
                </span>
            );
        },
        devTextHTML: () => {
            return (<>
                <p>
                    Why Am I Dead: Rebirth is an atypical project - free browser games don't usually get a reboot.
                </p>
                <p>
                    While I was working on the sequel Why Am I Dead at Sea, I really wanted to have a smaller, less ambitious project for sake of variety. To ensure that this side project didn't succumb to scope-creep or distract me from the sequel's development, I decided on remaking the original flash game.
                </p>
                <p>
                    Rebirth makes use of additions I had created for the sequel, such as tracking/displaying visited dialogue, a save/load system, and characters'  pathfinding and routine behaviors. Overall, it was fun to put a new spin on the original game's art, writing, and design using what I had learned since its release.
                </p>
            </>
        ); },
        linksHTML: () => { return (
            <>
                <p>
                    "The two questions that every remake has to answer are whether it's worth it for new players, and worth it for those who've played the original. Why Am I Dead?: Rebirth scores well on both counts, with an improved control scheme, refinements to the plot, and gobs of new content."
                    <br />
                    <a href="https://jayisgames.com/review/why-am-i-dead.php">- JayisGames Review</a>
                </p>
                <p>
                    <a href="https://www.newgrounds.com/portal/view/646983">Newgrounds Page</a>
                </p>
                <p>
                    <a href="https://www.kongregate.com/games/peltast/why-am-i-dead-rebirth">Kongregate Page</a>
                </p>
            </>
        ); },
        
        "images": 5
    },

    "waidas": {
        title: "Why Am I Dead at Sea",
        logo: "waidas_logo.png",
        contentType: "youtube",

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
        
    },

    "aboutface": {
        title: "about-face",
        logo: "about-face_logo.png",
        contentType: "flash",        

        subjectHTML: () => {
            return (
                <object type="application/x-shockwave-flash" data="../project_content/aboutface/about-face.swf" height="600" width="840"></object>
            );
        },
        audienceTextHTML: () => {
            return ( 
                <span>
                    <p>Hi! Would you like to go on an adventure? If you learn to change yourself, there's nothing that can stand in your way!</p>
                    <p>...</p>
                    <p>There's no point in trying. You should do yourself a favor and give up now.</p>
                </span>
            );
        },
        devTextHTML: () => {
            return (
                <p>
                    about-face was the last game I published using Flash/AS3 and served as a fun exercise in level design and minimalist player guidance.
                </p>
            );
        },
        
        "gifs": 3,
        "images": 5
    },

    "jidan": {
        title: "Jidan Havoc",
        logo: "jidan_logo.png",
        contentType: "javascript",

        subjectHTML: () => {
            return (
                <iframe src="../project_content/jidan/index.html" width="640" height="480" frameBorder="0" scrolling="no" />
            );
        },
        audienceTextHTML: () => {
            return (
                <p>
                    Jump, dive, and slam through levels, stringing together combos by chaining attacks between enemies.
                    Your performance is ranked after each level based on collectibles, enemies, and score.
                    Earn enough ranks to unlock more levels, to earn more ranks, to unlock more levels, and so on.
                </p>
            );
        },
        devTextHTML: () => {
            return (
                <p>
                    Jidan Havoc was made with CreateJS and is my first full game published with HTML5/Javascript.
                </p>
            );
        }
    },

    "ygtta": {
        title: "Your Guide to the Afterlife",
        logo: "ygtta_logo.png",
        contentType: "youtube",

        subjectHTML: () => {
            return (
                <div>
                    <iframe style={{width: "100%", maxWidth: "560px" }} width="560" height="315" src="https://www.youtube.com/embed/J5Almslel9M" allowFullScreen></iframe>
                    <br/>
                </div>
            );
        },
        audienceTextHTML: () => {
            return (
                <>
                    <p>
                        If you died today, what would you do tomorrow?
                    </p>
                    <p>
                        Your Guide to the Afterlife is an adventure game focused on discovery and self-efficacy, where you will explore a disheveled world on the brink of collapse. You will have to set your own checkpoints, create your own shortcuts, and carve your own paths to make any progress. You won't be completely alone, though - all sorts of characters have found their way here, each with their own story to tell, and with their own endings in mind.
                    </p>
                    <p>
                        This project is still in development and is subject to change.  The gameplay footage shown is not fully representative of how the finished game will look.
                    </p>
                </>
            );
        },
        gifs: 4
    },

    "ggj2018": {
        title: "Signal Boost",
        logo: "ggj2018_logo.png",
        contentType: "javascript",

        subjectHTML: () => {
            return (
                <iframe src="../project_content/ggj2018/index.html" width="800" height="800" frameBorder="0" scrolling="no" />
            );
        },
        audienceTextHTML: () => {
            return ( <>
                    <p>
                        Signal Boost is a toy in which you click nodes to send signals in a map of competing signals and try to have your signal adopted by the map in as few actions as possible.
                    </p>
                    <p>
                        Each map is procedurally generated with four starting signals that quickly spread, represented by different colors. Once a node has a signal, the player can click on it to take it over, and transmit their own signal from that node. Clicking and holding will result in a much larger transmission, but drains a resource that replenishes automatically over time.
                    </p>
                    <p>
                        Each node has a memory of the signals it has received recently, and is colored with the blend of those signals to represent the state of that node. The more conflicting signals a node has, the smaller its transmission range is, resulting in contested areas between competing signals.
                    </p>
                </>
            );
        },
        devTextHTML: () => {
            return ( <>
                    <p>
                        Made in 48 hours for Global Game Jam 2018 with the theme of "transmission".
                    </p>
                    <p>
                        This was my first experience making something purely in Javascript using CreateJS. It is an admittedly smaller submission than normal for me, largely due to spending some time upfront deciding on how I wanted to approach working with CreateJS.
                    </p>
                </>
            );
        }
    },
    "ggj2019": {
        title: "Weekend Trip to Space",
        logo: "ggj2019_logo.png",
        contentType: "javascript",

        subjectHTML: () => {
            return (
                <iframe src="../project_content/ggj2019/index.html" width="640" height="480" frameBorder="0" scrolling="no" />
            );
        },
        audienceTextHTML: () => {
            return ( <>
                    <p>
                        Build up speed to jump, fly and float your way to the moon!
                    </p>
                    <p>
                        <ul>
                            <li>A/D or arrow keys to move</li>
                            <li>Enter / Shift / Z to jump</li>
                            <li>After building enough running speed, you can make a flying jump</li>
                            <li>While flying, you have a double jump, and can hold backwards for extra air, or forwards to maintain your speed.</li>
                        </ul>
                    </p>
                </>
            );
        },
        devTextHTML: () => {
            return ( <>
                    <p>
                        Made in 48 hours for Global Game Jam 2019 with the theme of "what home means to you".
                    </p>
                    <p>
                        This was primarily an experiment with platforming physics.  The player's movement is very heavily momentum-based, making the tight spaces at the beginning of the game far more difficult to navigate than they would be in a precision platformer.  As the player progresses, the terrain opens up, allowing the player to run longer distances and build up more and more momentum, until they can finally take flight, at which point the player's physics change to become more lenient.  Finally the game completely opens up and allows free movement when the player reaches space.
                    </p>
                </>
            );
        }
    },
    "ggj2020": {
        title: "OverWorkFlow",
        logo: "ggj2020_logo.png",
        contentType: "javascript",

        subjectHTML: () => {
            return (
                <iframe src="../project_content/ggj2020/index.html" width="960" height="640" frameBorder="0" scrolling="no" />
            );
        },
        audienceTextHTML: () => {
            return ( <>
                    <p>
                        Keep your thoughts organized to balance the constantly changing demands of work!
                    </p>
                    <p>
                        Click the blue nodes on the left to change the paths that signals will travel through. Where they land at the bottom determines what your player will do: move to the left, right, or stand still. Work will pile up at different stations, so make sure you get to them fast enough!
                    </p>
                    <p>
                        <ul>
                            <li>When you clear through work, new signals will pour in to help you get to the next station</li>
                            <li>If work piles up too high, it will create negative signals, which change the pathways, messing up your plans</li>
                            <li>If a node is switched too much it will overheat and eventually burn out, creating a fire signal that will disable whichever node it reaches</li>
                        </ul>
                    </p>
                    <p>
                        Press R to reset the game at any time.  There is no game over state; just try to get as much work done before you're overwhelmed!
                    </p>
                </>
            );
        },
        devTextHTML: () => {
            return ( <>
                    <p>
                        Made in 48 hours for Global Game Jam 2018 with the theme of "repair".
                    </p>
                    <p>
                        This submission is quite punishing - I was trying to create the feeling of narrowly holding off disaster, but I overdid it a little and it seems to always lead to disaster pretty quickly! That said, I'm still happy with what I came up with for this game jam.  I have plenty of ideas on how I could improve the game's balance, and I think the concept has a lot of potential.  I'd definitely like to return to this and see where it leads.
                    </p>
                </>
            );
        }
    },
    
    "pgj2019": {
        title: "You Have to Catch Your Breath",
        logo: "pgj2019_logo.png",
        contentType: "javascript",

        subjectHTML: () => {
            return (
                <iframe src="../project_content/pgj2019/index.html" width="960" height="640" frameBorder="0" scrolling="no" />
            );
        },
        audienceTextHTML: () => {
            return ( <>
                    <p>Venture out and return all of the stars to the center of the map!</p>
                    <p>
                        <ul>
                            <li>WASD or Arrow keys to move</li>
                            <li>Hold Space to charge up, then release to attack</li>
                            <li>Press R to reset the stage</li>
                            <li>Be careful: the more you charge up your attacks, the more time it takes for you to recover!</li>
                            <li>You can only carry one star at a time.  Each one you return will reduce the recovery time on your attacks.</li>
                        </ul>
                    </p>
                </>
            );
        },
        devTextHTML: () => {
            return ( <>
                    <p>
                        Made in 24 hours for Philly Game Jam 2019 with the theme of "recovery".
                    </p>
                    <p>
                        I struggled a bit with this theme, and chose a perhaps overly literal interpretation - the recovery frames that are at least a small part of most action games. Here the recovery is exaggerated to the point of being punishing, forcing the player to weigh the risk and reward of charging up their attack. The more they do, the easier it is to land attacks against enemies seeking to surround them, but it also leaves them more vulnerable.
                    </p>
                    <p>
                        A detail worth noting is that the player's sweeping attack will start from one of eight angles based on which direction the player is facing.
                    </p>
                </>
            );
        }
    },


}

